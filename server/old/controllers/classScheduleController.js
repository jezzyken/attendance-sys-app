const classScheduleService = require('../services/classScheduleService');

const classScheduleController = {
  createClassSchedule: async (req, res) => {
    try {
      const classSchedule = await classScheduleService.createClassSchedule(req.body);
      res.status(201).json(classSchedule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllClassSchedules: async (req, res) => {
    try {
      const classSchedules = await classScheduleService.getAllClassSchedules();
      res.status(200).json(classSchedules);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getClassScheduleById: async (req, res) => {
    try {
      const classSchedule = await classScheduleService.getClassScheduleById(req.params.id);
      if (!classSchedule) return res.status(404).json({ message: 'Class schedule not found' });
      res.status(200).json(classSchedule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateClassSchedule: async (req, res) => {
    try {
      const updatedClassSchedule = await classScheduleService.updateClassSchedule(req.params.id, req.body);
      res.status(200).json(updatedClassSchedule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteClassSchedule: async (req, res) => {
    try {
      const deletedClassSchedule = await classScheduleService.deleteClassSchedule(req.params.id);
      if (!deletedClassSchedule) return res.status(404).json({ message: 'Class schedule not found' });
      res.status(204).json();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = classScheduleController;
