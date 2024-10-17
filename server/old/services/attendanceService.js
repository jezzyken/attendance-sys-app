const Attendance = require('../models/Attendance');

const attendanceService = {
  createAttendance: async (attendanceData) => {
    const attendance = new Attendance(attendanceData);
    return await attendance.save();
  },

  getAllAttendances: async () => {
    return await Attendance.find().populate('classId studentId');
  },

  getAttendanceById: async (id) => {
    return await Attendance.findById(id).populate('classId studentId');
  },

  updateAttendance: async (id, attendanceData) => {
    return await Attendance.findByIdAndUpdate(id, attendanceData, { new: true });
  },

  deleteAttendance: async (id) => {
    return await Attendance.findByIdAndDelete(id);
  }
};

module.exports = attendanceService;
