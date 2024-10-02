const Teacher = require('../models/Teacher');

const teacherService = {
  createTeacher: async (teacherData) => {
    const teacher = new Teacher(teacherData);
    return await teacher.save();
  },

  getAllTeachers: async () => {
    return await Teacher.find().populate('departmentId');
  },

  getTeacherById: async (id) => {
    return await Teacher.findById(id).populate('departmentId');
  },

  updateTeacher: async (id, teacherData) => {
    return await Teacher.findByIdAndUpdate(id, teacherData, { new: true });
  },

  deleteTeacher: async (id) => {
    return await Teacher.findByIdAndDelete(id);
  }
};

module.exports = teacherService;
