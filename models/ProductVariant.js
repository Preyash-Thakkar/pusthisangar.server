const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Assuming the reference collection is named 'Product'
    required: true,
  },
  productVariationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const ProductVariantModel = mongoose.model('ProductVariantModel', productSchema);

module.exports = ProductVariantModel;