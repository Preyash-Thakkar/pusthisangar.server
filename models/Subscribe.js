const mongoose = require("mongoose");
const { Schema } = mongoose;

const subScribeSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Subscribe = mongoose.model("Subscribe", subScribeSchema);

module.exports = Subscribe;
