const fs = require("fs").promises;
const path = "./src/data/carts.json";

async function getCarts() {
  try {
    const data = await fs.readFile(path, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Error al leer los carritos");
  }
}

async function createCart() {
  try {
    const carts = await getCarts();
    const newCart = {
      id: String(Date.now()),
      products: [],
    };
    carts.push(newCart);
    await fs.writeFile(path, JSON.stringify(carts, null, 2));
    return newCart;
  } catch (error) {
    throw new Error("Error al crear el carrito");
  }
}

async function getCartById(id) {
  try {
    const carts = await getCarts();
    return carts.find((c) => c.id === id);
  } catch (error) {
    throw new Error("Error al obtener el carrito");
  }
}

async function addProductToCart(cartId, productId) {
  try {
    const carts = await getCarts();
    const cart = carts.find((c) => c.id === cartId);
    if (!cart) return null;

    const existing = cart.products.find((p) => p.product === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(path, JSON.stringify(carts, null, 2));
    return cart;
  } catch (error) {
    throw new Error("Error al agregar producto al carrito");
  }
}

module.exports = {
  getCarts,
  createCart,
  getCartById,
  addProductToCart,
};
