const express = require('express');
const { connectDB } = require('./config');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
