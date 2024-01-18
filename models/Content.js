const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({

  contentType: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  deleted: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
  deletedAt: {
    type: Date,
  },
});

const contentModela = mongoose.model('content_master', contentSchema);

module.exports = contentModela;