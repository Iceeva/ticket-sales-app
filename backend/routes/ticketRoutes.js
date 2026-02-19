const express = require('express');
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware.verifyToken);

router.get('/', ticketController.getUserTickets);
router.post('/book', ticketController.bookTicket);
router.post('/:id/cancel', ticketController.cancelTicket);
router.post('/payment/simulate', ticketController.simulatePayment);

module.exports = router;