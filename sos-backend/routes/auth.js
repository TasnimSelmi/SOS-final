const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth, isAdmin } = require("../middleware/auth");
const { MANAGED_ROLE_VALUES, normalizeRoleInput } = require("../utils/roles");
const { validatePasswordStrength } = require("../utils/passwordValidator");
const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "your-secret-key-change-in-production",
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
  );
};

// @route   POST /api/auth/register
// @desc    Register new user (Admin only)
// @access  Private (Admin)
router.post(
  "/register",
  auth,
  isAdmin,
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Le nom d'utilisateur est obligatoire")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores",
      ),
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("Le prénom est obligatoire"),
    body("lastName").trim().notEmpty().withMessage("Le nom est obligatoire"),
    body("email").optional().isEmail().withMessage("Email invalide"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
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
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        username: username.toLowerCase(),
      });
      if (existingUser) {
        return res.status(400).json({
          status: "error",
          message: "Un utilisateur avec ce nom d'utilisateur existe déjà",
        });
      }

      // Create new user
      const user = new User({
        username,
        firstName,
        lastName,
        email,
        password,
        role,
        village,
        phoneNumber,
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
            fullName: user.fullName,
          },
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de la création de l'utilisateur",
      });
    }
  },
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Le nom d'utilisateur est obligatoire"),
    body("password").notEmpty().withMessage("Le mot de passe est obligatoire"),
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

      const { username, password } = req.body;

      // Find user by username
      const user = await User.findOne({
        username: username.toLowerCase(),
      }).select("+password");
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Nom d'utilisateur ou mot de passe incorrect",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          status: "error",
          message: "Compte désactivé. Contactez l'administrateur.",
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          status: "error",
          message: "Nom d'utilisateur ou mot de passe incorrect",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.json({
        status: "success",
        message: "Connexion réussie",
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            village: user.village,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors de la connexion",
      });
    }
  },
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      status: "success",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          village: user.village,
          phoneNumber: user.phoneNumber,
          profilePhoto: user.profilePhoto,
          fullName: user.fullName,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      status: "error",
      message: "Erreur lors de la récupération des données",
    });
  }
});

// @route   POST /api/auth/change-password
// @desc    Change password
// @access  Private
router.post(
  "/change-password",
  auth,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Le mot de passe actuel est obligatoire"),
    body("newPassword")
      .isLength({ min: 8 })
      .withMessage(
        "Le nouveau mot de passe doit contenir au moins 8 caractères",
      )
      .custom((value) => {
        const validation = validatePasswordStrength(value);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(", "));
        }
        return true;
      }),
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

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select("+password");

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          status: "error",
          message: "Mot de passe actuel incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        status: "success",
        message: "Mot de passe changé avec succès",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        status: "error",
        message: "Erreur lors du changement de mot de passe",
      });
    }
  },
);

module.exports = router;
