const express = require('express');
const router = express.Router();
const { addDevice, toggleDevice, deleteDevice } = require('../controllers/deviceController');

router.post('/', addDevice);
router.patch('/:id', toggleDevice);
router.delete('/:id', deleteDevice);

module.exports = router;
