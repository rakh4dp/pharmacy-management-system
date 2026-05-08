const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const auth = require('../middlewares/authMiddleware');

router.get('/', medicineController.getAll);
router.post('/', medicineController.create);
router.put('/:id', medicineController.update);
router.patch('/:id', medicineController.patch);
router.delete('/:id', medicineController.delete);

module.exports = router;