const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Device name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Device type is required'],
    enum: ['light', 'thermostat', 'camera', 'lock', 'other'],
    default: 'other'
  },
  status: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: [true, 'Device location is required'],
    trim: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated timestamp on status change
deviceSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.lastUpdated = Date.now();
  }
  next();
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device; 