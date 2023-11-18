const Product = require("../Models/product");

async function createProduct(obj) {
  try {
    const newProduct = new Product(obj);
    await newProduct.save();
    return true;
  } catch (err) {
    return "server busy";
  }
}

async function getProducts() {
  try {
    const products = Product.find();
    console.log(products);
    return products;
  } catch (err) {
    return "server busy";
  }
}

module.exports = { createProduct, getProducts };
