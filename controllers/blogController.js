const blogModel = require("../models/blogModel");


exports.getBlog = async (req, res, next) => {
  try {
    const recordExists = await blogModel.find({ deleted: false }).lean();
    
    if (recordExists.length === 0) {
      return res.status(204).end();
    }

    return res.status(200).json({ data: recordExists });
  } catch (error) {
    // Handle the error here, you can send an error response or log it
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.addBlog = async (req, res, next) => {
  try {
    const body = {
      blogTitle: req.body.blogTitle,
      blogFeed: req.body.blogFeed,
      date: req.body.date,
      blogCategory :req.body.blogCategory, 
      imagePath: req.file ? req.file.filename : "",
      description: req.body.description,
      blog: req.body.blog
    };
    const newRecordAdded = await blogModel.create(body);
    res.status(201).json({
      data: newRecordAdded,
      message: "Blog added successfully",
    });
  } catch (error) {
    // Handle the error here, you can send an error response or log it
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBlogbyblogCategoryId = async (req, res, next) => {
  try {
    const blogCategoryId = req.params.id;

    
    const blogs = await blogModel.find({ blogCategory: blogCategoryId }).lean();

    if (blogs.length === 0) {
      return res.status(204).end(); 
    }

    return res.status(200).json({ data: blogs });
  } catch (error) {
    
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



exports.getBlogbyId = async (req, res, next) => {
  try {
    const recordExists = await blogModel.findById(req.params.id);
    if (!recordExists || recordExists.deleted) {
      return res.status(400).send("error");
    } else {
      return res.status(200).send({ recordExists });
    }
  } catch (error) {
    // Handle the error here, you can send an error response or log it
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};


exports.updateBlog = async (req, res, next) => {
  try {
    const Blog = req.params.id;
    const RecordToUpdate = await blogModel.findById(Blog);

    if (!RecordToUpdate || RecordToUpdate.deleted) {
      return res.status(400).send({ error: "Record not found" });
    }
    
    const updateData = {
      blogTitle: req.body.blogTitle,
      blogFeed: req.body.blogFeed,
      date: req.body.date,
      blogCategory :req.body.blogCategory,
      blog: req.body.blog,
      imagePath: req.file ? req.file.filename : "",
      description: req.body.description,
      updatedAt: Date.now(),
    };

    // Update the record
    await RecordToUpdate.updateOne(updateData);

    res.status(200).json({
      data: RecordToUpdate,
      message: "Blog updated successfully",
    });
  } catch (error) {
    // Handle the error here, you can send an error response or log it
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.deleteBlog = async (req, res, next) => {
  try {
    const record = await blogModel.findByIdAndUpdate(
      req.params.id,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    return res.status(204).end();
  } catch (error) {
    // Handle the error here, you can send an error response or log it
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllIncDel = async (req, res, next) => {
  try {
    const recordExists = await blogModel.find().lean();

    if (recordExists.length === 0) {
      return res.status(204).end();
    }

    return res.status(200).json({ data: recordExists });
  } catch (error) {
    // Handle the error here, you can send an error response or log it
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
