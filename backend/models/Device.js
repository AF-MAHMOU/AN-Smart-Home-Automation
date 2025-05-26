const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['on', 'off'],
    default: 'off'
  },
  temperature: {
    type: Number,
    default: 24 // For AC
  },
  speed: {
    type: Number,
    default: 1 // For Fan
  },
  connectionType: {
    type: String,
    enum: ['Wi-Fi', 'Bluetooth', 'Zigbee'],
    default: 'Wi-Fi'
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: String,
    required: true,
    trim: true,
    default: 'Living Room'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Device', deviceSchema);
