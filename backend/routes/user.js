const express = require('express');
const router = express.Router();
const { getUser, getUserDevices } = require('../controllers/userController');

router.get('/:id', getUser);
router.get('/:id/devices', getUserDevices);

module.exports = router;
