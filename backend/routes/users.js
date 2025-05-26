const express = require('express');
const router = express.Router();
const { getUser, getUserDevices, getUserLogs } = require('../controllers/userController');

router.get('/:id', getUser);
router.get('/:id/devices', getUserDevices);
router.get('/:id/logs', getUserLogs);

module.exports = router; 