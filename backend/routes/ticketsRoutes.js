const { Router } = require('express');
const ticketsController = require('../controllers/ticketsController');

const router = Router();

router.get('/', ticketsController.list);
router.get('/:id', ticketsController.getById);
router.post('/', ticketsController.create);
router.put('/:id', ticketsController.update);
router.delete('/:id', ticketsController.delete);

module.exports = router;
