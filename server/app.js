require('dotenv').config();
const express = require('express');
const mongoose = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cropRoutes = require('./routes/cropRoutes');

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files

app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
