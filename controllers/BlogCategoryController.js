const blogCategoryModel = require("../models/BlogCategory");

exports.getBlogCategories = async (req, res, next) => {
  try {
    const blogCategories = await blogCategoryModel.find().lean();
    return res.status(200).json({ blogCategories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.createBlogCategory = async (req, res, next) => {
  try {
    const { name, active } = req.body;
    const newCategory = await blogCategoryModel.create({ name, active });
    return res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getBlogCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await blogCategoryModel.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateBlogCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const { name, active } = req.body;
    const updatedCategory = await blogCategoryModel.findByIdAndUpdate(
      categoryId,
      { name, active, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteBlogCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await blogCategoryModel.findByIdAndDelete(
      categoryId,
    );
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


