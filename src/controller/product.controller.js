const productService = require("../services/product.service.js");

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.deleteProduct(productId);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.updateProduct(productId, req.body);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const findProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await productService.findProductById(productId);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const findProductByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await productService.findProductByCategory(category);
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);
    res.status(200).send(products); // Use 200 for success
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ error: "Internal Server Error" }); // Handle server-side error
  }
};

const createMultipleProduct = async (req, res) => {
  try {
    const products = await productService.createMultipleProduct(req.body);
    res.status(201).send({ message: "Products Created Successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
  
};

const searchProduct = async (req, res) => {
  const query = req.params.query;
  try {
    const products = await productService.searchProduct(query);
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  findProductByCategory,
  searchProduct,
  createMultipleProduct
};