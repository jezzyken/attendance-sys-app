const express = require('express');
const router = express.Router();
const CONTROLLER = require('../../controllers/classController');

router.get('/', CONTROLLER.getAll);
router.get('/:id', CONTROLLER.getById);
router.get('/schedule/item', CONTROLLER.getByClassScheduleId);
router.get('/schedule/:id/item', CONTROLLER.getStudentSchedule);
router.post('/', CONTROLLER.add);
router.put('/:id', CONTROLLER.update);
router.delete('/:id', CONTROLLER.remove);

module.exports = router;