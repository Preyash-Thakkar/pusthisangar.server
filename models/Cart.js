const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: "Product",
        },
        count: {type : Number},
      },
    ],
    cartTotal: {type : Number},
    totalAfterDiscount: {type : Number},
    orderedBy: { type: ObjectId, ref: "Customer" },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;