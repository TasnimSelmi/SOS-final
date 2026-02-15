const express = require("express");
const { body, validationResult } = require("express-validator");
const Report = require("../models/Report");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { auth, authorize } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const {
  sendNotificationToUser,
  sendNotificationToVillage,
  sendNotificationToRole,
} = require("../socket");

const router = express.Router();

// @route   POST /api/reports
// @desc    Create new report (Level 1 - Declarants)
// @access  Private (Declarants)
router.post(
  "/",
  auth,
  authorize("mere", "tante", "educateur"),
  upload.array("attachments", 5),
  [
    body("childName")
      .trim()
      .notEmpty()
      .withMessage("Le nom de l'enfant est obligatoire"),
    body("childAge")
      .optional({ nullable: true, checkFalsy: true })
      .isInt({ min: 0, max: 18 })
      .withMessage("L'âge doit être entre 0 et 18 ans"),
    body("childGender")
      .isIn(["male", "female", "other"])
      .withMessage("Genre invalide"),
    body("village").trim().notEmpty().withMessage("Le village est obligatoire"),
    body("incidentType")
      .isIn([
        "sante",
        "comportement",
        "violence",
        "negligence",
        "abus",
        "autre",
      ])
      .withMessage("Type d'incident invalide"),
    body("incidentDate")
      .notEmpty()
      .withMessage("La date de l'incident est obligatoire"),
    body("urgencyLevel")
      .isIn(["faible", "moyen", "critique"])
      .withMessage("Niveau d'urgence invalide"),
    body("description")
      .trim()
      .isLength({ min: 10 })
      .withMessage("La description doit contenir au moins 10 caractères"),
  ],
  async (req, res) => {
    try {
      console.log("=== CREATE REPORT REQUEST ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      console.log("Request files:", req.files);
      console.log("User:", req.user.fullName, req.user.role);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error("Validation errors:", errors.array());
        return res.status(400).json({
          status: "error",
          message: "Données invalides",
          errors: errors.array(),
        });
      }

      const {
        childName,
        childAge,
        childGender,
        village,
        program,
        incidentType,
        incidentDate,
        urgencyLevel,
        description,
        abuserName,
        abuserRole,
        isAnonymous,
      } = req.body;

      // Process attachments
      const attachments = req.files
        ? req.files.map((file) => ({
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
          }))
        : [];

      // Create report with initialized workflow steps
      const report = new Report({
        reportId: `RPT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        declarant: req.user._id,
        isAnonymous: isAnonymous === "true",
        childName,
        childAge,
        childGender,
        village,
        program,
        incidentType,
        incidentDate: new Date(incidentDate),
        urgencyLevel,
        description,
        abuserName,
        abuserRole,
        attachments,
        status: "en_attente",
        workflowSteps: [
          {
            stepNumber: 1,
            title: "Fiche initiale + Rapport DPE",
            description:
              "Création de la fiche initiale de signalement et du rapport DPE",
            status: "pending",
            deadline: new Date(
              Date.now() +
                (urgencyLevel === "critique"
                  ? 1
                  : urgencyLevel === "moyen"
                    ? 3
                    : 7) *
                  24 *
                  60 *
                  60 *
                  1000,
            ),
          },
          {
            stepNumber: 2,
            title: "Évaluation complète",
            description: "Évaluation complète de la situation de l'enfant",
            status: "pending",
            deadline: new Date(
              Date.now() +
                (urgencyLevel === "critique"
                  ? 3
                  : urgencyLevel === "moyen"
                    ? 7
                    : 14) *
                  24 *
                  60 *
                  60 *
                  1000,
            ),
          },
          {
            stepNumber: 3,
            title: "Plan d'action",
            description: "Élaboration du plan d'action pour la prise en charge",
            status: "pending",
            deadline: new Date(
              Date.now() +
                (urgencyLevel === "critique"
                  ? 5
                  : urgencyLevel === "moyen"
                    ? 10
                    : 21) *
                  24 *
                  60 *
                  60 *
                  1000,
            ),
          },
          {
            stepNumber: 4,
            title: "Rapport de suivi",
            description:
              "Suivi de l'évolution et documentation des actions entreprises",
            status: "pending",
            deadline: new Date(
              Date.now() +
                (urgencyLevel === "critique"
                  ? 10
                  : urgencyLevel === "moyen"
                    ? 20
                    : 30) *
                  24 *
                  60 *
                  60 *
                  1000,
            ),
          },
          {
            stepNumber: 5,
            title: "Rapport final",
            description: "Rapport final de clôture du dossier",
            status: "pending",
            deadline: new Date(
              Date.now() +
                (urgencyLevel === "critique"
                  ? 15
                  : urgencyLevel === "moyen"
                    ? 30
                    : 60) *
                  24 *
                  60 *
                  60 *
                  1000,
            ),
          },
          {
            stepNumber: 6,
            title: "Avis de clôture",
            description: "Validation finale et archivage sécurisé",
            status: "pending",
            deadline: new Date(
              Date.now() +
                (urgencyLevel === "critique"
                  ? 20
                  : urgencyLevel === "moyen"
                    ? 35
                    : 70) *
                  24 *
                  60 *
                  60 *
                  1000,
            ),
          },
        ],
        currentStep: 0,
      });
      console.log("Saving report to database...");
      await report.save();

      // Find and auto-assign to village psychologue
      const villagePsychologue = await User.findOne({
        role: "psychologue",
        village: village,
        isActive: true,
      });

      if (villagePsychologue) {
        report.assignedTo = villagePsychologue._id;
        report.assignedAt = new Date();
        report.status = "en_cours";

        report.history.push({
          action: "Assignation automatique",
          performedBy: req.user._id,
          details: `Signalement assigné automatiquement au psychologue du village: ${villagePsychologue.fullName}`,
        });

        await report.save();

        // Notify assigned psychologue
        await Notification.create({
          recipient: villagePsychologue._id,
          type: "report_assigned",
          title: "Nouveau signalement assigné",
          message: `Un signalement (${report.reportId}) du village ${village} vous a été assigné automatiquement.`,
          relatedReport: report._id,
          priority: urgencyLevel === "critique" ? "urgent" : "high",
          link: `/reports/${report._id}`,
        });

        // Real-time notification
        sendNotificationToUser(villagePsychologue._id.toString(), {
          type: "report_assigned",
          title: "Nouveau signalement assigné",
          message: `Signalement ${report.reportId} du village ${village} assigné automatiquement.`,
          relatedReport: report._id,
          priority: urgencyLevel === "critique" ? "urgent" : "high",
          link: `/reports/${report._id}`,
          createdAt: new Date(),
        });
      }

      // Add to history
      report.history.push({
        action: "Création du signalement",
        performedBy: req.user._id,
        details: `Signalement créé par ${req.user.fullName}`,
      });
      await report.save();

      // Notify analysts (psychologues) - both DB and real-time
      const analysts = await User.find({
        role: "psychologue",
        isActive: true,
      });

      if (analysts.length > 0) {
        // Create DB notifications
        await Notification.createForNewReport(report, analysts);

        // Send real-time notifications
        analysts.forEach((analyst) => {
          sendNotificationToUser(analyst._id.toString(), {
            type: "new_report",
            title: "Nouveau signalement",
            message: `Un nouveau signalement (${report.reportId}) a été créé dans le village ${village}.`,
            relatedReport: report._id,
            priority:
              urgencyLevel === "critique"
                ? "urgent"
                : urgencyLevel === "moyen"
                  ? "high"
                  : "normal",
            link: `/reports/${report._id}`,
            createdAt: new Date(),
          });
        });
      }

      // Also notify village psychologues
      sendNotificationToVillage(village, {
        type: "new_report",
        title: "Nouveau signalement village",
        message: `Un signalement a été créé dans votre village ${village}.`,
        relatedReport: report._id,
        priority:
          urgencyLevel === "critique"
            ? "urgent"
            : urgencyLevel === "moyen"
              ? "high"
              : "normal",
        link: `/reports/${report._id}`,
        createdAt: new Date(),
      });

      // Notify Directeur village (decideur1) and Bureau National (decideur2) for DPE report
      const directeurs = await User.find({
        role: { $in: ["decideur1", "decideur2"] },
        village: village,
        isActive: true,
      });

      directeurs.forEach(async (directeur) => {
        await Notification.create({
          recipient: directeur._id,
          type: "new_report",
          title: "Nouveau signalement - Notification DPE",
          message: `Un nouveau signalement (${report.reportId}) nécessite votre attention dans le village ${village}.`,
          relatedReport: report._id,
          priority: urgencyLevel === "critique" ? "urgent" : "high",
          link: `/reports/${report._id}`,
        });

        sendNotificationToUser(directeur._id.toString(), {
          type: "new_report",
          title: "Nouveau signalement - Notification DPE",
          message: `Signalement ${report.reportId} du village ${village} nécessite votre attention.`,
          relatedReport: report._id,
          priority: urgencyLevel === "critique" ? "urgent" : "high",
          link: `/reports/${report._id}`,
          createdAt: new Date(),
        });
      });

      res.status(201).json({
        status: "success",
        message: "Signalement créé avec succès",
        data: {
          report: {
            id: report._id,
            reportId: report.reportId,
            status: report.status,
            childName: report.childName,
            village: report.village,
            urgencyLevel: report.urgencyLevel,
            createdAt: report.createdAt,
          },
        },
      });
    } catch (error) {
      console.error("=== CREATE REPORT ERROR ===");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      if (error.errors) {
        console.error("Validation errors:", error.errors);
      }
      res.status(500).json({
        status: "error",
        message: "Erreur lors de la création du signalement",
        details: error.message,
      });
    }
  },
);

// @route   GET /api/reports
// @desc    Get all reports (filtered by role)
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const {
      status,
      urgencyLevel,
      village,
      incidentType,
      classification,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter based on user role
    const filter = {};

    // Level 1: See only their own reports
    if (["mere", "tante", "educateur"].includes(req.user.role)) {
      filter.declarant = req.user._id;
    }

    // Level 2 & 3: See all reports (with optional filters)
    if (status) {
      // Support comma-separated status values
      if (status.includes(",")) {
        filter.status = { $in: status.split(",") };
      } else {
        filter.status = status;
      }
    }
    if (urgencyLevel) filter.urgencyLevel = urgencyLevel;
    if (village) filter.village = village;
    if (incidentType) filter.incidentType = incidentType;
    if (classification) {
      // Support comma-separated classification values
      if (classification.includes(",")) {
        filter.classification = { $in: classification.split(",") };
      } else {
        filter.classification = classification;
      }
    }

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reports = await Report.find(filter)
      .populate("declarant", "firstName lastName fullName")
      .populate("assignedTo", "firstName lastName fullName")
      .populate("classifiedBy", "firstName lastName")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(filter);

    res.json({
      status: "success",
      data: {
        reports: reports.map((report) => ({
          id: report._id,
          reportId: report.reportId,
          status: report.status,
          statusDisplay: Report.getStatusDisplayName(report.status),
          childName: report.childName,
          village: report.village,
          incidentType: report.incidentType,
          urgencyLevel: report.urgencyLevel,
          urgencyColor: Report.getUrgencyColor(report.urgencyLevel),
          isAnonymous: report.isAnonymous,
          declarant: report.isAnonymous ? null : report.declarant,
          assignedTo: report.assignedTo,
          classification: report.classification,
          createdAt: report.createdAt,
          daysSinceCreation: report.daysSinceCreation,
          isOverdue: report.isOverdue,
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get reports error:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des signalements",
    });
  }
});

// @route   GET /api/reports/:id
// @desc    Get single report by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("declarant", "firstName lastName fullName email role")
      .populate("assignedTo", "firstName lastName fullName email")
      .populate("classifiedBy", "firstName lastName fullName")
      .populate("decision.madeBy", "firstName lastName fullName role")
      .populate("history.performedBy", "firstName lastName fullName");

    if (!report) {
      return res.status(404).json({
        status: "error",
        message: "Signalement non trouvé",
      });
    }

    // Check permissions
    const isDeclarant =
      report.declarant._id.toString() === req.user._id.toString();
    const isAnalyst = [
      "psychologue",
      "decideur1",
      "decideur2",
      "admin",
    ].includes(req.user.role);

    if (!isDeclarant && !isAnalyst) {
      return res.status(403).json({
        status: "error",
        message: "Accès interdit",
      });
    }

    res.json({
      status: "success",
      data: {
        report: {
          id: report._id,
          reportId: report.reportId,
          declarant: report.isAnonymous ? null : report.declarant,
          isAnonymous: report.isAnonymous,
          childName: report.childName,
          childAge: report.childAge,
          childGender: report.childGender,
          village: report.village,
          program: report.program,
          incidentType: report.incidentType,
          incidentDate: report.incidentDate,
          urgencyLevel: report.urgencyLevel,
          description: report.description,
          abuserName: report.abuserName,
          abuserRole: report.abuserRole,
          attachments: report.attachments,
          status: report.status,
          statusDisplay: Report.getStatusDisplayName(report.status),
          classification: report.classification,
          classifiedBy: report.classifiedBy,
          classifiedAt: report.classifiedAt,
          classificationNotes: report.classificationNotes,
          assignedTo: report.assignedTo,
          assignedAt: report.assignedAt,
          workflowSteps: report.workflowSteps,
          currentStep: report.currentStep,
          decision: report.decision,
          documents: report.documents,
          history: report.history,
          createdAt: report.createdAt,
          updatedAt: report.updatedAt,
          daysSinceCreation: report.daysSinceCreation,
          isOverdue: report.isOverdue,
        },
      },
    });
  } catch (error) {
    console.error("Get report error:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération du signalement",
    });
  }
});

// @route   PUT /api/reports/:id/classify
// @desc    Classify report (Level 2 - Analysts)
// @access  Private (Analysts)
router.put(
  "/:id/classify",
  auth,
  authorize("psychologue", "decideur1", "decideur2", "admin"),
  [
    body("classification")
      .isIn(["sauvegarde", "prise_en_charge", "faux_signalement"])
      .withMessage("Classification invalide"),
    body("notes").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Données invalides",
          errors: errors.array(),
        });
      }

      const { classification, notes } = req.body;

      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Signalement non trouvé",
        });
      }

      // Can only classify pending or in-progress reports
      if (!["en_attente", "en_cours"].includes(report.status)) {
        return res.status(400).json({
          status: "error",
          message: "Ce signalement ne peut plus être classifié",
        });
      }

      // Update classification
      report.classification = classification;
      report.classifiedBy = req.user._id;
      report.classifiedAt = new Date();
      report.classificationNotes = notes;

      // Update status based on classification
      if (classification === "faux_signalement") {
        report.status = "faux";
      } else if (classification === "sauvegarde") {
        report.status = "sauvegarde";
      } else if (classification === "prise_en_charge") {
        report.status = "pris_en_charge";
      }

      // Add to history
      report.history.push({
        action: "Classification du signalement",
        performedBy: req.user._id,
        details: `Classifié comme: ${classification}`,
      });

      await report.save();

      // Notify declarant
      await Notification.create({
        recipient: report.declarant,
        type: "report_classified",
        title: "Signalement classifié",
        message: `Votre signalement ${report.reportId} a été classifié comme ${classification}.`,
        relatedReport: report._id,
        priority: "normal",
        link: `/reports/${report._id}`,
      });

      res.json({
        status: "success",
        message: "Signalement classifié avec succès",
        data: {
          report: {
            id: report._id,
            status: report.status,
            classification: report.classification,
            classifiedBy: req.user.fullName,
            classifiedAt: report.classifiedAt,
          },
        },
      });
    } catch (error) {
      console.error("Classify report error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de la classification",
      });
    }
  },
);

// @route   PUT /api/reports/:id/assign
// @desc    Assign report to analyst
// @access  Private (Analysts)
router.put(
  "/:id/assign",
  auth,
  authorize("psychologue", "decideur1", "decideur2", "admin"),
  [body("userId").notEmpty().withMessage("ID utilisateur obligatoire")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Données invalides",
          errors: errors.array(),
        });
      }

      const { userId } = req.body;

      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Signalement non trouvé",
        });
      }

      // Check if user exists and is an analyst
      const user = await User.findById(userId);
      if (
        !user ||
        !["psychologue", "decideur1", "decideur2", "admin"].includes(user.role)
      ) {
        return res.status(400).json({
          status: "error",
          message: "Utilisateur invalide ou non autorisé",
        });
      }

      report.assignedTo = userId;
      report.assignedAt = new Date();
      report.status = "en_cours";

      // Add to history
      report.history.push({
        action: "Assignation du signalement",
        performedBy: req.user._id,
        details: `Assigné à ${user.fullName}`,
      });

      await report.save();

      // Notify assigned user
      await Notification.create({
        recipient: userId,
        type: "report_assigned",
        title: "Nouveau signalement assigné",
        message: `Le signalement ${report.reportId} vous a été assigné.`,
        relatedReport: report._id,
        priority: report.urgencyLevel === "critique" ? "urgent" : "high",
        link: `/reports/${report._id}`,
      });

      res.json({
        status: "success",
        message: "Signalement assigné avec succès",
        data: {
          report: {
            id: report._id,
            assignedTo: {
              id: user._id,
              fullName: user.fullName,
            },
            status: report.status,
          },
        },
      });
    } catch (error) {
      console.error("Assign report error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de l'assignation",
      });
    }
  },
);

// @route   PUT /api/reports/:id/decision
// @desc    Make decision on report (Level 3 - Directors)
// @access  Private (Directors, Admin)
router.put(
  "/:id/decision",
  auth,
  authorize("decideur1", "decideur2", "admin"),
  [
    body("decision")
      .isIn(["prise_en_charge", "sanction", "suivi", "escalade", "cloture"])
      .withMessage("Décision invalide"),
    body("details").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Données invalides",
          errors: errors.array(),
        });
      }

      const { decision, details } = req.body;

      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Signalement non trouvé",
        });
      }

      // Update decision
      report.decision = {
        type: decision,
        details,
        madeBy: req.user._id,
        madeAt: new Date(),
      };

      // Update status based on decision
      if (decision === "cloture") {
        report.status = "cloture";
      }

      // Add to history
      report.history.push({
        action: "Décision prise",
        performedBy: req.user._id,
        details: `Décision: ${decision}${details ? " - " + details : ""}`,
      });

      await report.save();

      // Notify relevant users
      await Notification.create({
        recipient: report.declarant,
        type: "decision_made",
        title: "Décision sur votre signalement",
        message: `Une décision a été prise sur votre signalement ${report.reportId}.`,
        relatedReport: report._id,
        priority: "high",
        link: `/reports/${report._id}`,
      });

      if (report.assignedTo) {
        await Notification.create({
          recipient: report.assignedTo,
          type: "decision_made",
          title: "Décision sur signalement assigné",
          message: `Une décision a été prise sur le signalement ${report.reportId}.`,
          relatedReport: report._id,
          priority: "high",
          link: `/reports/${report._id}`,
        });
      }

      // Notify decideurs if escalated
      if (decision === "escalade") {
        const decideurs = await User.find({
          role: { $in: ["decideur1", "decideur2"] },
          isActive: true,
        });
        decideurs.forEach(async (decideur) => {
          await Notification.create({
            recipient: decideur._id,
            type: "report_escalated",
            title: "Signalement escaladé",
            message: `Le signalement ${report.reportId} a été escaladé et nécessite votre attention.`,
            relatedReport: report._id,
            priority: "urgent",
            link: `/reports/${report._id}`,
          });
        });
      }

      res.json({
        status: "success",
        message: "Décision enregistrée avec succès",
        data: {
          report: {
            id: report._id,
            status: report.status,
            decision: report.decision,
          },
        },
      });
    } catch (error) {
      console.error("Decision error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de l'enregistrement de la décision",
      });
    }
  },
);

// @route   PUT /api/reports/:id/workflow/steps/:stepNumber/start
// @desc    Start a workflow step (Level 2)
// @access  Private (Psychologues, Admin)
router.put(
  "/:id/workflow/steps/:stepNumber/start",
  auth,
  authorize("psychologue", "admin"),
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Signalement non trouvé",
        });
      }

      const stepNumber = parseInt(req.params.stepNumber);
      const step = report.workflowSteps.find(
        (s) => s.stepNumber === stepNumber,
      );

      if (!step) {
        return res.status(404).json({
          status: "error",
          message: "Étape non trouvée",
        });
      }

      if (step.status === "completed") {
        return res.status(400).json({
          status: "error",
          message: "Cette étape est déjà complétée",
        });
      }

      step.status = "in_progress";
      step.startedAt = new Date();
      report.currentStep = stepNumber;

      report.history.push({
        action: `Étape ${stepNumber} démarrée`,
        performedBy: req.user._id,
        details: `${step.title} - en cours`,
      });

      await report.save();

      res.json({
        status: "success",
        message: "Étape démarrée",
        data: { step },
      });
    } catch (error) {
      console.error("Start workflow step error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors du démarrage de l'étape",
      });
    }
  },
);

// @route   PUT /api/reports/:id/workflow/steps/:stepNumber/complete
// @desc    Complete a workflow step (Level 2)
// @access  Private (Psychologues, Admin)
router.put(
  "/:id/workflow/steps/:stepNumber/complete",
  auth,
  authorize("psychologue", "admin"),
  [body("notes").optional().trim()],
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Signalement non trouvé",
        });
      }

      const stepNumber = parseInt(req.params.stepNumber);
      const step = report.workflowSteps.find(
        (s) => s.stepNumber === stepNumber,
      );

      if (!step) {
        return res.status(404).json({
          status: "error",
          message: "Étape non trouvée",
        });
      }

      if (step.status === "completed") {
        return res.status(400).json({
          status: "error",
          message: "Cette étape est déjà complétée",
        });
      }

      step.status = "completed";
      step.completedAt = new Date();
      step.completedBy = req.user._id;
      if (req.body.notes) step.notes = req.body.notes;

      report.history.push({
        action: `Étape ${stepNumber} complétée`,
        performedBy: req.user._id,
        details: `${step.title} - terminée`,
      });

      await report.save();

      // Notify if step 1 is completed (Fiche initiale + Rapport DPE)
      if (stepNumber === 1 && step.status === "completed") {
        // Notify Directeur village and Bureau National
        const directeurs = await User.find({
          role: { $in: ["decideur1", "decideur2"] },
          $or: [
            { village: report.village },
            { role: "decideur2" }, // Bureau National sees all villages
          ],
          isActive: true,
        });

        directeurs.forEach(async (directeur) => {
          await Notification.create({
            recipient: directeur._id,
            type: "workflow_step",
            title: "Rapport DPE disponible",
            message: `Le rapport DPE pour le signalement ${report.reportId} est disponible.`,
            relatedReport: report._id,
            priority: report.urgencyLevel === "critique" ? "urgent" : "high",
            link: `/reports/${report._id}`,
          });

          sendNotificationToUser(directeur._id.toString(), {
            type: "workflow_step",
            title: "Rapport DPE disponible",
            message: `Rapport DPE disponible pour le signalement ${report.reportId}.`,
            relatedReport: report._id,
            priority: report.urgencyLevel === "critique" ? "urgent" : "high",
            link: `/reports/${report._id}`,
            createdAt: new Date(),
          });
        });
      }

      // Notify if all steps are completed
      const allCompleted = report.workflowSteps.every(
        (s) => s.status === "completed",
      );
      if (allCompleted) {
        await Notification.create({
          recipient: report.declarant,
          type: "workflow_completed",
          title: "Toutes les étapes terminées",
          message: `Toutes les étapes du signalement ${report.reportId} sont complétées.`,
          relatedReport: report._id,
          priority: "high",
          link: `/reports/${report._id}`,
        });
      }

      res.json({
        status: "success",
        message: "Étape complétée",
        data: { step, allCompleted },
      });
    } catch (error) {
      console.error("Complete workflow step error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de la complétion de l'étape",
      });
    }
  },
);

// @route   POST /api/reports/:id/workflow/steps/:stepNumber/documents
// @desc    Upload documents for a workflow step (Level 2)
// @access  Private (Psychologues, Admin)
router.post(
  "/:id/workflow/steps/:stepNumber/documents",
  auth,
  authorize("psychologue", "admin"),
  upload.array("documents", 10),
  async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Signalement non trouvé",
        });
      }

      const stepNumber = parseInt(req.params.stepNumber);
      const step = report.workflowSteps.find(
        (s) => s.stepNumber === stepNumber,
      );

      if (!step) {
        return res.status(404).json({
          status: "error",
          message: "Étape non trouvée",
        });
      }

      const newDocuments = req.files
        ? req.files.map((file) => ({
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
          }))
        : [];

      step.documents.push(...newDocuments);

      report.history.push({
        action: `Documents ajoutés à l'étape ${stepNumber}`,
        performedBy: req.user._id,
        details: `${newDocuments.length} document(s) ajouté(s) - ${step.title}`,
      });

      await report.save();

      res.json({
        status: "success",
        message: "Documents ajoutés",
        data: { documents: newDocuments },
      });
    } catch (error) {
      console.error("Upload step documents error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de l'upload des documents",
      });
    }
  },
);

// @route   POST /api/reports/:id/documents
// @desc    Create a report document (fiche initiale, rapport DPE, etc.)
// @access  Private (Psychologues, Admin)
router.post(
  "/:id/documents",
  auth,
  authorize("psychologue", "admin"),
  upload.array("attachments", 5),
  [
    body("type")
      .isIn([
        "fiche_initiale",
        "rapport_dpe",
        "plan_action",
        "rapport_suivi",
        "decision_finale",
      ])
      .withMessage("Type de document invalide"),
    body("title").trim().notEmpty().withMessage("Le titre est obligatoire"),
    body("content").trim().notEmpty().withMessage("Le contenu est obligatoire"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Données invalides",
          errors: errors.array(),
        });
      }

      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          status: "error",
          message: "Signalement non trouvé",
        });
      }

      const { type, title, content } = req.body;

      const attachments = req.files
        ? req.files.map((file) => ({
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
          }))
        : [];

      report.documents.push({
        type,
        title,
        content,
        createdBy: req.user._id,
        attachments,
      });

      report.history.push({
        action: "Document créé",
        performedBy: req.user._id,
        details: `${title} (${type})`,
      });

      await report.save();

      res.status(201).json({
        status: "success",
        message: "Document créé avec succès",
        data: {
          document: report.documents[report.documents.length - 1],
        },
      });
    } catch (error) {
      console.error("Create document error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de la création du document",
      });
    }
  },
);

// @route   GET /api/reports/stats/village
// @desc    Get statistics by village (Level 3)
// @access  Private (Directors, Admin)
router.get(
  "/stats/village",
  auth,
  authorize("decideur1", "decideur2", "admin"),
  async (req, res) => {
    try {
      const stats = await Report.aggregate([
        {
          $group: {
            _id: "$village",
            total: { $sum: 1 },
            pending: {
              $sum: {
                $cond: [{ $in: ["$status", ["en_attente", "en_cours"]] }, 1, 0],
              },
            },
            resolved: {
              $sum: {
                $cond: [
                  {
                    $in: [
                      "$status",
                      ["cloture", "sauvegarde", "pris_en_charge"],
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            urgent: {
              $sum: { $cond: [{ $eq: ["$urgencyLevel", "critique"] }, 1, 0] },
            },
            falseReports: {
              $sum: { $cond: [{ $eq: ["$status", "faux"] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            village: "$_id",
            total: 1,
            pending: 1,
            resolved: 1,
            urgent: 1,
            falseReports: 1,
            resolutionRate: {
              $cond: [
                { $eq: ["$total", 0] },
                0,
                { $multiply: [{ $divide: ["$resolved", "$total"] }, 100] },
              ],
            },
          },
        },
        { $sort: { village: 1 } },
      ]);

      res.json({
        status: "success",
        data: { stats },
      });
    } catch (error) {
      console.error("Get village stats error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de la récupération des statistiques",
      });
    }
  },
);

module.exports = router;
