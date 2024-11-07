const { getDB } = require('../../config');
const { ObjectId } = require('mongodb');

const dotenv = require('dotenv');

dotenv.config();

const collection_name = 'Paradas'


exports.createParadas = async (req, res) => {
  const newParada = {
    nombre: req.body.nombre,
    ubicacion: req.body.ubicacion,

  };

  try {

    console.log(newParada)
    const db = getDB();
    const result = await db.collection(collection_name).insertOne(newParada);
    res.status(201).json({
      message: "Parada creada exitosamente",
      paradaId: result.insertedId,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getParadas = async (req, res) => {
    try {
      const db = getDB();
      const jParadas = await db.collection(collection_name).find().toArray();
      res.json(jParadas);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

exports.getParadabyId = async (req, res) => {
  const paradaId = req.params.id;
  if (!ObjectId.isValid(paradaId)) {
    return res.status(400).json({ message: 'ID de rutas no válido' });
  }
  try {
    const db = getDB();
    const parada = await db.collection(collection_name).findOne({ _id: new ObjectId(paradaId) });

    if (!parada) {
      return res.status(404).json({ message: 'Ruta no encontrado' });
    }
    res.json(parada);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteParada = async (req, res) => {
  const paradaId = req.params.id;
  if (!ObjectId.isValid(paradaId)) {
    return res.status(400).json({ message: 'ID de parada no válido' });
  }
  try {
    const db = getDB();
    const result = await db.collection(collection_name).deleteOne({ _id: new ObjectId(paradaId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Parada eliminada exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports.authenticateToken = authenticateToken;
