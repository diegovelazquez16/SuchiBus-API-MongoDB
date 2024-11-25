const { getDB } = require('../../config');
const { ObjectId } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const collection_name = 'pruebarutasmapas';
const GOOGLE_MAPS_API_KEY = 'AIzaSyBoAgaxewurNrxSY1oMfTSS74aFdtp5EfY'; 

function generarMapaRuta(origin, destination, mode = 'driving') {
  const mapaRutaUrl = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=${mode}`;
  const mapaRutaHTML = `
    <iframe 
      width="600" 
      height="450" 
      style="border:0" 
      loading="lazy" 
      allowfullscreen 
      src="${mapaRutaUrl}">
    </iframe>`;
  return { mapaRutaUrl, mapaRutaHTML };
}

exports.getallMapasRutas = async (req, res) => {
  try {
    const db = getDB();
    const iframes = await db.collection(collection_name).find().toArray();
    res.json(iframes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMapaRuta = async (req, res) => {
  const { origin, destination, mode, terminal } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ message: 'Se requieren los campos "origin",  "destination y "terminal"' });
  }

  try {
    const { mapaRutaUrl, mapaRutaHTML } = generarMapaRuta(origin, destination, mode, terminal);

    const newIframe = { origin, destination, mode, terminal, mapaRutaUrl, mapaRutaHTML };

    const db = getDB();
    const result = await db.collection(collection_name).insertOne(newIframe);
    res.status(201).json({
      message: 'Mapa de ruta creado exitosamente',
      mapaRutaId: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMapaRutaById = async (req, res) => {
  const mapaRutaId = req.params.id;
  if (!ObjectId.isValid(mapaRutaId)) {
    return res.status(400).json({ message: 'ID de mapa de ruta no válido' });
  }

  try {
    const db = getDB();
    const iframe = await db.collection(collection_name).findOne({ _id: new ObjectId(mapaRutaId) });

    if (!iframe) {
      return res.status(404).json({ message: 'Mapa no encontrado' });
    }

    res.json(iframe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMapaRuta = async (req, res) => {
  const mapaRutaId = req.params.id;
  if (!ObjectId.isValid(mapaRutaId)) {
    return res.status(400).json({ message: 'ID de iframe no válido' });
  }

  const { origin, destination, mode, terminal } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ message: 'Se requieren los campos "origin", "destination" y "terminal"' });
  }

  try {
    const { iframeUrl, iframeHTML } = generarMapaRuta(origin, destination, mode, terminal);

    const db = getDB();
    const result = await db.collection(collection_name).updateOne(
      { _id: new ObjectId(mapaRutaId) },
      { $set: { origin, destination, mode, terminal, iframeUrl, iframeHTML } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Mapa de ruta no encontrado' });
    }

    res.json({ message: 'Mapa de ruta actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteMapaRuta = async (req, res) => {
  const mapaRutaId = req.params.id;
  if (!ObjectId.isValid(mapaRutaId)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const db = getDB();
    const result = await db.collection(collection_name).deleteOne({ _id: new ObjectId(mapaRutaId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Mapa de ruta no encontrado' });
    }

    res.json({ message: 'Mapa de ruta eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};