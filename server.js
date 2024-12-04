const express = require('express');
const { connectDB } = require('./config');
const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
connectDB();
const mapasRutasRoutes = require('./src/routes/rutasMapsRoutes');
const paradasRoutes = require ('./src/routes/paradasMapsRoutes')
const userRoutes = require('./src/routes/userRoutes');

app.use('/mapasRuta', mapasRutasRoutes)
app.use('/paradas', paradasRoutes)
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`API activa en http://localhost:${port}`);
});
