const User = require('../models/User');
const Device = require('../models/Device');
const ActivityLog = require('../models/ActivityLog');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('devices');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.getUserDevices = async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.params.id });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
};

exports.getUserLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.params.id })
      .populate('deviceId', 'name type')
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user logs', error: err.message });
  }
};
