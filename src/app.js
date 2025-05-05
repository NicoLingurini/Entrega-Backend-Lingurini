const express = require("express");
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");

const app = express();
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(8080, () => {
  console.log("Servidor corriendo en puerto 8080");
});
