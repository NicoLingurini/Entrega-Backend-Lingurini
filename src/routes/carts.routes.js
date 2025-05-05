const express = require("express");
const CartManager = require("../managers/CartManager");
const router = express.Router();
const cartManager = new CartManager();

// Crear nuevo carrito
router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// Obtener productos de un carrito
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartManager.getCartById(cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

// Agregar producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const updatedCart = await cartManager.addProductToCart(cid, pid);
  if (updatedCart) {
    res.json(updatedCart);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

module.exports = router;
