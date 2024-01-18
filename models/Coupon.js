const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      minlength: [3, "TOO SHORT"],
      maxlength: [14, "TOO LONG"],
    },
    type: {
      type: String,
      enum: ["%", "₹"],
      default: "%",
    },
    description: {
      type: String,
    },
    start: {
      type: Date,
    },
    expiry: {
      type: Date,
    },
    discount: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
