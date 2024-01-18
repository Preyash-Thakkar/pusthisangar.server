const mongoose = require("mongoose");

// Define the sub-category schema by extending the category schema
const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
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

// Create a model for sub-categories based on the subCategorySchema
const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
