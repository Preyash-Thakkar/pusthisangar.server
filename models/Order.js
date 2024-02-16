const mongoose = require("mongoose");
const { any } = require("../middlewares/multerMiddleware");
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  transactionId:{
    type: mongoose.Schema.Types.Mixed
  },
  FirstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  phone:{
    type:String
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled", "return"],
    default: "pending",
  },
  totalAmount: {
    type: Number,
  },
  billingAddress: {
    type: String,
  },
  shippingAddress: {
    type: String,
  },
  country: {
    type: String,
    enum: ["India"],
  },
  isInvoiceGenrated: {
    type: Boolean,
  },
  invoiceNumber: {
    type: String,
  },
  invoiceGenrationDate: {
    type: Date,
  },
  state: {
    type: String,
    enum: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Andaman and Nicobar Islands",
      "Chandigarh",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Lakshadweep",
      "Delhi",
      "Puducherry",
    ],
  },
  city: {
    type: String,
  },
  postCode: {
    type: String,
  },
  paymentMethod: {
    type: String,
    // enum: ["COD","UPI","NB"],
    // default: "COD",
  },
  couponCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
