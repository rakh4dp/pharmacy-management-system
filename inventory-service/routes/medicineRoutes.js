const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth(['admin', 'kasir']), medicineController.getAll);
router.post('/', auth(['admin']), medicineController.create);
router.put('/:id', auth(['admin']), medicineController.update);
router.patch('/:id', auth(['admin']), medicineController.patch);
router.delete('/:id', auth(['admin']), medicineController.delete);

module.exports = router;