const express = require('express');
const router = express.Router();
const { getAllUsers, getAllDevices, getStats, getLogs } = require('../controllers/adminController');

router.get('/users', getAllUsers);
router.get('/devices', getAllDevices);
router.get('/stats', getStats);
router.get('/logs', getLogs);

module.exports = router;
