const { getDB } = require('../../config');
const { ObjectId } = require('mongodb');

const dotenv = require('dotenv');

dotenv.config();


const collection_name = 'Rutas'


exports.getRutas = async (req, res) => {
  try {
    const db = getDB();
    const jRutas = await db.collection(collection_name).find().toArray();
    res.json(jRutas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createRutas = async (req, res) => {
  const newRuta = {
    distancia: req.body.distancia,
    origen: req.body.origen,
    destino: req.body.destino,
    tAproximado: req.body.tAproximado,
  };

  try {

    console.log(newRuta)
    const db = getDB();
    const result = await db.collection(collection_name).insertOne(newRuta);
    res.status(201).json({
      message: "Ruta creada exitosamente",
      rutasId: result.insertedId,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.getRutabyId = async (req, res) => {
  const rutaId = req.params.id;
  if (!ObjectId.isValid(rutaId)) {
    return res.status(400).json({ message: 'ID de rutas no válido' });
  }
  try {
    const db = getDB();
    const ruta = await db.collection(collection_name).findOne({ _id: new ObjectId(rutaId) });

    if (!ruta) {
      return res.status(404).json({ message: 'Ruta no encontrado' });
    }
    res.json(ruta);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteRuta = async (req, res) => {
  const rutaId = req.params.id;
  if (!ObjectId.isValid(rutaId)) {
    return res.status(400).json({ message: 'ID de ruta no válido' });
  }
  try {
    const db = getDB();
    const result = await db.collection(collection_name).deleteOne({ _id: new ObjectId(rutaId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Ruta eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports.authenticateToken = authenticateToken;
