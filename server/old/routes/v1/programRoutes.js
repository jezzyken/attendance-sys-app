const express = require('express');
const programController = require('../../controllers/programController');

const router = express.Router();

router.post('/', programController.createDegree);
router.get('/', programController.getAllDegrees);
router.get('/:id', programController.getDegreeById);
router.put('/:id', programController.updateDegree);
router.delete('/:id', programController.deleteDegree);

module.exports = router;
