const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");
const viewsRouter = require("./routes/views.routes");

const ProductService = require("./services/product.service");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectDB();

const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine(
  "hbs",
  exphbs.engine({
    layoutsDir: path.join(__dirname, "views/layouts"),
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      increment: (value) => parseInt(value) + 1,
      decrement: (value) => parseInt(value) - 1,
      eq: (a, b) => a == b,
    },
  })
);
app.set("view engine", "hbs");

app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  const productService = new ProductService();
  const products = await productService.getProducts();
  socket.emit("update-products", products);

  socket.on("new-product", async (data) => {
    await productService.addProduct(data);
    const updatedProducts = await productService.getProducts();
    io.emit("update-products", updatedProducts);
  });
  socket.on("delete-product", async (productId) => {
    await productService.deleteProduct(productId);
    const updatedProducts = await productService.getProducts();
    io.emit("update-products", updatedProducts);
  });
});

server.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});
