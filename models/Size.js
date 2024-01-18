const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
  size: { type: Number },
});

const Size = mongoose.model("Size", sizeSchema);

module.exports = Size;
