const teacherService = require('../services/teacherService');

const teacherController = {
  createTeacher: async (req, res) => {
    try {
      const teacher = await teacherService.createTeacher(req.body);
      res.status(201).json(teacher);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllTeachers: async (req, res) => {
    try {
      const teachers = await teacherService.getAllTeachers();
      res.status(200).json(teachers);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getTeacherById: async (req, res) => {
    try {
      const teacher = await teacherService.getTeacherById(req.params.id);
      if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
      res.status(200).json(teacher);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateTeacher: async (req, res) => {
    try {
      const updatedTeacher = await teacherService.updateTeacher(req.params.id, req.body);
      res.status(200).json(updatedTeacher);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteTeacher: async (req, res) => {
    try {
      const deletedTeacher = await teacherService.deleteTeacher(req.params.id);
      if (!deletedTeacher) return res.status(404).json({ message: 'Teacher not found' });
      res.status(204).json();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = teacherController;
