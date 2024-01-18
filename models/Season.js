const mongoose = require("mongoose");


const seasonSchema = new mongoose.Schema({
    name: { type: String},
    createdAt: { type: Date, default: Date.now },
  });
  
  const Season = mongoose.model("Season", seasonSchema);
  
  module.exports = Season;