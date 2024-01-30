const express = require("express");
const Product = require("../models/Products");
const Category = require("../models/ProductCat");
const PriceUpdate = require("../models/PriceUpdate");
const Color = require("../models/Color");
const Material = require("../models/Material");
const Season = require("../models/Season");
const subCategory = require("../models/ProductSubCat");
const subSubCategory = require("../models/ProductSubSubCat");
const mongoose = require("mongoose");
const ProductVariantModel = require("../models/ProductVariant");

// Create Product
const addProduct = async (req, res, next) => {
  const {
    name,
    description,
    category,
    subCategory,
    subSubCategory,
    tags,
    original,
    discounted,
    stock,
    hsnCode,
    size,
    shippingCharge,
    color,
    gst,
    sku,
    calculationOnWeight,
    weightType,
    weight,
    laborCost,
    discountOnLaborCost,
    isActive,
    isProductPopular,
    isProductNew,
    filters,
    material,
    season,
  } = req.body;

  const imageGalleryFiles = req.files;

  // if (!imageGalleryFiles || imageGalleryFiles.length === 0) {
  //   return res.status(400).send({
  //     success: false,
  //     error: "Main image and image gallery files are required.",
  //   });
  // }

  const imageGallery = imageGalleryFiles.map((file) => file.filename);

  let calculatedPrice = 0;

  console.log(calculationOnWeight);

  if (calculationOnWeight === "true") {
    const priceUpdate = await PriceUpdate.findById(weightType);
    calculatedPrice = priceUpdate.price * weight + weight * discountOnLaborCost;
  } else {
    calculatedPrice = original;
  }

  const productData = {
    name: name,
    description: description,
    category: category,
    subCategory: subCategory,
    subSubCategory: subSubCategory,
    tags: tags,
    prices: {
      original: original,
      discounted: discounted,
      calculatedPrice: calculatedPrice,
    },
    imageGallery: imageGallery,
    stock: { quantity: stock },
    hsnCode: hsnCode,
    size: size,
    shippingCharge: shippingCharge,
    gst: gst,
    sku: sku,
    calculationOnWeight: calculationOnWeight,
    weightType: weightType,
    weight: weight,
    laborCost: laborCost,
    discountOnLaborCost: discountOnLaborCost ? discountOnLaborCost : null,
    isActive: isActive,
    isProductPopular: isProductPopular,
    isProductNew: isProductNew,
    filters: filters,
    color: color,
    material: material,
    season: season,
  };

  try {
    const newProduct = await Product.create(productData);
    const newProductVariant = await ProductVariantModel.create({
      productId: productData._id,
      productVariationId: productData.id,
    });
    newProductVariant.save();
    newProduct.mainProductId = newProduct._id;

    await newProduct.save();
    res.send({
      success: true,
      newProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

const addVarProduct = async (req, res, next) => {
  const {
    name,
    description,
    category,
    subCategory,
    subSubCategory,
    tags,
    original,
    discounted,
    stock,
    hsnCode,
    size,
    shippingCharge,
    color,
    gst,
    sku,
    calculationOnWeight,
    weightType,
    weight,
    laborCost,
    discountOnLaborCost,
    isActive,
    isProductPopular,
    isProductNew,
    filters,
    material,
    season,
    id,
    productColor,
    productSize,
  } = req.body;
  console.log(req.body);

  const imageGalleryFiles = req.files;

  const imageGallery = imageGalleryFiles.map((file) => file.filename);

  let calculatedPrice = 0;

  console.log(calculationOnWeight);

  if (calculationOnWeight === "true") {
    const priceUpdate = await PriceUpdate.findById(weightType);
    calculatedPrice = priceUpdate.price * weight + weight * discountOnLaborCost;
  } else {
    calculatedPrice = original;
  }

  const productData = {
    name: name,
    description: description,
    category: category,
    subCategory: subCategory,
    subSubCategory: subSubCategory,
    tags: tags,
    prices: {
      original: original,
      discounted: discounted,
      calculatedPrice: calculatedPrice,
    },
    imageGallery: imageGallery,
    stock: { quantity: stock },
    hsnCode: hsnCode,
    size: size,
    shippingCharge: shippingCharge,
    gst: gst,
    sku: sku,
    calculationOnWeight: calculationOnWeight,
    weightType: weightType,
    weight: weight,
    laborCost: laborCost,
    discountOnLaborCost: discountOnLaborCost ? discountOnLaborCost : null,
    isActive: isActive,
    isProductPopular: isProductPopular,
    isProductNew: isProductNew,
    filters: filters,
    color: color,
    material: material,
    season: season,
    isVariant: true,
    productColor: productColor,
    productSize: productSize,
  };

  try {
    const newProduct = await Product.create(productData);
    const oldProduct = await Product.findById(id);
    console.log(oldProduct._id);
    oldProduct.OtherVariations.push(newProduct._id);
    await oldProduct.save();
    newProduct.mainProductId = id;
    await newProduct.save();
    const newProductVariant = await ProductVariantModel.create({
      productId: oldProduct._id,
      productVariationId: newProduct._id,
    });
    newProductVariant.save();

    res.send({
      success: true,
      newProduct,
      message: "Product added successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({ success: false, error: "Internal Server Error" });
  }
};

const getVarProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    // Find the variant product by its ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.send({
        success: false,
        message: "Variant product not found.",
      });
    }

    // Check if the product is a variant (isVariant is true)
    if (!product.isVariant) {
      return res.send({
        success: false,
        message: "This product is not a variant.",
      });
    }

    return res.send({ success: true, product });
  } catch (error) {
    return res.send({
      success: false,
      error: "Failed to fetch the variant product.",
    });
  }
};

const getAllVarProducts = async (req, res) => {
  const { productIds } = req.body;
  console.log(req.body);

  try {
    const products = await Product.find({ _id: { $in: productIds } });
    return res.send({ success: true, products });
  } catch (error) {
    return res.send({
      success: false,
      error: "Failed to fetch the variant product.",
    });
  }
};

const getAllProductsForTable = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category_data",
        },
      },
      {
        $unwind: {
          path: "$category_data",
        },
      },
      {
        $project: {
          _id: 1,
          categoryTitle: "$category_data.name",
          sku: 1,
          calculationOnWeight: 1,
          prices: 1,
          name: 1,
          laborCost: 1,
          isProductNew: 1,
          weight: 1,
          imageGallery: 1,
          isVariant: 1,
        },
      },
    ]);

    return res.send({ success: true, products });
  } catch (error) {
    return res.send({ success: false, error: "Failed to fetch products." });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    let { category, color, material, season, minPrice, maxPrice } = req.query;
    console.log("Min Price", minPrice);

    // Convert string to ObjectId if necessary
    console.log("Category:", category);
    const categoryId = category
      ? new mongoose.Types.ObjectId(category)
      : undefined;
    const materialId = material
      ? new mongoose.Types.ObjectId(material)
      : undefined;
    console.log("Converted categoryId:", categoryId);
    console.log("Mi n ", parseInt(minPrice));
    // Initial $match stage based on your existing filter logic
    const matchStage = {
      $match: {
        ...(categoryId && { category: categoryId }),
        ...(color && { color }),
        ...(materialId && { material: materialId }),
        ...(season && { season }),
        ...(minPrice &&
          !isNaN(minPrice) && {
            "prices.discounted": { $gte: parseInt(minPrice) },
          }),
        ...(maxPrice &&
          !isNaN(maxPrice) && {
            "prices.discounted": { $lte: parseInt(maxPrice) },
          }),
      },
    };

    const newStages = [
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "ProductId",
          as: "productStock",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          productStock: 1,
          category: 1,
          subCategory: 1,
          subSubCategory: 1,
          tags: 1,
          prices: 1,
          imageGallery: 1,
          stock: 1,
          hsnCode: 1,
          size: 1,
          shippingCharge: 1,
          material: 1,
          color: 1,
          season: 1,
          gst: 1,
          sku: 1,
          calculationOnWeight: 1,
          weightType: 1,
          weight: 1,
          laborCost: 1,
          discountOnLaborCost: 1,
          isActive: 1,
          isProductPopular: 1,
          isProductNew: 1,
          createdAt: 1,
          filters: 1,
          productColor: 1,
          productSize: 1,
          OtherVariations: 1,
        },
      },
    ];

    // Combine matchStage with newStages
    const pipeline = [matchStage, ...newStages];

    const products = await Product.aggregate(pipeline).exec();

    return res.send({ success: true, products });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, error: error });
  }
};

const getProductsByPriceRange = async (req, res, next) => {
  try {
    let priceQuery;

    // Extract the range parameter from the request
    let priceRange = req.query.priceRange;
    console.log("price range", priceRange);

    // Define price queries based on the provided range
    if (priceRange === "5000-undefined") {
      priceRange = "5000+";
    }

    switch (priceRange) {
      case "0-1000":
        priceQuery = { "prices.calculatedPrice": { $gte: 0, $lte: 1000 } };
        break;
      case "1000-5000":
        priceQuery = { "prices.calculatedPrice": { $gte: 1000, $lte: 5000 } };
        break;
      case "5000+":
        priceQuery = { "prices.calculatedPrice": { $gte: 5000 } };
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Invalid price range",
        });
    }

    // Aggregation stages
    const newStages = [
      {
        $match: priceQuery,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "ProductId",
          as: "productStock",
        },
      },
      {
        $project: {
          // Add your fields here
          name: 1,
          description: 1,
          productStock: 1,
          category: 1,
          subCategory: 1,
          subSubCategory: 1,
          tags: 1,
          prices: 1,
          imageGallery: 1,
          stock: 1,
          hsnCode: 1,
          size: 1,
          shippingCharge: 1,
          material: 1,
          color: 1,
          season: 1,
          gst: 1,
          sku: 1,
          calculationOnWeight: 1,
          weightType: 1,
          weight: 1,
          laborCost: 1,
          discountOnLaborCost: 1,
          isActive: 1,
          isProductPopular: 1,
          isProductNew: 1,
          createdAt: 1,
          filters: 1,
          productColor: 1,
          productSize: 1,
          OtherVariations: 1,
        },
      },
    ];

    // Perform aggregation
    const products = await Product.aggregate(newStages);

    // Count of products
    const productCount = products.length;

    return res.status(200).json({
      success: true,
      message: `Products retrieved successfully for the price range ${priceRange}`,
      productCount,
      products,
    });
  } catch (error) {
    console.error("Error fetching products by price range:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// Get Specific Product
const getSpecificProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    // Convert string to ObjectId
    const objectId = new mongoose.Types.ObjectId(productId);

    // Initial $match stage to filter the specific product
    const matchStage = { $match: { _id: objectId } };

    const newStages = [
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "stocks",
          localField: "_id",
          foreignField: "ProductId",
          as: "productStock",
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          productStock: 1,
          category: 1,
          subCategory: 1,
          subSubCategory: 1,
          tags: 1,
          prices: 1,
          imageGallery: 1,
          stock: 1,
          hsnCode: 1,
          size: 1,
          shippingCharge: 1,
          material: 1,
          color: 1,
          season: 1,
          gst: 1,
          sku: 1,
          calculationOnWeight: 1,
          weightType: 1,
          weight: 1,
          laborCost: 1,
          discountOnLaborCost: 1,
          isActive: 1,
          isProductPopular: 1,
          isProductNew: 1,
          createdAt: 1,
          filters: 1,
          productColor: 1,
          productSize: 1,
          OtherVariations: 1,
        },
      },
    ];

    // Combine matchStage with newStages
    const pipeline = [matchStage, ...newStages];

    // Perform aggregation
    const aggregatedProducts = await Product.aggregate(pipeline).exec();

    // Since aggregation returns an array, get the first element
    const product = aggregatedProducts[0];
    if (!product) {
      return res.send({ success: false, message: "Product not found." });
    }
    return res.send({ success: true, product });
  } catch (error) {
    return res.send({ success: false, error: "Failed to fetch the product." });
  }
};

const updateProduct = async (req, res) => {
  try {
    // console.log(req.body)
    const {
      name,
      description,
      category,
      subCategory,
      subSubCategory,
      tags,
      original,
      discounted,
      stock,
      hsnCode,
      size,
      shippingCharge,
      imageGallery,
      color,
      gst,
      sku,
      calculationOnWeight,
      weightType,
      weight,
      laborCost,
      discountOnLaborCost,
      isActive,
      isProductPopular,
      isProductNew,
      filters,
      material,
      season,
      productColor,
      productSize,
      OtherVariations,
    } = req.body;
    const Id = req.params.id;
    const imageGalleryFiles = req.files;
    const productToUpdate = await Product.findById(Id);

    console.log("OtherVariations___________", typeof OtherVariations);
    
    const otherVariationsIDs = OtherVariations.map((variation) => variation.value);
    console.log("freeeee", otherVariationsIDs);
    const shouldRecalculatePrice =
      req.body.calculationOnWeight === "true" &&
      (req.body.weightType !== productToUpdate.weightType ||
        req.body.weight !== productToUpdate.weight ||
        req.body.discountOnLaborCost !== productToUpdate.discountOnLaborCost);

    let calculatedPrice = productToUpdate.prices.calculatedPrice;

    if (original !== productToUpdate.prices.original) {
      // Recalculate the calculated price based on the new original price
      calculatedPrice = original;
    }

    if (shouldRecalculatePrice) {
      const priceUpdate = await PriceUpdate.findById(req.body.weightType);
      calculatedPrice =
        priceUpdate.price * req.body.weight +
        req.body.weight * req.body.discountOnLaborCost;
    }

    if (!productToUpdate) {
      return res.send({ error: "SubSubCategory not found" });
    }
    // const otherVariationsIDs = OtherVariations.map((variation) => variation.value);
    // console.log("freeeee",otherVariationsIDs);
    let existingImageGallery = imageGallery || [];
    const productData = {
      name: name,
      description: description,
      category: category,
      subCategory: subCategory,
      subSubCategory: subSubCategory,
      tags: tags,
      prices: {
        original: original,
        discounted: discounted,
        calculatedPrice: calculatedPrice,
      },
      imageGallery: existingImageGallery,
      stock: { quantity: stock },
      hsnCode: hsnCode,
      size: size,
      shippingCharge: shippingCharge,
      gst: gst,
      sku: sku,
      calculationOnWeight: calculationOnWeight,
      weightType: weightType,
      weight: weight,
      laborCost: laborCost,
      discountOnLaborCost: discountOnLaborCost ? discountOnLaborCost : null,
      isActive: isActive,
      isProductPopular: isProductPopular,
      isProductNew: isProductNew,
      filters: filters,
      color: color,
      material: material,
      season: season,
      productColor: productColor,
      OtherVariations:OtherVariations,
      productSize: productSize,
    };

    let addedImages = imageGalleryFiles.map((file) => file.filename);

    if (!Array.isArray(addedImages)) {
      addedImages = [addedImages];
    }
    if (!Array.isArray(existingImageGallery)) {
      existingImageGallery = [existingImageGallery];
    }

    console.log(addedImages, "481");
    console.log(productData.imageGallery, "482");

    if (addedImages.length > 0) {
      productData.imageGallery = existingImageGallery.concat(addedImages);
    }

    await Product.findByIdAndUpdate(Id, productData);
    const UpdatedProduct = await Product.findById(Id);

    res.send({
      success: true,
      msg: "Product updated successfully",
      data: UpdatedProduct,
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const deletedProduct = await Product.findByIdAndRemove(productId);
    if (!deletedProduct) {
      return res.send({ success: false, message: "Product not found." });
    }
    return res.send({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return res.send({ success: false, error: "Failed to delete the product." });
  }
};

// Get Products by CategoryId
const getProductsByCategoryId = async (req, res) => {
  const cat = req.query.categoryId;
  const subCat = req.query.subCategoryId;
  const subSubCat = req.query.subSubCategory;
  console.log(req.query);

  // If categoryId exists, add it to the query filter

  try {
    let query = {};

    if (cat) {
      query.category = cat;
    }
    if (subCat) {
      query.subCategory = subCat;
    }
    // If subSubCategory exists, add it to the query filter
    if (subSubCat) {
      query.subSubCategory = subSubCat;
    }

    const products = await Product.find(query).exec();

    if (!products || products.length === 0) {
      return res.send({
        success: false,
        message: "No products found for the specified category.",
      });
    }

    return res.send({ success: true, products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
  }
};

// Get product by product tags
const getProductsByTag = async (req, res) => {
  try {
    const tag = req.query.tag;

    if (!tag) {
      return res.send({ success: false, error: "Tag parameter is required." });
    }

    const filter = { tags: { $regex: new RegExp(tag, "i") } };

    const products = await Product.find(filter).exec();

    return res.send({ success: true, products });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, error: error });
  }
};

// Get Products by subCategory
const getProductsBysubCategoryId = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const products = await Product.find({ subCategory: categoryId }).exec();

    if (!products || products.length === 0) {
      return res.send({
        success: false,
        message: "No products found for the specified category.",
      });
    }

    return res.send({ success: true, products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
  }
};

// Get Products by subSubCategory
const getProductsBysubSubCategoryId = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const products = await Product.find({ subSubCategory: categoryId }).exec();

    if (!products || products.length === 0) {
      return res.send({
        success: false,
        message: "No products found for the specified category.",
      });
    }

    return res.send({ success: true, products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
  }
};

module.exports = {
  getAllProducts,
  getSpecificProduct,
  updateProduct,
  getProductsByPriceRange,
  deleteProduct,
  addProduct,
  getProductsByCategoryId,
  getAllProductsForTable,
  addVarProduct,
  getVarProductById,
  getAllVarProducts,
  getProductsByTag,
  getProductsBysubCategoryId,
  getProductsBysubSubCategoryId,
};
