const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { body } = require('express-validator');

// select Staff
router.get('/', productController.getProduct);
// find product by id
router.get('/:id', productController.findProduct);
// insert product
router.post('/', productController.insertProduct);
// update product
router.put('/:id', productController.updateProduct);
// delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;