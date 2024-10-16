const express = require('express');
const router = express.Router();
const CONTROLLER = require('../../controllers/classscheduleController');

router.get('/', CONTROLLER.getAll);
router.get('/:id', CONTROLLER.getById);
router.get('/teacher/:id', CONTROLLER.getByTeacherId);
router.post('/', CONTROLLER.add);
router.put('/:id', CONTROLLER.update);
router.delete('/:id', CONTROLLER.remove);

module.exports = router;