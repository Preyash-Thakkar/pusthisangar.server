const Material = require("../models/Material");


exports.getMaterials = async (req, res, next) => {
    try {
      const material = await Material.find().lean();
      if (material.length === 0) {
        return res.end();
      }
      return res.send({ success: true, material });
    } catch (error) {
      return res.send({ error: error.message });
    }
  };
  
  exports.addMaterial = async (req, res, next) => {
    try {
      const body = {
        name: req.body.name,
      };
      const newRecordAdded = await Material.create(body);
      res.send({
        success : true,
        data: newRecordAdded,
        msg: "Material added",
      });
    } catch (error) {
      return res.send({ error: error.message });
    }
  };
