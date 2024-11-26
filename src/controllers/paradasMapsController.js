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
    const { location, zoom, ruta_id } = req.body;
  
    if (!location || typeof location !== 'string' || location.trim() === '') {
      return res.status(400).json({ message: 'El campo "location" es obligatorio y debe ser un texto válido.' });
    }
  
    try {
      const { puntoParadaURL, puntoParadaHTML } = generarPuntoParada(location, zoom, ruta_id);
  
      const newMapa = { location, zoom, ruta_id, puntoParadaURL, puntoParadaHTML };
  
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


exports.getParadasByRutaId = async (req, res) => {
  const { ruta_id } = req.params.id; 
  
  if (!ruta_id || typeof ruta_id !== 'string' || ruta_id.trim() === '') {
    return res.status(400).json({ message: 'El campo "ruta_id" es obligatorio y debe ser un texto válido.' });
  }

  try {
    const db = getDB(); 
    const paradas = await db.collection(collection_name) // Cambia `collection_name` por el nombre de tu colección
      .find({ ruta_id: ruta_id }) // Consulta para encontrar todas las paradas de esta ruta
      .toArray(); // Convertir los resultados a un array

    if (paradas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron paradas para esta ruta.' });
    }

    // Si se encuentran paradas, se devuelve la lista
    res.status(200).json({
      message: 'Paradas obtenidas correctamente.',
      paradas: paradas,
    });
  } catch (err) {
    console.error(err); // Log para facilitar la depuración
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

  const { location, zoom, ruta_id } = req.body;

  if (!location) {
    return res.status(400).json({ message: 'El campo "location" es obligatorio.' });
  }

  try {
    const { puntoParadaURL, puntoParadaHTML } = generarPuntoParada(location, zoom, ruta_id);

    const db = getDB();
    const result = await db.collection(collection_name).updateOne(
      { _id: new ObjectId(mapaId) },
      { $set: { location, zoom, ruta_id, puntoParadaURL, puntoParadaHTML } }
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
