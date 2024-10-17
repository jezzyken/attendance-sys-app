const express = require('express');
const classScheduleController = require('../../controllers/classScheduleController');

const router = express.Router();

router.post('/', classScheduleController.createClassSchedule);
router.get('/', classScheduleController.getAllClassSchedules);
router.get('/:id', classScheduleController.getClassScheduleById);
router.put('/:id', classScheduleController.updateClassSchedule);
router.delete('/:id', classScheduleController.deleteClassSchedule);

module.exports = router;
