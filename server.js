const express = require('express');
const { connectDB } = require('./config');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
connectDB();

const userRoutes = require('./src/routes/userRoutes');
const rutasRoutes = require('./src/routes/rutasRoutes');
const paradasRoutes = require ('./src/routes/paradasRoutes');
app.use('/api/users', userRoutes);
app.use('/api/rutas', rutasRoutes);
app.use('/api/paradas', paradasRoutes);
app.listen(port, () => {
  console.log(`API activa en http://localhost:${port}`);
});
