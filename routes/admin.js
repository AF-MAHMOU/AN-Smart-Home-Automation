const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Device = require('../models/Device');
const { protect, isAdmin } = require('../middleware/auth');

// Get admin statistics
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const stats = {
      users: {
        total: await User.countDocuments(),
        admins: await User.countDocuments({ role: 'admin' }),
        regularUsers: await User.countDocuments({ role: 'user' })
      },
      devices: {
        total: await Device.countDocuments(),
        active: await Device.countDocuments({ status: true }),
        inactive: await Device.countDocuments({ status: false })
      },
      deviceTypes: {
        lights: await Device.countDocuments({ type: 'light' }),
        thermostats: await Device.countDocuments({ type: 'thermostat' }),
        cameras: await Device.countDocuments({ type: 'camera' }),
        locks: await Device.countDocuments({ type: 'lock' }),
        others: await Device.countDocuments({ type: 'other' })
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Error fetching admin statistics' });
  }
});

module.exports = router; 