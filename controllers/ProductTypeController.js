const PriceUpdate = require("../models/PriceUpdate");

const AddPriceUpdate = async (req, res) => {
  try {
    console.log(req);
    const Price = new PriceUpdate(req.body);
    await Price.save();
    return res.send({
      success: true,
      msg: "PriceUpdate Added Succesfully",
      Price,
    });
  } catch (err) {
    return res.send({ error: err.message });
  }
};

const updatePrice = async (req, res) => {
  try {
    const Id = req.params.id;
    console.log(Id);
    const price = await PriceUpdate.findById(Id);
    
    if (!price) {
      return res.send({ error: "Id not found" });
    }

    const updateData = {
      price: req.body.price,
    };
    console.log(updateData)

    // Add { new: true } to get the updated document
    const updatedRecord = await PriceUpdate.findByIdAndUpdate(Id, updateData, { new: true });

    res.send({
      success: true,
      msg: "price updated successfully",
      updatedRecord,
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

const getSpecificPriceById = async (req, res) => {
  try {
    const id = req.params.id;
    const price = await PriceUpdate.findById(id);

    if (!price) {
      return res.send({ error: "Price not found for the given ID" });
    }

    res.send({
      success: true,
      msg: "Price retrieved successfully",
      price,
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

const getAllPriceUpdates = async (req, res) => {
  try {
    const allPrices = await PriceUpdate.find();

    res.send({
      success: true,
      msg: "All PriceUpdates retrieved successfully",
      prices: allPrices,
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};




module.exports = {
  AddPriceUpdate,
  updatePrice,
  getSpecificPriceById,
  getAllPriceUpdates,
};
