const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

// select Staff
router.get('/', staffController.getStaff);
// insert Staff
router.post('/', staffController.insertStaff);

module.exports = router;