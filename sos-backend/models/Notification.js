const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  type: {
    type: String,
    enum: ['new_report', 'report_assigned', 'report_classified', 'deadline_warning', 'deadline_overdue', 'workflow_step', 'decision_made', 'system'],
    required: true
  },
  
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // Related entities
  relatedReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    default: null
  },
  
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Priority level
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Read status
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  },
  
  // Action taken
  actionTaken: {
    type: Boolean,
    default: false
  },
  actionTakenAt: {
    type: Date,
    default: null
  },
  
  // Link to redirect when clicked
  link: {
    type: String,
    default: null
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for faster queries
notificationSchema.index({ recipient: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ relatedReport: 1 });

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    recipient: userId,
    isRead: false
  });
};

// Static method to create notification for new report
notificationSchema.statics.createForNewReport = async function(report, analysts) {
  const notifications = analysts.map(analyst => ({
    recipient: analyst._id,
    type: 'new_report',
    title: 'Nouveau signalement',
    message: `Un nouveau signalement (${report.reportId}) a été créé par ${report.isAnonymous ? 'un déclarant anonyme' : 'un déclarant'}.`,
    relatedReport: report._id,
    priority: report.urgencyLevel === 'critique' ? 'urgent' : 
              report.urgencyLevel === 'moyen' ? 'high' : 'normal',
    link: `/reports/${report._id}`
  }));
  
  return await this.insertMany(notifications);
};

// Static method to create deadline warning
notificationSchema.statics.createDeadlineWarning = async function(report, userId) {
  return await this.create({
    recipient: userId,
    type: 'deadline_warning',
    title: 'Alerte délai',
    message: `Le signalement ${report.reportId} approche de son délai de traitement.`,
    relatedReport: report._id,
    priority: 'high',
    link: `/reports/${report._id}`
  });
};

// Instance method to mark as read
notificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  this.readAt = new Date();
  return await this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
