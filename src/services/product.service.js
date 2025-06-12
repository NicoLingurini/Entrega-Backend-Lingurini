const Product = require("../models/product.model");

class ProductService {
  async getProducts({ limit = 10, page = 1, query = {}, sort } = {}) {
    const filter = {};
    if (query.category) {
      // Búsqueda exacta, insensible a mayúsculas/minúsculas
      filter.category = { $regex: `^${query.category}$`, $options: "i" };
    }
    if (query.status !== undefined && query.status !== "") {
      filter.status = query.status === "true" || query.status === true;
    }
    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    else if (sort === "desc") sortOption.price = -1;

    const skip = (page - 1) * limit;

    const [products, totalDocs] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      products,
      totalPages,
      page: Number(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch {
      throw new Error("Error al obtener el producto por ID");
    }
  }

  async addProduct(product) {
    try {
      const newProduct = await Product.create(product);
      return newProduct;
    } catch {
      throw new Error("Error al agregar el producto");
    }
  }

  async updateProduct(id, updates) {
    try {
      const updated = await Product.findByIdAndUpdate(id, updates, {
        new: true,
      });
      return updated;
    } catch {
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      await Product.findByIdAndDelete(id);
    } catch {
      throw new Error("Error al eliminar el producto");
    }
  }
}

module.exports = ProductService;
