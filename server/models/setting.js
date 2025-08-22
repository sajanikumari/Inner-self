const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  theme: {
    type: String,
    enum: ['light', 'dark', 'auto'],
    default: 'light'
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    reminders: {
      type: Boolean,
      default: true
    }
  },
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'private'
    },
    dataSharing: {
      type: Boolean,
      default: false
    }
  },
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    dateFormat: {
      type: String,
      enum: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'],
      default: 'MM/DD/YYYY'
    },
    timeFormat: {
      type: String,
      enum: ['12h', '24h'],
      default: '12h'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Setting', settingSchema);