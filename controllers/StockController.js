const Stock = require("../models/Stock");
const Product = require("../models/Products");
const Category = require("../models/ProductCat");
const PriceUpdate = require("../models/PriceUpdate");


// Create a new stock entry
exports.createStock = async (req, res, next) => {
  try {
    const { ProductId, quantity, currentPricePerUnit, date } = req.body;

    const product = await Product.findById(ProductId);

    const newStock = new Stock({
      ProductId,
      quantity,
      currentPricePerUnit,
      name: product.name,
      color: product.productColor,
      size: product.productSize,
      date: date,
    });

    await newStock.save();

    return res.send({
      success: true,
      message: "Stock entry created successfully",
      stock: { newStock: newStock },
    });
  } catch (error) {
    return res.send({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Get all stock entries
exports.getAllStock = async (req, res, next) => {
  try {
    const stocks = await Stock.find();

    return res.send({
      success: true,
      message: "Stock entries retrieved successfully",
      stocks,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Get stock entry by ID
exports.getStockById = async (req, res, next) => {
  try {
    const stockId = req.params.id;

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.send({
        success: false,
        error: "Stock entry not found",
      });
    }

    return res.send({
      success: true,
      message: "Stock entry retrieved successfully",
      stock,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Update stock entry by ID
exports.updateStockById = async (req, res, next) => {
  try {
    const stockId = req.params.id;

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.send({
        success: false,
        error: "Stock entry not found",
      });
    }

    const updateData = {
      ProductId: req.body.ProductId || stock.ProductId,
      quantity: req.body.quantity || stock.quantity,
      currentPricePerUnit:
        req.body.currentPricePerUnit || stock.currentPricePerUnit,
      date: req.body.date || stock.date,
    };

    await Stock.findByIdAndUpdate(stockId, updateData);
    const updatedStock = await Stock.findById(stockId);
    return res.send({
      success: true,
      message: "Stock entry updated successfully",
      stock: updatedStock,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Delete stock entry by ID
exports.deleteStockById = async (req, res, next) => {
  try {
    const stockId = req.params.id;

    await Stock.findByIdAndDelete(stockId);

    return res.send({
      success: true,
      message: "Stock entry deleted successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      error: "Internal Server Error",
    });
  }
};


// Get stock entries by category ID
exports.getStockByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.send({
        success: false,
        error: "Category not found",
      });
    }

    // Find all products that belong to the specified category
    const productsInCategory = await Product.find({ category: categoryId });

    if (productsInCategory.length === 0) {
      return res.send({
        success: true,
        message: "No products found in the specified category",
        stockEntries: [],
      });
    }

    // Extract the product IDs from the found products
    const productIds = productsInCategory.map((product) => product._id);

    // Find all stock entries that match the product IDs
    const stockEntries = await Stock.find({ ProductId: { $in: productIds } });

    return res.send({
      success: true,
      message: "Stock entries by category retrieved successfully",
      stockEntries,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: "Internal Server Error",
    });
  }
};


exports.getStockByPriceUpdate = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    const category = await PriceUpdate.findById(categoryId);

    if (!category) {
      return res.send({
        success: false,
        error: "Category not found",
      });
    }

    // Find all products that belong to the specified category
    const productsInCategory = await Product.find({ weightType: categoryId });

    if (productsInCategory.length === 0) {
      return res.send({
        success: true,
        message: "No products found in the specified category",
        stockEntries: [],
      });
    }

    // Extract the product IDs from the found products
    const productIds = productsInCategory.map((product) => product._id);

    // Find all stock entries that match the product IDs
    const stockEntries = await Stock.find({ ProductId: { $in: productIds } });

    return res.send({
      success: true,
      message: "Stock entries by category retrieved successfully",
      stockEntries,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: "Internal Server Error",
    });
  }
};
