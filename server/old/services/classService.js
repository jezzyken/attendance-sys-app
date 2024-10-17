const Class = require('../models/Class');

const classService = {
  createClass: async (classData) => {
    const classInstance = new Class(classData);
    return await classInstance.save();
  },

  getAllClasses: async () => {
    return await Class.find().populate('studentId courseId classScheduleId');
  },

  getClassById: async (id) => {
    return await Class.findById(id).populate('studentId courseId classScheduleId');
  },

  updateClass: async (id, classData) => {
    return await Class.findByIdAndUpdate(id, classData, { new: true });
  },

  deleteClass: async (id) => {
    return await Class.findByIdAndDelete(id);
  }
};

module.exports = classService;
