const express = require('express');
const router = express.Router();
const rutasMapsController = require('../controllers/rutasMapsController');
const { authenticateToken } = require('../controllers/userController');

router.post('/', authenticateToken, rutasMapsController.createMapaRuta);
router.get('/', authenticateToken, rutasMapsController.getallMapasRutas);
router.get('/:id', authenticateToken, rutasMapsController.getMapaRutaById);
router.put('/:id', authenticateToken, rutasMapsController.updateMapaRuta);
router.delete('/:id', authenticateToken, rutasMapsController.deleteMapaRuta);

module.exports = router;
