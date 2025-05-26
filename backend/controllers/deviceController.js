const Device = require('../models/Device');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

exports.addDevice = async (req, res) => {
  try {
    const { name, type, userId, brand, connectionType, room } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new device
    const device = new Device({
      name,
      type,
      userId,
      brand,
      connectionType
    });

    await device.save();

    // Add device to user's devices array
    user.devices.push(device._id);
    await user.save();

    await ActivityLog.create({
      userId: userId,
      action: `Added device "${device.name}"`,
      deviceId: device._id
    });

    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error adding device', error: error.message });
  }
};

exports.toggleDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.status = device.status === 'on' ? 'off' : 'on';
    await device.save();

    await ActivityLog.create({
      userId: device.userId,
      action: `Toggled device "${device.name}"`,
      deviceId: device._id
    });

    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling device', error: error.message });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Remove device from user's devices array
    await User.findByIdAndUpdate(device.userId, {
      $pull: { devices: device._id }
    });

    // Delete the device
    await Device.findByIdAndDelete(device._id);

    await ActivityLog.create({
      userId: device.userId,
      action: `Deleted device "${device.name}"`,
      deviceId: device._id
    });

    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting device', error: error.message });
  }
};

exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching device', error: error.message });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }
    // Update only allowed fields
    const { status, temperature, speed } = req.body;
    if (status !== undefined) device.status = status;
    if (temperature !== undefined) device.temperature = temperature;
    if (speed !== undefined) device.speed = speed;
    await device.save();
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Error updating device', error: error.message });
  }
};
