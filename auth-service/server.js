const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Auth Service Apotek is Running');
});

const PORT = process.env.PORT || 4172;
app.listen(PORT, () => {
    console.log(`Auth Service jalan di port: ${PORT}`);
    console.log(`Link: http://localhost:${PORT}`);
});