const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth, isAdmin } = require("../middleware/auth");
const {
  MANAGED_ROLE_VALUES,
  ROLE_LABELS,
  normalizeRoleInput,
} = require("../utils/roles");
const { validatePasswordStrength } = require("../utils/passwordValidator");

const router = express.Router();

// @route   GET /api/users/roles/list
// @desc    Get list of available roles (Admin only)
// @access  Private (Admin)
router.get("/roles/list", auth, isAdmin, async (req, res) => {
  try {
    const roles = MANAGED_ROLE_VALUES.map((value) => ({
      value,
      label: ROLE_LABELS[value] || value,
    }));

    res.json({
      status: "success",
      data: { roles },
    });
  } catch (error) {
    console.error("Get roles error:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des rôles",
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get("/", auth, isAdmin, async (req, res) => {
  try {
    const { role, isActive, search, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = {};
    if (role) {
      const normalizedRole = normalizeRoleInput(role);
      if (!normalizedRole) {
        return res.status(400).json({
          status: "error",
          message: "Rôle invalide",
        });
      }
      filter.role = normalizedRole;
    }
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      status: "success",
      data: {
        users: users.map((user) => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          roleDisplay: User.getRoleDisplayName(user.role),
          village: user.village,
          isActive: user.isActive,
          phoneNumber: user.phoneNumber,
          fullName: user.fullName,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
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
    console.error("Get users error:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des utilisateurs",
    });
  }
});

// @route   POST /api/users
// @desc    Create user (Admin only)
// @access  Private (Admin)
router.post(
  "/",
  auth,
  isAdmin,
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Le nom d'utilisateur est obligatoire"),
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("Le prénom est obligatoire"),
    body("lastName").trim().notEmpty().withMessage("Le nom est obligatoire"),
    body("email").optional().isEmail().withMessage("Email invalide"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Le mot de passe doit contenir au moins 8 caractères")
      .custom((value) => {
        const validation = validatePasswordStrength(value);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(", "));
        }
        return true;
      }),
    body("role")
      .customSanitizer(normalizeRoleInput)
      .custom((value) => MANAGED_ROLE_VALUES.includes(value))
      .withMessage("Rôle invalide"),
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

      const {
        username,
        firstName,
        lastName,
        email,
        password,
        role,
        village,
        phoneNumber,
        isActive,
      } = req.body;

      // Check if username already exists
      const existingUser = await User.findOne({
        username: username.toLowerCase(),
      });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "Un utilisateur avec ce nom d'utilisateur existe déjà",
        });
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmail = await User.findOne({
          email: email.toLowerCase(),
        });
        if (existingEmail) {
          return res.status(400).json({
            status: "error",
            message: "Un utilisateur avec cet email existe déjà",
          });
        }
      }

      // Create new user
      const user = new User({
        username: username.toLowerCase(),
        firstName,
        lastName,
        email: email ? email.toLowerCase() : undefined,
        password,
        role,
        village,
        phoneNumber,
        isActive: isActive === undefined ? true : isActive,
      });

      await user.save();

      res.status(201).json({
        status: "success",
        message: "Utilisateur créé avec succès",
        data: {
          user: {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            roleDisplay: User.getRoleDisplayName(user.role),
            village: user.village,
            isActive: user.isActive,
            phoneNumber: user.phoneNumber,
            fullName: user.fullName,
            createdAt: user.createdAt,
          },
        },
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de la création de l'utilisateur",
      });
    }
  },
);

// @route   GET /api/users/psychologues/:village
// @desc    Get psychologues for a specific village
// @access  Private (Declarants)
router.get("/psychologues/:village", auth, async (req, res) => {
  try {
    const { village } = req.params;

    console.log("Looking for psychologues in village:", village);

    // Find psychologues for this village
    const psychologues = await User.find({
      role: "psychologue",
      village: village,
      isActive: true,
    }).select("-password");

    console.log(
      "Found psychologues:",
      psychologues.length,
      psychologues.map((p) => ({ name: p.fullName, village: p.village })),
    );

    res.json({
      status: "success",
      data: {
        psychologues: psychologues.map((p) => ({
          id: p._id,
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
          username: p.username,
          fullName: p.fullName,
          phoneNumber: p.phoneNumber,
        })),
      },
    });
  } catch (error) {
    console.error("Get psychologues error:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des psychologues",
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private (Admin)
router.get("/:id", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      status: "success",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          roleDisplay: User.getRoleDisplayName(user.role),
          village: user.village,
          isActive: user.isActive,
          phoneNumber: user.phoneNumber,
          profilePhoto: user.profilePhoto,
          fullName: user.fullName,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération de l'utilisateur",
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private (Admin)
router.put(
  "/:id",
  auth,
  isAdmin,
  [
    body("firstName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Le prénom ne peut pas être vide"),
    body("lastName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Le nom ne peut pas être vide"),
    body("email").optional().isEmail().withMessage("Email invalide"),
    body("role")
      .optional()
      .customSanitizer(normalizeRoleInput)
      .custom((value) => MANAGED_ROLE_VALUES.includes(value))
      .withMessage("Rôle invalide"),
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

      const {
        firstName,
        lastName,
        email,
        role,
        village,
        phoneNumber,
        isActive,
      } = req.body;

      // Check if user exists
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Utilisateur non trouvé",
        });
      }

      // Check if email is already taken by another user
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            status: "error",
            message: "Un utilisateur avec cet email existe déjà",
          });
        }
      }

      // Update fields
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;
      if (role) user.role = role;
      if (village !== undefined) user.village = village;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
      if (isActive !== undefined) user.isActive = isActive;

      await user.save();

      res.json({
        status: "success",
        message: "Utilisateur mis à jour avec succès",
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            roleDisplay: User.getRoleDisplayName(user.role),
            village: user.village,
            isActive: user.isActive,
            fullName: user.fullName,
            updatedAt: user.updatedAt,
          },
        },
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de la mise à jour de l'utilisateur",
      });
    }
  },
);

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Utilisateur non trouvé",
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        status: "error",
        message: "Vous ne pouvez pas supprimer votre propre compte",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      status: "success",
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la suppression de l'utilisateur",
    });
  }
});

// @route   POST /api/users/:id/reset-password
// @desc    Reset user password (Admin only)
// @access  Private (Admin)
router.post(
  "/:id/reset-password",
  auth,
  isAdmin,
  [
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
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

      const user = await User.findById(req.params.id).select("+password");

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "Utilisateur non trouvé",
        });
      }

      user.password = req.body.newPassword;
      await user.save();

      res.json({
        status: "success",
        message: "Mot de passe réinitialisé avec succès",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de la réinitialisation du mot de passe",
      });
    }
  },
);

module.exports = router;
