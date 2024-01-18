const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new mongoose.Schema({
    name :{
        type : String
    },
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
  phone:{
    type : String,
  },
  subject:{
    type : String,
  },
  message:{
    type : String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});


const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
