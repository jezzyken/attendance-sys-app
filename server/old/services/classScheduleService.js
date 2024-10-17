const ClassSchedule = require('../models/ClassSchedule');

const classScheduleService = {
  createClassSchedule: async (classScheduleData) => {
    const classSchedule = new ClassSchedule(classScheduleData);
    return await classSchedule.save();
  },

  getAllClassSchedules: async () => {
    return await ClassSchedule.find();
  },

  getClassScheduleById: async (id) => {
    return await ClassSchedule.findById(id);
  },

  updateClassSchedule: async (id, classScheduleData) => {
    return await ClassSchedule.findByIdAndUpdate(id, classScheduleData, { new: true });
  },

  deleteClassSchedule: async (id) => {
    return await ClassSchedule.findByIdAndDelete(id);
  }
};

module.exports = classScheduleService;
