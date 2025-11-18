const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Rotas de produtos
router.get('/natal_tech_products', productController.getAllProducts);
router.get('/natal_tech_products/:id', productController.getProductById);
router.post('/natal_tech_products', productController.createProduct);
router.put('/natal_tech_products/:id', productController.updateProduct);
router.delete('/natal_tech_products/:id', productController.deleteProduct);

module.exports = router;