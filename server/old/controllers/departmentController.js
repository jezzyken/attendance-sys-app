const departmentService = require('../services/departmentService');

const departmentController = {
  createDepartment: async (req, res) => {
    try {
      const department = await departmentService.createDepartment(req.body);
      res.status(201).json(department);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllDepartments: async (req, res) => {
    try {
      const departments = await departmentService.getAllDepartments();
      res.status(200).json(departments);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getDepartmentById: async (req, res) => {
    try {
      const department = await departmentService.getDepartmentById(req.params.id);
      if (!department) return res.status(404).json({ message: 'Department not found' });
      res.status(200).json(department);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateDepartment: async (req, res) => {
    try {
      const updatedDepartment = await departmentService.updateDepartment(req.params.id, req.body);
      res.status(200).json(updatedDepartment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteDepartment: async (req, res) => {
    try {
      const deletedDepartment = await departmentService.deleteDepartment(req.params.id);
      if (!deletedDepartment) return res.status(404).json({ message: 'Department not found' });
      res.status(204).json();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = departmentController;
