// Import necessary modules
const mongoose = require("mongoose");

// Define the Stock schema
const stockSchema = new mongoose.Schema({
  ProductId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type:String },
  color: { type:String },
  size: { type:String },
  quantity: {
    type: Number,
    required: true,
  },
  currentPricePerUnit: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
  },
});

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
