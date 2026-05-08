const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/authMiddleware'); 

router.get('/', auth(['admin', 'kasir']), categoryController.getAll);

router.post('/', auth(['admin']), categoryController.create);
router.put('/:id', auth(['admin']), categoryController.update);
router.delete('/:id', auth(['admin']), categoryController.delete);

module.exports = router;