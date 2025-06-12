const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_URI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB conectado correctamente.");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
