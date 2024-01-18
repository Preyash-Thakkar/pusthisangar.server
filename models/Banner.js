const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  bannerTitle: { type: String },
  image: { type: String },
  description: { type: String },
  bannerType: { type: String },
  bannerText: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const BannerMasterModel = mongoose.model("banner-master", bannerSchema);

module.exports = BannerMasterModel;
