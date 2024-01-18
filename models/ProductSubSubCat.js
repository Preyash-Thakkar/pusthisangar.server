const mongoose = require("mongoose");

// Define the sub-sub-category schema by extending the sub-category schema
const subSubCategorySchema = new mongoose.Schema({
  Category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  SubCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Create a model for sub-sub-categories based on the subSubCategorySchema
const SubSubCategory = mongoose.model("SubSubCategory", subSubCategorySchema);

module.exports = SubSubCategory;
