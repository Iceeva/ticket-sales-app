const express = require('express');
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, eventController.createEvent);
router.put('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, eventController.updateEvent);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, eventController.deleteEvent);

module.exports = router;