const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middlewares/authMiddleware');

router.use(auth(['admin', 'kasir']));

// POST http://localhost:4072/api/transactions
router.post('/', transactionController.create);

// GET http://localhost:4072/api/transactions (Riwayat)
router.get('/', transactionController.getHistory);

// GET http://localhost:4072/api/transactions/:id (Detail)
router.get('/:id', transactionController.getDetail);

module.exports = router;