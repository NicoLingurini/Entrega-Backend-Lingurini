const Cart = require("../models/cart.model");

class CartService {
  async getCarts() {
    return await Cart.find();
  }
  async createCart() {
    const newCart = await Cart.create({ products: [] });
    return newCart;
  }
  async getCartById(id) {
    return await Cart.findById(id).populate("products.product");
  }
  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    const existing = cart.products.find(
      (p) => String(p.product) === String(productId)
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }
    await cart.save();

    return await cart.populate("products.product");
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    cart.products = cart.products.filter(
      (item) => String(item.product) !== String(productId)
    );
    await cart.save();
    return await cart.populate("products.product");
  }

  async updateCartProducts(cartId, productsArray) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    cart.products = productsArray;
    await cart.save();
    return await cart.populate("products.product");
  }
  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    const item = cart.products.find((p) => p.product.equals(productId));
    if (!item) return null;
    item.quantity = quantity;
    await cart.save();
    return await cart.populate("products.product");
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;
    cart.products = [];
    await cart.save();
    return await cart.populate("products.product");
  }
}

module.exports = CartService;
