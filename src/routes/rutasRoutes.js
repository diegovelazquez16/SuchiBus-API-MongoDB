const express = require('express');
const router = express.Router();
const rutasController = require('../controllers/rutasController');

router.post('/', rutasController.createRutas);
router.get('/', rutasController.getRutas);
router.get('/:id', rutasController.getRutabyId);
router.delete('/:id', rutasController.deleteRuta);


module.exports = router;