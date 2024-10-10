const express = require('express');
const degreeController = require('../controllers/degreeController');

const router = express.Router();

router.post('/', degreeController.createDegree);
router.get('/', degreeController.getAllDegrees);
router.get('/:id', degreeController.getDegreeById);
router.put('/:id', degreeController.updateDegree);
router.delete('/:id', degreeController.deleteDegree);

module.exports = router;
