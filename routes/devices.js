const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const { protect, isAdmin } = require('../middleware/auth');

// Get user's devices
router.get('/', protect, async (req, res) => {
  try {
    const devices = await Device.find({ owner: req.user._id });
    res.json(devices);
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ message: 'Error fetching devices' });
  }
});

// Get all devices (admin only)
router.get('/all', protect, isAdmin, async (req, res) => {
  try {
    const devices = await Device.find().populate('owner', 'email');
    res.json(devices);
  } catch (error) {
    console.error('Get all devices error:', error);
    res.status(500).json({ message: 'Error fetching all devices' });
  }
});

// Add new device
router.post('/', protect, async (req, res) => {
  try {
    const { name, type, location } = req.body;
    
    const device = new Device({
      name,
      type,
      location,
      owner: req.user._id
    });

    await device.save();
    res.status(201).json(device);
  } catch (error) {
    console.error('Add device error:', error);
    res.status(500).json({ message: 'Error adding device' });
  }
});

// Toggle device status
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const device = await Device.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.status = !device.status;
    await device.save();

    res.json(device);
  } catch (error) {
    console.error('Toggle device error:', error);
    res.status(500).json({ message: 'Error toggling device status' });
  }
});

module.exports = router; 