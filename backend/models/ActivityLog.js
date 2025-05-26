const mongoose = require('mongoose');
const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
  timestamp: { type: Date, default: Date.now },
  meta: { type: Object }
});
module.exports = mongoose.model('ActivityLog', activityLogSchema); 