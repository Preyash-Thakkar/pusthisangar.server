const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  // product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },/
  name: { type: String },
  // photo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Color = mongoose.model("Color", colorSchema);

module.exports = Color;
