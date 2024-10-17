const express = require('express');
const attendanceController = require('../../controllers/attendanceController');

const router = express.Router();

router.post('/', attendanceController.createAttendance);
router.get('/', attendanceController.getAllAttendances);
router.get('/:id', attendanceController.getAttendanceById);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
