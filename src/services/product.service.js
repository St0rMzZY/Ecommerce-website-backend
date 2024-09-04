const Category = require("../models/category.model");
const Product = require("../models/product.model");

// Create a new product
async function createProduct(reqData) {

    let topLevel = await Category.findOne({ name: reqData.topLevelCategory });

    if (!topLevel) {
       topLevelCategory = new Category({
        name: reqData.topLevelCategory,
        level: 1,
      });
      topLevel = await topLevelCategory.save();
    }

    let secondLevel = await Category.findOne({
      name: reqData.secondLevelCategory,
      parentCategory: topLevel._id,
    });

    if (!secondLevel) {
       secondLevelCategory = new Category({
        name: reqData.secondLevelCategory,
        parentCategory: topLevel._id,
        level: 2,
      });
      secondLevel = await secondLevelCategory.save();
    }

    let thirdLevel = await Category.findOne({
      name: reqData.thirdLevelCategory,
      parentCategory: secondLevel._id,
    });

    if (!thirdLevel) {
       thirdLevelCategory = new Category({
        name: reqData.thirdLevelCategory,
        parentCategory: secondLevel._id,
        level: 3,
      });
      thirdLevel = await thirdLevelCategory.save();
    }

    const product = new Product({
      title: reqData.title,
      color: reqData.color,
      description: reqData.description,
      discountedPrice: reqData.discountedPrice,
      discountPercent: reqData.discountPercent,
      imageUrl: reqData.imageUrl,
      brand: reqData.brand,
      price: reqData.price,
      sizes: reqData.sizes,
      quantity: reqData.quantity,
      category: thirdLevel._id,
    })

    return await product.save();
    // return savedProduct;
  
    // console.error("Error in createProduct:", error); // Detailed logging
    // throw new Error(error.message);
  
}

async function deleteProduct(productId) {
    const product = await Product.findProductById(productId);

    if (!product) {
      throw new Error("Product not found with id - " + productId);
    }

    await Product.findByIdAndDelete(productId);

    return "Product deleted successfully";
  
}

// Update a product by ID
async function updateProduct(productId, reqData) {
 
    const updatedProduct = await Product.findByIdAndUpdate(productId, reqData, { new: true });
    if (!updatedProduct) {
      throw new Error("Product not found with id - " + productId);
    }
    return updatedProduct;
}

// Find a product by ID
async function findProductById(id) {
  
    const product = await Product.findById(id).populate("category").exec();

    if (!product) {
      throw new Error("Product not found with id " + id);
    }
    return product;
}

// Get all products with filtering and pagination
async function getAllProducts(reqQuery) {
 
    let {
      category,
      color,
      sizes,
      minPrice,
      maxPrice,
      minDiscount,
      sort,
      stock,
      pageNumber,
      pageSize,
    } = reqQuery;
    
    pageSize = pageSize || 10;
    pageNumber = pageNumber || 1;

    let query = Product.find().populate("category");

    // Filter by category
    if (category) {
      const existCategory = await Category.findOne({ name: category });
      if (existCategory) {
        query = query.where("category").equals(existCategory._id);
      } else {
        return { content: [], currentPage: 1, totalPages: 0 };
      }
    }

    // Filter by color
    if (color) {
      const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));
      const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;
      query = query.where("color").regex(colorRegex);
    }

    // Filter by sizes
    if (sizes) {
      const sizesSet = new Set(sizes.split(",").map(size => size.trim()));
      query = query.where("sizes.name").in([...sizesSet]);
    }

    // Filter by price range
    if (minPrice && maxPrice) {
      query =await query.where("discountedPrice").gte(minPrice).lte(maxPrice);
    }

    // Filter by minimum discount
    if (minDiscount) {
      query = query.where("discountPercent").gt(minDiscount);
    }

    // Filter by stock status
    if (stock) {
      if (stock == "in_stock") {
        query = query.where("quantity").gt(0);
      } else if (stock == "out_of_stock") {
        query = query.where("quantity").lte(0);
      }
    }

    // Sorting
    if (sort) {
      const sortDirection = sort === "price_high" ? -1 : 1;
      query = query.sort({ discountedPrice: sortDirection });
    }

    // Pagination
    const totalProducts = await Product.countDocuments(query);
    const skip = (pageNumber - 1) * pageSize;

    query = query.skip(skip).limit(pageSize);

    const products = await query.exec();
    const totalPages = Math.ceil(totalProducts / pageSize);

    return { content: products, currentPage: pageNumber, totalPages: totalPages };
}

// Create multiple products
async function createMultipleProduct(products) {
  
    for (let product of products) {
      await createProduct(product);
    }
  
}

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
  createMultipleProduct,
};