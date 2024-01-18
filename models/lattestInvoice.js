const mongoose = require("mongoose");

const lattestInvoicechema = new mongoose.Schema({
  lattestInvoice: {
    type: Number,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const lattestInvoiceModel = mongoose.model(
  "lattest_invoice_number",
  lattestInvoicechema
);

module.exports = lattestInvoiceModel;
