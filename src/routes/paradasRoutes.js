const express = require('express');
const router = express.Router();
const paradasController = require('../controllers/paradasController');
const { authenticateToken } = require('../controllers/userController'); 

router.post('/', authenticateToken, paradasController.createParadas); 
router.get('/', paradasController.getParadas); 
router.get('/:id', paradasController.getParadabyId); 
router.delete('/:id', authenticateToken, paradasController.deleteParada); 
router.put('/:id', authenticateToken, paradasController.updateParada); 

module.exports = router;
