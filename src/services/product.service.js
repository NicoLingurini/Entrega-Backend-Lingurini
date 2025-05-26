const fs = require("fs").promises;
const path = "./src/data/products.json";

class ProductService {
  async getProducts() {
    try {
      const data = await fs.readFile(path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      throw new Error("Error al leer los productos");
    }
  }

  async getProductById(id) {
    try {
      const products = await this.getProducts();
      return products.find((p) => p.id === id);
    } catch (error) {
      throw new Error("Error al obtener el producto por ID");
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      const newProduct = { id: String(Date.now()), ...product };
      products.push(newProduct);
      await fs.writeFile(path, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      throw new Error("Error al agregar el producto");
    }
  }

  async updateProduct(id, updates) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return null;
      products[index] = {
        ...products[index],
        ...updates,
        id: products[index].id,
      };
      await fs.writeFile(path, JSON.stringify(products, null, 2));
      return products[index];
    } catch (error) {
      throw new Error("Error al actualizar el producto");
    }
  }

  async deleteProduct(id) {
    try {
      const products = await this.getProducts();
      const filtered = products.filter((p) => p.id !== id);
      await fs.writeFile(path, JSON.stringify(filtered, null, 2));
    } catch (error) {
      throw new Error("Error al eliminar el producto");
    }
  }
}

module.exports = ProductService;
