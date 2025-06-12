const ProductService = require("../services/product.service");
const productService = new ProductService();

async function getAllProducts(req, res) {
  try {
    const { limit, page, sort, category, status } = req.query;
    const query = {};
    if (category) query.category = category;
    if (status !== undefined) query.status = status;

    const result = await productService.getProducts({
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      query,
      sort,
    });

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
      req.path
    }`;
    const buildLink = (p) =>
      p
        ? `${baseUrl}?limit=${limit || 10}&page=${p}${
            sort ? `&sort=${sort}` : ""
          }${category ? `&category=${category}` : ""}${
            status !== undefined ? `&status=${status}` : ""
          }`
        : null;

    res.json({
      status: "success",
      payload: result.products,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: buildLink(result.prevPage),
      nextLink: buildLink(result.nextPage),
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
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

    if (updates.id || updates._id) {
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
