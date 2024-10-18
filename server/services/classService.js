const MODEL = require("../models/classModel");
const ObjectId = require("mongoose").Types.ObjectId;

const getAll = async () => {
  return await MODEL.find();
};

const getByClassScheduleId = async (req) => {
    const { classScheduleId } = req.query;
  return await MODEL.find({
    classScheduleId: new ObjectId(classScheduleId),
  });
};

const getById = async (id) => {
  return await MODEL.findById(id);
};

const add = async (data) => {
  const newItem = new MODEL(data);
  return await newItem.save();
};

const update = async (id, data) => {
  return await MODEL.findByIdAndUpdate(id, data, { new: true });
};

const remove = async (id) => {
  return await MODEL.findByIdAndDelete(id);
};

module.exports = {
  getAll,
  getById,
  getByClassScheduleId,
  add,
  update,
  remove,
};
