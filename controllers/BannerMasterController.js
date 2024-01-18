const BannerMasterModel = require("../models/Banner");

exports.getBanner = async (req, res, next) => {
  const recordExists = await BannerMasterModel.find().lean();
  if (recordExists.length === 0) {
    return res.status(204).end();
  }
  return res.status(200).json({ success: true, data: recordExists });
};

exports.addNewBanner = async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  const body = {
    bannerTitle: req.body.bannerTitle,
    bannerType: req.body.bannerType,
    description: req.body.description,
    bannerText: req.body.bannerText,
    image: req.file ? req.file.filename : "not given",
  };
  const BannerIsUnique =
    (await BannerMasterModel.find({
      bannerTitle: req.body.bannerTitle,
      deleted: false,
    }).count()) === 0;
  if (BannerIsUnique) {
    const newBannerAdded = await BannerMasterModel.create(body);
    res.status(201).json({
      data: newBannerAdded,
      message: "Banner added successfully",
    });
  } else {
    return res.status(400).json({
      message: `banner with name '${body.bannerTitle}' alrady exist`,
    });
  }
};

exports.getBannerById = async (req, res, next) => {
  const recordExists = await BannerMasterModel.findById(req.params.id);
  if (!recordExists || recordExists.deleted) {
    return res.status(400).json({
      message: `Banner not found`,
    });
  } else {
    res.status(200).send({ data: recordExists });
  }
};

exports.updateBanner = async (req, res, next) => {
  const BannerId = req.params.id;
  const BannerToUpdate = await BannerMasterModel.findById(BannerId);

  if (!BannerToUpdate || BannerToUpdate.deleted) {
    return res.status(400).json({
      message: `Banner not found`,
    });
  }
  const updateData = {
    bannerTitle: req.body.bannerTitle,
    description: req.body.description,
    bannerText: req.body.bannerText,
    active: req.body.active,
    updatedAt: Date.now(),
  };
  if (req.file) {
    updateData.imagePath = req.file.filename;
  }
  await BannerMasterModel.findByIdAndUpdate(BannerId, updateData);
  const updatedBanner = await BannerMasterModel.findById(BannerId);
  res.status(200).json({
    message: "Banner updated successfully",
    data: updatedBanner,
  });
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const bannerId = req.params.id;
    const deletedBanner = await BannerMasterModel.findByIdAndDelete(bannerId);

    if (!deletedBanner) {
      return res.send({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.send({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
};

exports.getAllIncDelBanner = async (req, res, next) => {
  const recordExists = await BannerMasterModel.find().lean();

  if (recordExists.length === 0) {
    return res.status(204).end();
  }

  return res.status(200).json({ data: recordExists });
};
