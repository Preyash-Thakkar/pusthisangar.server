const Season = require("../models/Season");


exports.getSeasons = async (req, res, next) => {
    try {
      const season = await Season.find().lean();
      if (season.length === 0) {
        return res.end();
      }
      return res.send({ success: true, season });
    } catch (error) {
      return res.send({ error: error.message });
    }
  };
  
  exports.addSeason = async (req, res, next) => {
    try {
      const body = {
        name: req.body.name,
      };
      const newRecordAdded = await Season.create(body);
      res.send({
        success : true,
        data: newRecordAdded,
        msg: "Material added",
      });
    } catch (error) {
      return res.send({ error: error.message });
    }
  };
