require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, 
    message: {
        message: "Terlalu banyak permintaan dari IP ini, silakan coba lagi nanti."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use('/api/auth', proxy(process.env.AUTH_SERVICE_URL));

app.use('/api/categories', proxy(process.env.INVENTORY_SERVICE_URL));
app.use('/api/medicines', proxy(process.env.INVENTORY_SERVICE_URL));

app.use('/api/transactions', proxy(process.env.TRANSACTION_SERVICE_URL));

app.get('/', (req, res) => {
    res.send('API Gateway Apotek is Running');
});

const PORT = process.env.PORT || 4072;
app.listen(PORT, () => {
    console.log(`API GATEWAY jalan di port: ${PORT}`);
    console.log(`Semua request harus lewat pintu ini!`);
});