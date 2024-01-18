const contentModela = require("../models/Content");
// const appError = require("../utils/appError");
// const catchAsync = require("../utils/catchAsync");

exports.getContents = async (req, res, next) => {
  try {
    const Contents = await contentModela.find({ deleted: false }).lean();
    if (Contents.length === 0) {
      return res.end();
    }
    return res.send({ success: true, Contents });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

exports.addContents = async (req, res, next) => {
  try {
    const body = {
      contentType: req.body.contentType,
      content: req.body.content,
    };
    const newRecordAdded = await contentModela.create(body);
    res.send({
      success : true,
      data: newRecordAdded,
      msg: "Content added",
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

exports.getContentsbyId = async (req, res, next) => {
  try {
    const contentId = req.params.id;
    console.log(contentId);
    const content = await contentModela.findById(contentId);

    if (!content || content.deleted) {
      return res.send({ error: "Content not found" });
    } else {
      res.send({ success: true, content });
    }
  } catch (error) {
    return res.send({ error: error.message });
  }
};

exports.updateContent = async (req, res, next) => {
  try {
    const Content = req.params.id;
    const RecordToUpdate = await contentModela.findById(Content);

    if (!RecordToUpdate || RecordToUpdate.deleted) {
        return res.send({ error: "Id not found" });
    }
    const updateData = {
      contentType: req.body.contentType,
      content: req.body.content,
      active: req.body.active,
      updatedAt: Date.now(),
    };

    await contentModela.findByIdAndUpdate(Content, updateData);
    const updatedRecord = await contentModela.findById(Content);
    res.send({
      success : true,
      msg: "Content updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

exports.deleteContent = async (req, res, next) => {
  try {
    const contentId = req.params.id;
    const record = await contentModela.findByIdAndUpdate(
      contentId,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!record) {
      return res.send({success : true , message: "record not found" });
    }

    return res.send({success : true, message: "Successfully Deleted"});
  } catch (error) {
    return res.send({ success : false , error: error.message });
  }
};

exports.getAllIncDel = async (req, res, next) => {
  try {
    const recordExists = await contentModela.find().lean();

    if (recordExists.length === 0) {
      return res.end();
    }

    return res.send({ success : true ,  data: recordExists });
  } catch (error) {
    return res.send({ error: error.message });
  }
};
