const Course = require('../models/Course');

const courseService = {
  createCourse: async (courseData) => {
    const course = new Course(courseData);
    return await course.save();
  },

  getAllCourses: async () => {
    return await Course.find().populate('departmentId');
  },

  getCourseById: async (id) => {
    return await Course.findById(id).populate('departmentId');
  },

  updateCourse: async (id, courseData) => {
    return await Course.findByIdAndUpdate(id, courseData, { new: true });
  },

  deleteCourse: async (id) => {
    return await Course.findByIdAndDelete(id);
  }
};

module.exports = courseService;
