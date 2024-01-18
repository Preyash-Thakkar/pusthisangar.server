const Size = require("../models/Size");

exports.getSizes = async (req, res, next) => {
  try {
    const sizes = await Size.find().lean();
    if (sizes.length === 0) {
      return res.end();
    }
    return res.send({ success: true, sizes:sizes });
  } catch (error) {
    return res.send({ success: false, error: error.message });
  }
};

exports.addSize = async (req, res, next) => {
  try {
    const { size } = req.body;
    const newSize = await Size.create({ size });
    res.send({
      success: true,
      data: newSize,
      msg: "Size added",
    });
  } catch (error) {
    return res.send({ success: false, error: error.message });
  }
};

exports.getSizeById = async (req, res, next) => {
  try {
    const sizeId = req.params.id;
    const size = await Size.findById(sizeId).populate("product").lean();

    if (!size) {
      return res.send({ success: false, error: "Size not found" });
    } else {
      res.send({ success: true, size });
    }
  } catch (error) {
    return res.send({ success: false, error: error.message });
  }
};

exports.updateSize = async (req, res, next) => {
  try {
    const sizeId = req.params.id;
    const updateData = {
      product: req.body.product,
      size: req.body.size,
    };
    
    const updatedSize = await Size.findByIdAndUpdate(sizeId, updateData, {
      new: true,
    }).populate("product").lean();

    if (!updatedSize) {
      return res.send({ success: false, error: "Size not found" });
    }

    res.send({
      success: true,
      msg: "Size updated successfully",
      data: updatedSize,
    });
  } catch (error) {
    return res.send({ success: false, error: error.message });
  }
};

exports.deleteSize = async (req, res, next) => {
  try {
    const sizeId = req.params.id;
    const deletedSize = await Size.findByIdAndDelete(sizeId);

    if (!deletedSize) {
      return res.send({ success: false, error: "Size not found" });
    }

    return res.send({ success: true, message: "Size deleted successfully" });
  } catch (error) {
    return res.send({ success: false, error: error.message });
  }
};
