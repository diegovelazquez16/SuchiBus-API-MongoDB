const express = require('express');
const router = express.Router();
const paradasMapsController = require('../controllers/paradasMapsController');
const { authenticateToken } = require('../controllers/userController');

router.post('/', authenticateToken, paradasMapsController.createMapa);
router.get('/', authenticateToken, paradasMapsController.getMapas);
router.get('/:id', authenticateToken, paradasMapsController.getMapaById);
router.put('/:id', authenticateToken, paradasMapsController.updateMapa);
router.delete('/:id', authenticateToken, paradasMapsController.deleteMapa);

module.exports = router;
