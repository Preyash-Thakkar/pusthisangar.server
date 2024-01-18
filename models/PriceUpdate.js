const mongoose = require("mongoose");
const { Schema } = mongoose;

const PriceUpdateSchema = new mongoose.Schema({
  productType : {
    type : "String",
  },
  price : {
    type : Number,
  }
  
});

const PriceUpdate = mongoose.model("PriceUpdate", PriceUpdateSchema);

module.exports = PriceUpdate;
