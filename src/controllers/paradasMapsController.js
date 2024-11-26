const { getDB, googleMapsApiKey } = require('../../config');
const { ObjectId } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const collection_name = 'puntosdeparada';

function generarPuntoParada(location, zoom = 14) {
    if (!location || typeof location !== 'string' || location.trim() === '') {
      throw new Error("El parámetro 'location' es obligatorio y debe ser un texto válido.");
    }
  
    const encodedLocation = encodeURIComponent(location.trim());
    const puntoParadaURL = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodedLocation}&zoom=${zoom}`;
    const puntoParadaHTML = `
      <iframe 
        width="600" 
        height="450" 
        style="border:0" 
        loading="lazy" 
        allowfullscreen 
        src="${puntoParadaURL}">
      </iframe>`;
    return { puntoParadaURL, puntoParadaHTML };
  }
  

exports.getMapas = async (req, res) => {
  try {
    const db = getDB();
    const mapas = await db.collection(collection_name).find().toArray();
    res.json(mapas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMapa = async (req, res) => {
    const { location, zoom, rutaId } = req.body;
  
    if (!location || typeof location !== 'string' || location.trim() === '') {
      return res.status(400).json({ message: 'El campo "location" es obligatorio y debe ser un texto válido.' });
    }
  
    try {
      const { puntoParadaURL, puntoParadaHTML } = generarPuntoParada(location, zoom, rutaId);
  
      const newMapa = { location, zoom, rutaId, puntoParadaURL, puntoParadaHTML };
  
      const db = getDB();
      const result = await db.collection(collection_name).insertOne(newMapa);
      res.status(201).json({
        message: 'Punto de parada creado exitosamente',
        mapaId: result.insertedId,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

exports.getMapaById = async (req, res) => {
  const mapaId = req.params.id;
  if (!ObjectId.isValid(mapaId)) {
    return res.status(400).json({ message: 'ID de mapa no válido' });
  }

  try {
    const db = getDB();
    const mapa = await db.collection(collection_name).findOne({ _id: new ObjectId(mapaId) });

    if (!mapa) {
      return res.status(404).json({ message: 'Mapa no encontrado' });
    }

    res.json(mapa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMapa = async (req, res) => {
  const mapaId = req.params.id;
  if (!ObjectId.isValid(mapaId)) {
    return res.status(400).json({ message: 'ID de mapa no válido' });
  }

  const { location, zoom, rutaId } = req.body;

  if (!location) {
    return res.status(400).json({ message: 'El campo "location" es obligatorio.' });
  }

  try {
    const { puntoParadaURL, puntoParadaHTML } = generarPuntoParada(location, zoom, rutaId);

    const db = getDB();
    const result = await db.collection(collection_name).updateOne(
      { _id: new ObjectId(mapaId) },
      { $set: { location, zoom,rutaId, puntoParadaURL, puntoParadaHTML } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Mapa no encontrado' });
    }

    res.json({ message: 'Mapa actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMapa = async (req, res) => {
  const mapaId = req.params.id;
  if (!ObjectId.isValid(mapaId)) {
    return res.status(400).json({ message: 'ID de mapa no válido' });
  }

  try {
    const db = getDB();
    const result = await db.collection(collection_name).deleteOne({ _id: new ObjectId(mapaId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Mapa no encontrado' });
    }

    res.json({ message: 'Mapa eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
