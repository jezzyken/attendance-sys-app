const Student = require('../models/Student');

const studentService = {
  createStudent: async (studentData) => {
    const student = new Student(studentData);
    return await student.save();
  },

  getAllStudents: async () => {
    return await Student.find().populate('courseId');
  },

  getStudentById: async (id) => {
    return await Student.findById(id).populate('courseId');
  },

  updateStudent: async (id, studentData) => {
    return await Student.findByIdAndUpdate(id, studentData, { new: true });
  },

  deleteStudent: async (id) => {
    return await Student.findByIdAndDelete(id);
  }
};

module.exports = studentService;
