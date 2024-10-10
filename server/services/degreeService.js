const Degree = require('../models/Degree');

const degreeService = {
  createDegree: async (degreeData) => {
    const degree = new Degree(degreeData);
    return await degree.save();
  },

  getAllDegrees: async () => {
    return await Degree.find().populate('departmentId');
  },

  getDegreeById: async (id) => {
    return await Degree.findById(id).populate('departmentId');
  },

  updateDegree: async (id, degreeData) => {
    return await Degree.findByIdAndUpdate(id, degreeData, { new: true });
  },

  deleteDegree: async (id) => {
    return await Degree.findByIdAndDelete(id);
  }
};

module.exports = degreeService;
