const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
});

const blogCategoryModel = mongoose.model("blogCategory", blogCategorySchema);

module.exports = blogCategoryModel;
