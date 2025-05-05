const express = require("express");
const ProductManager = require("../managers/ProductManager");
const router = express.Router();
const productManager = new ProductManager();

// Obtener todos los productos
router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// Obtener producto por ID
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

// Agregar nuevo producto
router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;
  if (
    !title ||
    !description ||
    !code ||
    price == null ||
    status == null ||
    !stock ||
    !category
  ) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const newProduct = await productManager.addProduct({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails: thumbnails || [],
  });

  res.status(201).json(newProduct);
});

// Actualizar producto por ID
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updates = req.body;

  if (updates.id) {
    return res
      .status(400)
      .json({ error: "No se puede actualizar el ID del producto" });
  }

  const updated = await productManager.updateProduct(pid, updates);
  if (updated) {
    res.json(updated);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

// Eliminar producto por ID
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  await productManager.deleteProduct(pid);
  res.json({ message: "Producto eliminado" });
});

module.exports = router;
