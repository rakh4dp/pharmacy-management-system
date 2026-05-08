const express = require('express');
require('dotenv').config();

const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

app.use(express.json());

app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
    res.send('Transaction Service (Apotek) is Running');
});

const PORT = process.env.PORT || 4372;
app.listen(PORT, () => {
    console.log(`Transaction Service jalan di port: ${PORT}`);
    console.log(`Link: http://localhost:${PORT}`);
});