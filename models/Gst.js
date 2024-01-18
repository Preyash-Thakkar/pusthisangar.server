const mongoose = require("mongoose");

const gstSchema = new mongoose.Schema({
  gst: {
    type: Number,
    required: true,
  },
  sgst: {
    type:Number,
  },
  cgst: {
    type:Number,
  },
  igst: {
    type:Number,
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

const gstModel = mongoose.model("tax_and_gst", gstSchema);

module.exports = gstModel;
