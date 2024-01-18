const Coupon = require("../models/Coupon");


const createCoupon = async (req, res) => {
  try {
    const { name, type, description, start, expiry, discount , active } = req.body;

    // Create a new coupon
    const coupon = await Coupon.create({
      name,
      type,
      description,
      start,
      expiry,
      discount,
      active,
    });

    return res.send({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
};


const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();

    return res.send({
      success: true,
      coupons,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
};


const getCouponById = async (req, res) => {
  try {
    const couponId = req.params.id;
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.send({
        success: false,
        message: "Coupon not found",
      });
    }
    return res.send({
      success: true,
      coupon,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
};

// Update a coupon by ID
const updateCouponById = async (req, res) => {
  try {
    const couponId = req.params.id;
    const { name, type, description, expiry, start, discount , active } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        name,
        type,
        description,
        start,
        expiry,
        discount,
        active,
      },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.send({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.send({
      success: true,
      message: "Coupon updated successfully",
      coupon: updatedCoupon,
    });
  } catch (error) {
    return res.send({
      success: false,
      error: error.message,
    });
  }
};

// Delete a coupon by ID
const deleteCouponById = async (req, res) => {
  try {
    const  couponId  = req.params.id;
    const deletedCoupon = await Coupon.findByIdAndDelete(couponId);

    if (!deletedCoupon) {
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

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCouponById,
  deleteCouponById,
};
