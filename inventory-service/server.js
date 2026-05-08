const express = require('express');
require('dotenv').config();

const categoryRoutes = require('./routes/categoryRoutes');
const medicineRoutes = require('./routes/medicineRoutes');

const app = express();

app.use(express.json());

app.use('/api/categories', categoryRoutes);
app.use('/api/medicines', medicineRoutes);

app.get('/', (req, res) => {
    res.send('Inventory Service is Running');
});

const PORT = process.env.PORT || 4272;
app.listen(PORT, () => {
    console.log(`Inventory Service jalan di port: ${PORT}`);
    console.log(`Link: http://localhost:${PORT}`);
});