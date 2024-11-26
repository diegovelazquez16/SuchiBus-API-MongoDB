const { getDB } = require('../../config');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const collection_name = 'User'

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.sendStatus(401); 
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
exports.getUsers = async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection(collection_name).find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createUser = async (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    console.log(newUser)
    const db = getDB();
    const result = await db.collection(collection_name).insertOne(newUser);
    //const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      message: "Usuario creado exitosamente",
      userId: result.insertedId,
      //token: token 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = getDB();
    const user = await db.collection(collection_name).findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });
    res.json({
      message: 'Inicio de sesión exitoso',
      userId: user._id,
      token: token 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'ID de usuario no válido' });
  }
  try {
    const db = getDB();
    const user = await db.collection(collection_name).findOne({ _id: ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'ID de usuario no válido' });
  }
  try {
    const db = getDB();
    const result = await db.collection(collection_name).deleteOne({ _id: ObjectId(userId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports.authenticateToken = authenticateToken;
