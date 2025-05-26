const User = require('../models/User');
const Device = require('../models/Device');
const ActivityLog = require('../models/ActivityLog');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('devices');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find().populate('userId', 'email');
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching devices', error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const deviceCount = await Device.countDocuments();
    const activeDevices = await Device.countDocuments({ status: 'on' });
    
    res.json({
      userCount,
      deviceCount,
      activeDevices,
      averageDevicesPerUser: deviceCount / userCount || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate('userId', 'email')
      .populate('deviceId', 'name type')
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching logs', error: err.message });
  }
};
