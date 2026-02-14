const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const workflowStepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue'],
    default: 'pending'
  },
  startedAt: Date,
  completedAt: Date,
  deadline: Date,
  documents: [attachmentSchema],
  notes: String,
  completedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const reportSchema = new mongoose.Schema({
  // Basic Information
  reportId: {
    type: String,
    unique: true,
    required: true
  },
  
  // Declarant Information (Level 1)
  declarant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  
  // Child Information
  childName: {
    type: String,
    required: [true, 'Le nom de l\'enfant est obligatoire'],
    trim: true
  },
  childAge: {
    type: Number,
    min: 0,
    max: 18
  },
  childGender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  
  // Village/Location
  village: {
    type: String,
    required: [true, 'Le village est obligatoire'],
    trim: true
  },
  program: {
    type: String,
    trim: true
  },
  
  // Incident Details
  incidentType: {
    type: String,
    enum: ['sante', 'comportement', 'violence', 'negligence', 'abus', 'autre'],
    required: [true, 'Le type d\'incident est obligatoire']
  },
  incidentDate: {
    type: Date,
    required: [true, 'La date de l\'incident est obligatoire']
  },
  urgencyLevel: {
    type: String,
    enum: ['faible', 'moyen', 'critique'],
    required: [true, 'Le niveau d\'urgence est obligatoire']
  },
  description: {
    type: String,
    required: [true, 'La description est obligatoire'],
    minlength: [10, 'La description doit contenir au moins 10 caractères']
  },
  
  // Abuser Information (if applicable)
  abuserName: {
    type: String,
    trim: true,
    default: null
  },
  abuserRole: {
    type: String,
    enum: ['membre_famille', 'volontaire', 'personnel', 'inconnu', 'autre', null],
    default: null
  },
  
  // Attachments
  attachments: [attachmentSchema],
  
  // Status Workflow
  status: {
    type: String,
    enum: ['en_attente', 'en_cours', 'pris_en_charge', 'sauvegarde', 'faux', 'cloture'],
    default: 'en_attente'
  },
  
  // Classification (Level 2)
  classification: {
    type: String,
    enum: ['sauvegarde', 'prise_en_charge', 'faux_signalement', null],
    default: null
  },
  classifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  classifiedAt: {
    type: Date,
    default: null
  },
  classificationNotes: {
    type: String,
    default: null
  },
  
  // Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedAt: {
    type: Date,
    default: null
  },
  
  // Workflow Steps (6-step process)
  workflowSteps: [workflowStepSchema],
  currentStep: {
    type: Number,
    default: 0,
    min: 0,
    max: 6
  },
  
  // Decision (Level 3)
  decision: {
    type: {
      type: String,
      enum: ['validation', 'escalade', 'cloture', null],
      default: null
    },
    details: String,
    madeBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    madeAt: {
      type: Date,
      default: null
    }
  },
  
  // Reports and Documents
  documents: [{
    type: {
      type: String,
      enum: ['fiche_initiale', 'rapport_dpe', 'plan_action', 'rapport_suivi', 'decision_finale']
    },
    title: String,
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    attachments: [attachmentSchema]
  }],
  
  // Audit Trail
  history: [{
    action: {
      type: String,
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    performedAt: {
      type: Date,
      default: Date.now
    },
    details: String
  }],
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for days since creation
reportSchema.virtual('daysSinceCreation').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for isOverdue
reportSchema.virtual('isOverdue').get(function() {
  if (this.status === 'cloture') return false;
  const days = this.daysSinceCreation;
  const limits = { 'faible': 30, 'moyen': 14, 'critique': 3 };
  return days > limits[this.urgencyLevel];
});

// Pre-save middleware to generate report ID
reportSchema.pre('save', async function(next) {
  if (this.isNew && !this.reportId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(year, date.getMonth(), 1),
        $lt: new Date(year, date.getMonth() + 1, 1)
      }
    });
    this.reportId = `SOS-${year}${month}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Indexes for faster queries
reportSchema.index({ reportId: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ urgencyLevel: 1 });
reportSchema.index({ declarant: 1 });
reportSchema.index({ assignedTo: 1 });
reportSchema.index({ village: 1 });
reportSchema.index({ incidentType: 1 });
reportSchema.index({ createdAt: -1 });

// Static method to get status display name
reportSchema.statics.getStatusDisplayName = function(status) {
  const statusNames = {
    'en_attente': 'En attente',
    'en_cours': 'En cours',
    'pris_en_charge': 'Pris en charge',
    'sauvegarde': 'Sauvegarde',
    'faux': 'Faux signalement',
    'cloture': 'Clôturé'
  };
  return statusNames[status] || status;
};

// Static method to get urgency color
reportSchema.statics.getUrgencyColor = function(urgency) {
  const colors = {
    'faible': '#10b981', // green
    'moyen': '#f59e0b', // orange
    'critique': '#ef4444' // red
  };
  return colors[urgency] || '#6b7280';
};

module.exports = mongoose.model('Report', reportSchema);
