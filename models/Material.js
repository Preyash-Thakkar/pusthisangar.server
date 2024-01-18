const mongoose = require("mongoose");


const materialSchema = new mongoose.Schema({
    name: { type: String},
    createdAt: { type: Date, default: Date.now },
  });
  
  const Material = mongoose.model("Material", materialSchema);
  
  module.exports = Material;