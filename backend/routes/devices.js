const express = require('express');
const router = express.Router();
const { addDevice, toggleDevice, deleteDevice, getDeviceById, updateDevice } = require('../controllers/deviceController');

router.post('/', addDevice);
router.patch('/:id', toggleDevice);
router.delete('/:id', deleteDevice);
router.get('/:id', getDeviceById);
router.patch('/:id/custom', updateDevice);

module.exports = router; 