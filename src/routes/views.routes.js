const express = require("express");
const router = express.Router();
const ProductService = require("../services/product.service");
const productService = new ProductService();

router.get("/", async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.render("pages/home", { products });
  } catch (error) {
    console.error("Error al renderizar home:", error);
    res.status(500).send("Error del servidor");
  }
});

router.get("/realTimeProducts", async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.render("pages/realTimeProducts", { products });
  } catch (error) {
    console.error("Error al renderizar realTimeProducts:", error);
    res.status(500).send("Error del servidor");
  }
});

module.exports = router;
