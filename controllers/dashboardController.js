const Order = require("../models/Order");
const Product = require("../models/Products");
const Customer = require("../models/Customer");
const moment = require("moment");

exports.getDashboardData = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const ShringarProducts = await Product.countDocuments({
        category: "650837d4f32a06ef841fa5d6",
    });
    const SilverVesselsProducts = await Product.countDocuments({
        category: "650837faf32a06ef841fa5d8",
    });
    const SugandhiProducts = await Product.countDocuments({
        category: "65083812f32a06ef841fa5da",
    });
    const PichwaiAndWallArtProducts = await Product.countDocuments({
        category: "6508382bf32a06ef841fa5dc",
    });
    const Vastra = await Product.countDocuments({
        category: "65083839f32a06ef841fa5de",
    });

    const FibreItems = await Product.countDocuments({
        category: "65083849f32a06ef841fa5e0",
    });

    const SeasonalProducts = await Product.countDocuments({
        category: "6508385bf32a06ef841fa5e2",
    });

   
    const customers = await Customer.countDocuments({ deleted: false });

    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const processingOrders = await Order.countDocuments({
      status: "processing",
    });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });
    const returnOrders = await Order.countDocuments({ status: "return" });

    const totalEarnings = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$totalAmount" },
        },
      },
    ]);

    const currentDate = moment();
    const weeklyEarnings = await calculateEarningsForInterval(currentDate, 7, "days");
    const monthlyEarnings = await calculateEarningsForInterval(currentDate, 1, "months");
    const yearlyEarnings = await calculateEarningsForInterval(currentDate, 1, "years");

    return res.send({
      orders: {
        totalOrders: totalOrders,
        pendingOrders: pendingOrders,
        processingOrders: processingOrders,
        completedOrders: completedOrders,
        cancelledOrders: cancelledOrders,
        returnOrders: returnOrders,
      },
      products: {
        totalProducts: totalProducts,
        ShringarProducts: ShringarProducts,
        SilverVesselsProducts: SilverVesselsProducts,
        SugandhiProducts: SugandhiProducts,
        PichwaiAndWallArtProducts: PichwaiAndWallArtProducts,
        Vastra: Vastra,
        FibreItems: FibreItems,
        SeasonalProducts: SeasonalProducts
      },
      customers: customers,
      totalEarnings: totalEarnings[0] ? totalEarnings[0].totalEarnings : 0,
      weeklyEarnings: weeklyEarnings,
      monthlyEarnings: monthlyEarnings,
      yearlyEarnings: yearlyEarnings,
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

async function calculateEarningsForInterval(date, value, unit) {
  const startDate = date.clone().subtract(value, unit);
  const endDate = date.clone();
  const earnings = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate.toDate(),
          $lt: endDate.toDate(),
        },
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$totalAmount" },
      },
    },
  ]);

  return earnings[0] ? earnings[0].totalEarnings : 0;
}
