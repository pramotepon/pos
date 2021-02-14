const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

// select Staff
router.get('/', receiptController.getReceipt);
// find product by id
router.get('/:id', receiptController.findReceipt);
// insert product
router.post('/', receiptController.insertReceipt);
// remove receipt
router.delete('/:id', receiptController.deleteReceipt);

module.exports = router;