const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLE_VALUES, ROLE_LABELS } = require("../utils/roles");
const { validatePasswordStrength } = require("../utils/passwordValidator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est obligatoire"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [
        3,
        "Le nom d'utilisateur doit contenir au moins 3 caractères",
      ],
      maxlength: [
        30,
        "Le nom d'utilisateur ne peut pas dépasser 30 caractères",
      ],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores",
      ],
    },
    firstName: {
      type: String,
      required: [true, "Le prénom est obligatoire"],
      trim: true,
      maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
    },
    lastName: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez entrer un email valide",
      ],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est obligatoire"],
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
      select: false,
      validate: {
        validator: function (password) {
          // Skip validation if password is already hashed (starts with $2a$ or $2b$)
          if (password.startsWith("$2a$") || password.startsWith("$2b$")) {
            return true;
          }
          const validation = validatePasswordStrength(password);
          return validation.isValid;
        },
        message:
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial",
      },
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      required: [true, "Le rôle est obligatoire"],
    },
    village: {
      type: String,
      trim: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to return user without sensitive data
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to get role display name
userSchema.statics.getRoleDisplayName = function (role) {
  return ROLE_LABELS[role] || role;
};

// Index for faster queries (username and email already indexed via unique: true)
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

module.exports = mongoose.model("User", userSchema);
