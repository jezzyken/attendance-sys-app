const attendanceService = require('../services/attendanceService');

const attendanceController = {
  createAttendance: async (req, res) => {
    try {
      const attendance = await attendanceService.createAttendance(req.body);
      res.status(201).json(attendance);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAllAttendances: async (req, res) => {
    try {
      const attendances = await attendanceService.getAllAttendances();
      res.status(200).json(attendances);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAttendanceById: async (req, res) => {
    try {
      const attendance = await attendanceService.getAttendanceById(req.params.id);
      if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
      res.status(200).json(attendance);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateAttendance: async (req, res) => {
    try {
      const updatedAttendance = await attendanceService.updateAttendance(req.params.id, req.body);
      res.status(200).json(updatedAttendance);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteAttendance: async (req, res) => {
    try {
      const deletedAttendance = await attendanceService.deleteAttendance(req.params.id);
      if (!deletedAttendance) return res.status(404).json({ message: 'Attendance record not found' });
      res.status(204).json();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = attendanceController;
