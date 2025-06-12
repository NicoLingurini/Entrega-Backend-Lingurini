const CartService = require("../services/cart.service");
const cartService = new CartService();

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
      res.json(cart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function addProductToCart(req, res) {
  const updatedCart = await cartService.addProductToCart(
    req.params.cid,
    req.params.pid
  );
  if (updatedCart) {
    return res.redirect(`/carts/${req.params.cid}`);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
}

async function removeProductFromCart(req, res) {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartService.removeProductFromCart(cid, pid);
    if (updatedCart) {
      res.redirect(`/carts/${cid}`);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateCartProducts(req, res) {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ error: "El body debe tener 'products' como array" });
    }
    const updatedCart = await cartService.updateCartProducts(cid, products);
    if (updatedCart) {
      res.json(updatedCart);
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateProductQuantity(req, res) {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (quantity == null || isNaN(quantity)) {
      return res.status(400).send("Debe enviar 'quantity' en el body");
    }
    const updatedCart = await cartService.updateProductQuantity(
      cid,
      pid,
      quantity
    );
    if (updatedCart) {
      res.redirect(`/carts/${cid}`);
    } else {
      res.status(404).send("Carrito o producto no encontrado");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function clearCart(req, res) {
  try {
    const { cid } = req.params;
    const updatedCart = await cartService.clearCart(cid);
    if (updatedCart) {
      res.redirect(`/carts/${cid}`);
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
  removeProductFromCart,
  updateCartProducts,
  updateProductQuantity,
  clearCart,
};
