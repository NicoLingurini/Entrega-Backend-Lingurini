const express = require("express");
const router = express.Router();
const ProductService = require("../services/product.service");
const productService = new ProductService();
const CartService = require("../services/cart.service");
const cartService = new CartService();

/* router.get("/", async (req, res) => {
  try {
    const result = await productService.getProducts();
    res.render("pages/home", { products: result.products }); //
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
}); */

/* router.get("/realTimeProducts", async (req, res) => {
  try {
    const result = await productService.getProducts();
    res.render("pages/realTimeProducts", { products: result.products });
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
}); */

router.get("/products", async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;
    const query = {};
    if (category) query.category = category;
    if (status !== undefined && status !== "") query.status = status;

    const result = await productService.getProducts({
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      query,
      sort,
    });
    const plainProducts = result.products.map((p) =>
      p.toObject ? p.toObject() : p
    );

    res.render("pages/products", {
      products: plainProducts,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      limit: Number(limit) || 10,
      category,
      status,
      sort,
    });
  } catch (error) {
    res.status(500).send("Error al cargar productos");
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);

    if (!product) return res.status(404).send("Producto no encontrado");

    const plainProduct = product.toObject ? product.toObject() : product;

    res.render("pages/productsDetail", { product: plainProduct });
  } catch (error) {
    res.status(500).send("Error al cargar detalle de producto");
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cartDoc = await cartService.getCartById(cid);
    if (!cartDoc) return res.status(404).send("Carrito no encontrado");

    const cart = cartDoc.toObject();

    const total = cart.products.reduce(
      (acc, p) => acc + p.product.price * p.quantity,
      0
    );
    res.render("pages/cart", { cart, total });
  } catch (error) {
    res.status(500).send("Error al cargar carrito");
  }
});

module.exports = router;
