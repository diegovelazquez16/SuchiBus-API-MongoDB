const express = require('express');
const router = express.Router();
const rutasController = require('../controllers/rutasController');
const { authenticateToken } = require('../controllers/userController'); 

router.post('/', authenticateToken, rutasController.createRutas); 
router.get('/', authenticateToken, rutasController.getRutas); 
router.get('/:id', authenticateToken, rutasController.getRutabyId); 
router.delete('/:id', authenticateToken, rutasController.deleteRuta); 
router.put('/:id', authenticateToken, rutasController.updateRutas); 

module.exports = router;
