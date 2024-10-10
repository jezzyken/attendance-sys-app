const degreeService = require('../services/degreeService');

const degreeController = {
  createDegree: async (req, res) => {
    try {
      const degree = await degreeService.createDegree(req.body);
      res.status(201).json(degree);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllDegrees: async (req, res) => {
    try {
      const degrees = await degreeService.getAllDegrees();
      res.status(200).json(degrees);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getDegreeById: async (req, res) => {
    try {
      const degree = await degreeService.getDegreeById(req.params.id);
      if (!degree) return res.status(404).json({ message: 'Degree not found' });
      res.status(200).json(degree);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateDegree: async (req, res) => {
    try {
      const updatedDegree = await degreeService.updateDegree(req.params.id, req.body);
      res.status(200).json(updatedDegree);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteDegree: async (req, res) => {
    try {
      const deletedDegree = await degreeService.deleteDegree(req.params.id);
      if (!deletedDegree) return res.status(404).json({ message: 'Degree not found' });
      res.status(204).json();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = degreeController;
