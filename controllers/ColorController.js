const Color = require("../models/Color");

// Get all colors that are not deleted
exports.getColors = async (req, res, next) => {
  try {
    const colors = await Color.find().lean();
    if (colors.length === 0) {
      return res.end();
    }
    return res.send({ success : true, colors: colors });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

// Add a new color
exports.addColor = async (req, res, next) => {
  try {
    const { name } = req.body;
    // const photo = req.file ? req.file.filename : "";

    const newRecord = await Color.create({  name });

    return res.send({
      success: true,
      data: newRecord,
      message: "Color added successfully",
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

// Get a color by ID
exports.getColorById = async (req, res, next) => {
  try {
    const colorId = req.params.id;
    const color = await Color.findById(colorId);

    if (!color || color.deleted) {
      return res.send({ error: "Color not found" });
    } else {
      res.send({ success: true, color });
    }
  } catch (error) {
    return res.send({ error: error.message });
  }
};

// Update a color by ID
exports.updateColor = async (req, res, next) => {
  try {
    const colorId = req.params.id;
    const recordToUpdate = await Color.findById(colorId);

    if (!recordToUpdate || recordToUpdate.deleted) {
      return res.send({ error: "Color not found" });
    }

    const { product, name } = req.body;
    const photo = req.file ? req.file.filename : "";

    const updateData = {
      product,
      name,
      photo,
      updatedAt: Date.now(),
    };

    await Color.findByIdAndUpdate(colorId, updateData);
    const updatedColor = await Color.findById(colorId);

    res.send({
      success: true,
      message: "Color updated successfully",
      updatedRecord: updatedColor,
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

// Delete a color by ID
exports.deleteColor = async (req, res, next) => {
  try {
    const colorId = req.params.id;
    const record = await Color.findByIdAndDelete(colorId);

    if (!record) {
      return res.send({ success: true, message: "Color not found" });
    }

    return res.send({ success: true, message: "Color successfully deleted" });
  } catch (error) {
    return res.send({ success: false, error: error.message });
  }
};
