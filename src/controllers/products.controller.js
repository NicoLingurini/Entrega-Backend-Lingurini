const productService = require("../services/product.service");

async function getAllProducts(req, res) {
  try {
    const products = await productService.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getProductById(req, res) {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createProduct(req, res) {
  try {
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

    const newProduct = await productService.addProduct({
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { pid } = req.params;
    const updates = req.body;

    if (updates.id) {
      return res
        .status(400)
        .json({ error: "No se puede actualizar el ID del producto" });
    }

    const updated = await productService.updateProduct(pid, updates);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const { pid } = req.params;
    await productService.deleteProduct(pid);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
