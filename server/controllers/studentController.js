const studentService = require('../services/studentService');

const studentController = {
  createStudent: async (req, res) => {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllStudents: async (req, res) => {
    try {
      const students = await studentService.getAllStudents();
      res.status(200).json(students);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getStudentById: async (req, res) => {
    try {
      const student = await studentService.getStudentById(req.params.id);
      if (!student) return res.status(404).json({ message: 'Student not found' });
      res.status(200).json(student);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateStudent: async (req, res) => {
    try {
      const updatedStudent = await studentService.updateStudent(req.params.id, req.body);
      res.status(200).json(updatedStudent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteStudent: async (req, res) => {
    try {
      const deletedStudent = await studentService.deleteStudent(req.params.id);
      if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
      res.status(204).json();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = studentController;
