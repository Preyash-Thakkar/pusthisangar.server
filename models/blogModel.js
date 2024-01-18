const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  blogFeed: {
    type: String,
    required: true,
  },
  blogTitle: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  description:{
    type:String,
    
  },
  blogCategory:{
    type: mongoose.Schema.Types.ObjectId , ref : "blogCategory",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  blog: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
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

const blogModela = mongoose.model("blog_master", blogSchema);

module.exports = blogModela;
