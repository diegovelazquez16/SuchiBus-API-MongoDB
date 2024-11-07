const express = require('express');
const router = express.Router();
const paradasController = require('../controllers/paradasController');

router.post('/', paradasController.createParadas);
router.get('/', paradasController.getParadas);
router.get('/:id', paradasController.getParadabyId);
router.delete('/:id', paradasController.deleteParada);


module.exports = router;