const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const customerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Please add a email"],
    unique: true,
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  address: [{type : String}],
  phone: String,
  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: [6, "Password must be up to 6 characters"],
    // maxLength : [23, "Password must not be  23 characters"]
  },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  cartItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }, // You can include the quantity as well
      tax:{type:Number}
    },
  ],
  paymentMethods: [String],
  preferences: {
    language: String,
    currency: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

//Encrypt password before saving to DB
customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // hashed password
  const secPass = await bcrypt.hash(this.password, 10);
  this.password = secPass;
  next();
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
