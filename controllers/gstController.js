const gstModel = require('../models/Gst'); // Import the SubCategory model

exports.addGst = async (req, res, next) => {
    try {
      const {gst} = req.body
      
      const body = {
        gst:gst,
        sgst:gst/2,
        cgst:gst/2,
        igst:gst
      }
      
      const newSubCategory = await gstModel.create(body);
      res.send({
        success: true,
        newSubCategory,
        msg: "gst added",
      });
    } catch (error) {
      return res.send({ error: error.message });
    }
  };
  


exports.getGst = async (req, res) => {
  try {
    const subCategories = await gstModel.find({ isDeleted: false });
    return res.send(subCategories);
  } catch (err) {
    return res.send({ error: 'Server error' });
  }
};

exports.getSpecificGSTbyId = async (req, res) => {
  try {
    const  id = req.params.id; 
    const gstEntry = await gstModel.findById(id);

    if (!gstEntry) {
      return res.status(404).send({ error: 'GST entry not found' });
    }

    return res.send(gstEntry);
  } catch (err) {
    return res.send({ error: 'Server error' });
  }
};

