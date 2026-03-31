"use strict";
const express = require("express");
const router = express.Router();
const productController = require('../controllers/productController');

router.get("/", productController.fetchAllProducts);
router.get("/:id", productController.fetchProductById);
router.get("/type/:type", productController.fetchProductsByType);
router.post("/", productController.createProduct);
router.delete("/:id", productController.removeProduct);
module.exports = router;