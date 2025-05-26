const cartService = require("../services/cart.service");

async function createCart(req, res) {
  try {
    const newCart = await cartService.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCartById(req, res) {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addProductToCart(req, res) {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartService.addProductToCart(cid, pid);
    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createCart,
  getCartById,
  addProductToCart,
};
