const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'fas fa-circle'
  },
  completed: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
taskSchema.index({ userId: 1, order: 1 });

module.exports = mongoose.model('Task', taskSchema);
