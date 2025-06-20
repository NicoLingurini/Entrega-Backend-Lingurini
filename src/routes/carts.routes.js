const express = require("express");
const router = express.Router();
const {
  createCart,
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateCartProducts,
  updateProductQuantity,
  clearCart,
} = require("../controllers/carts.controller");

router.post("/", createCart);
router.get("/:cid", getCartById);
router.post("/:cid/products/:pid", addProductToCart);
router.delete("/:cid/products/:pid", removeProductFromCart);
router.put("/:cid", updateCartProducts);
router.put("/:cid/products/:pid", updateProductQuantity);
router.delete("/:cid", clearCart);

module.exports = router;
