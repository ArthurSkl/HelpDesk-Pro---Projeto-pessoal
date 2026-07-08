const { Router } = require('express');
const referenceController = require('../controllers/referenceController');

const router = Router();

router.get('/statuses', referenceController.statuses);
router.get('/priorities', referenceController.priorities);
router.get('/categories', referenceController.categories);
router.get('/users', referenceController.users);

module.exports = router;
