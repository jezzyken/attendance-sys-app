const courseService = require('../services/courseService');

const courseController = {
  createCourse: async (req, res) => {
    try {
      const course = await courseService.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllCourses: async (req, res) => {
    try {
      const courses = await courseService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getCourseById: async (req, res) => {
    try {
      const course = await courseService.getCourseById(req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      res.status(200).json(course);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateCourse: async (req, res) => {
    try {
      const updatedCourse = await courseService.updateCourse(req.params.id, req.body);
      res.status(200).json(updatedCourse);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteCourse: async (req, res) => {
    try {
      const deletedCourse = await courseService.deleteCourse(req.params.id);
      if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
      res.status(204).json();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = courseController;
