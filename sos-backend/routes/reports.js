const express = require('express');
const { body, validationResult } = require('express-validator');
const Report = require('../models/Report');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/reports
// @desc    Create new report (Level 1 - Declarants)
// @access  Private (Declarants)
router.post(
  '/',
  auth,
  authorize('mere', 'tante', 'educateur'),
  upload.array('attachments', 5),
  [
    body('childName').trim().notEmpty().withMessage('Le nom de l\'enfant est obligatoire'),
    body('childAge').optional().isInt({ min: 0, max: 18 }).withMessage('L\'âge doit être entre 0 et 18 ans'),
    body('childGender').isIn(['male', 'female', 'other']).withMessage('Genre invalide'),
    body('village').trim().notEmpty().withMessage('Le village est obligatoire'),
    body('incidentType').isIn(['sante', 'comportement', 'violence', 'negligence', 'abus', 'autre']).withMessage('Type d\'incident invalide'),
    body('incidentDate').notEmpty().withMessage('La date de l\'incident est obligatoire'),
    body('urgencyLevel').isIn(['faible', 'moyen', 'critique']).withMessage('Niveau d\'urgence invalide'),
    body('description').trim().isLength({ min: 10 }).withMessage('La description doit contenir au moins 10 caractères')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Données invalides',
          errors: errors.array()
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
        isAnonymous
      } = req.body;

      // Process attachments
      const attachments = req.files ? req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path
      })) : [];

      // Create report
      const report = new Report({
        declarant: req.user._id,
        isAnonymous: isAnonymous === 'true',
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
        status: 'en_attente'
      });

      await report.save();

      // Add to history
      report.history.push({
        action: 'Création du signalement',
        performedBy: req.user._id,
        details: `Signalement créé par ${req.user.fullName}`
      });
      await report.save();

      // Notify analysts (psychologues)
      const analysts = await User.find({ 
        role: { $in: ['psychologue', 'directeur'] },
        isActive: true 
      });

      if (analysts.length > 0) {
        await Notification.createForNewReport(report, analysts);
      }

      res.status(201).json({
        status: 'success',
        message: 'Signalement créé avec succès',
        data: {
          report: {
            id: report._id,
            reportId: report.reportId,
            status: report.status,
            childName: report.childName,
            village: report.village,
            urgencyLevel: report.urgencyLevel,
            createdAt: report.createdAt
          }
        }
      });
    } catch (error) {
      console.error('Create report error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la création du signalement'
      });
    }
  }
);

// @route   GET /api/reports
// @desc    Get all reports (filtered by role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      status, 
      urgencyLevel, 
      village, 
      incidentType, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter based on user role
    const filter = {};
    
    // Level 1: See only their own reports
    if (['mere', 'tante', 'educateur'].includes(req.user.role)) {
      filter.declarant = req.user._id;
    }
    
    // Level 2 & 3: See all reports (with optional filters)
    if (status) filter.status = status;
    if (urgencyLevel) filter.urgencyLevel = urgencyLevel;
    if (village) filter.village = village;
    if (incidentType) filter.incidentType = incidentType;

    // Sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const reports = await Report.find(filter)
      .populate('declarant', 'firstName lastName fullName')
      .populate('assignedTo', 'firstName lastName fullName')
      .populate('classifiedBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        reports: reports.map(report => ({
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
          isOverdue: report.isOverdue
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération des signalements'
    });
  }
});

// @route   GET /api/reports/:id
// @desc    Get single report by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('declarant', 'firstName lastName fullName email role')
      .populate('assignedTo', 'firstName lastName fullName email')
      .populate('classifiedBy', 'firstName lastName fullName')
      .populate('decision.madeBy', 'firstName lastName fullName role')
      .populate('history.performedBy', 'firstName lastName fullName');

    if (!report) {
      return res.status(404).json({
        status: 'error',
        message: 'Signalement non trouvé'
      });
    }

    // Check permissions
    const isDeclarant = report.declarant._id.toString() === req.user._id.toString();
    const isAnalyst = ['psychologue', 'directeur', 'admin'].includes(req.user.role);
    
    if (!isDeclarant && !isAnalyst) {
      return res.status(403).json({
        status: 'error',
        message: 'Accès interdit'
      });
    }

    res.json({
      status: 'success',
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
          isOverdue: report.isOverdue
        }
      }
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la récupération du signalement'
    });
  }
});

// @route   PUT /api/reports/:id/classify
// @desc    Classify report (Level 2 - Analysts)
// @access  Private (Analysts)
router.put(
  '/:id/classify',
  auth,
  authorize('psychologue', 'directeur', 'admin'),
  [
    body('classification').isIn(['sauvegarde', 'prise_en_charge', 'faux_signalement']).withMessage('Classification invalide'),
    body('notes').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { classification, notes } = req.body;
      
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          status: 'error',
          message: 'Signalement non trouvé'
        });
      }

      // Can only classify pending or in-progress reports
      if (!['en_attente', 'en_cours'].includes(report.status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Ce signalement ne peut plus être classifié'
        });
      }

      // Update classification
      report.classification = classification;
      report.classifiedBy = req.user._id;
      report.classifiedAt = new Date();
      report.classificationNotes = notes;
      
      // Update status based on classification
      if (classification === 'faux_signalement') {
        report.status = 'faux';
      } else if (classification === 'sauvegarde') {
        report.status = 'sauvegarde';
      } else if (classification === 'prise_en_charge') {
        report.status = 'pris_en_charge';
      }

      // Add to history
      report.history.push({
        action: 'Classification du signalement',
        performedBy: req.user._id,
        details: `Classifié comme: ${classification}`
      });

      await report.save();

      // Notify declarant
      await Notification.create({
        recipient: report.declarant,
        type: 'report_classified',
        title: 'Signalement classifié',
        message: `Votre signalement ${report.reportId} a été classifié comme ${classification}.`,
        relatedReport: report._id,
        priority: 'normal',
        link: `/reports/${report._id}`
      });

      res.json({
        status: 'success',
        message: 'Signalement classifié avec succès',
        data: {
          report: {
            id: report._id,
            status: report.status,
            classification: report.classification,
            classifiedBy: req.user.fullName,
            classifiedAt: report.classifiedAt
          }
        }
      });
    } catch (error) {
      console.error('Classify report error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la classification'
      });
    }
  }
);

// @route   PUT /api/reports/:id/assign
// @desc    Assign report to analyst
// @access  Private (Analysts)
router.put(
  '/:id/assign',
  auth,
  authorize('psychologue', 'directeur', 'admin'),
  [
    body('userId').notEmpty().withMessage('ID utilisateur obligatoire')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { userId } = req.body;
      
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          status: 'error',
          message: 'Signalement non trouvé'
        });
      }

      // Check if user exists and is an analyst
      const user = await User.findById(userId);
      if (!user || !['psychologue', 'directeur', 'admin'].includes(user.role)) {
        return res.status(400).json({
          status: 'error',
          message: 'Utilisateur invalide ou non autorisé'
        });
      }

      report.assignedTo = userId;
      report.assignedAt = new Date();
      report.status = 'en_cours';

      // Add to history
      report.history.push({
        action: 'Assignation du signalement',
        performedBy: req.user._id,
        details: `Assigné à ${user.fullName}`
      });

      await report.save();

      // Notify assigned user
      await Notification.create({
        recipient: userId,
        type: 'report_assigned',
        title: 'Nouveau signalement assigné',
        message: `Le signalement ${report.reportId} vous a été assigné.`,
        relatedReport: report._id,
        priority: report.urgencyLevel === 'critique' ? 'urgent' : 'high',
        link: `/reports/${report._id}`
      });

      res.json({
        status: 'success',
        message: 'Signalement assigné avec succès',
        data: {
          report: {
            id: report._id,
            assignedTo: {
              id: user._id,
              fullName: user.fullName
            },
            status: report.status
          }
        }
      });
    } catch (error) {
      console.error('Assign report error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de l\'assignation'
      });
    }
  }
);

// @route   PUT /api/reports/:id/decision
// @desc    Make decision on report (Level 3 - Directors)
// @access  Private (Directors, Admin)
router.put(
  '/:id/decision',
  auth,
  authorize('directeur', 'admin'),
  [
    body('decision').isIn(['validation', 'escalade', 'cloture']).withMessage('Décision invalide'),
    body('details').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 'error',
          message: 'Données invalides',
          errors: errors.array()
        });
      }

      const { decision, details } = req.body;
      
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          status: 'error',
          message: 'Signalement non trouvé'
        });
      }

      // Update decision
      report.decision = {
        type: decision,
        details,
        madeBy: req.user._id,
        madeAt: new Date()
      };

      // Update status
      if (decision === 'cloture') {
        report.status = 'cloture';
      }

      // Add to history
      report.history.push({
        action: 'Décision prise',
        performedBy: req.user._id,
        details: `Décision: ${decision}${details ? ' - ' + details : ''}`
      });

      await report.save();

      // Notify relevant users
      const notification = await Notification.create({
        recipient: report.declarant,
        type: 'decision_made',
        title: 'Décision sur votre signalement',
        message: `Une décision a été prise sur votre signalement ${report.reportId}.`,
        relatedReport: report._id,
        priority: 'high',
        link: `/reports/${report._id}`
      });

      if (report.assignedTo) {
        await Notification.create({
          recipient: report.assignedTo,
          type: 'decision_made',
          title: 'Décision sur signalement assigné',
          message: `Une décision a été prise sur le signalement ${report.reportId}.`,
          relatedReport: report._id,
          priority: 'high',
          link: `/reports/${report._id}`
        });
      }

      res.json({
        status: 'success',
        message: 'Décision enregistrée avec succès',
        data: {
          report: {
            id: report._id,
            status: report.status,
            decision: report.decision
          }
        }
      });
    } catch (error) {
      console.error('Decision error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de l\'enregistrement de la décision'
      });
    }
  }
);

module.exports = router;
