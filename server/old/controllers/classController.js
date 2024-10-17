const classService = require('../services/classService');

const classController = {
  createClass: async (req, res) => {
    try {
      const classInstance = await classService.createClass(req.body);
      res.status(201).json(classInstance);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllClasses: async (req, res) => {
    try {
      const classes = await classService.getAllClasses();
      res.status(200).json(classes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getClassById: async (req, res) => {
    try {
      const classInstance = await classService.getClassById(req.params.id);
      if (!classInstance) return res.status(404).json({ message: 'Class not found' });
      res.status(200).json(classInstance);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateClass: async (req, res) => {
    try {
      const updatedClass = await classService.updateClass(req.params.id, req.body);
      res.status(200).json(updatedClass);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteClass: async (req, res) => {
    try {
      const deletedClass = await classService.deleteClass(req.params.id);
      if (!deletedClass) return res.status(404).json({ message: 'Class not found' });
      res.status(204).json();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = classController;
