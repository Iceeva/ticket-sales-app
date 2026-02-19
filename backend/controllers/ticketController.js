const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

const ticketController = {
  async getUserTickets(req, res) {
    try {
      const tickets = await Ticket.findByUser(req.user.id);
      
      // Enrichir avec les détails des événements
      const enrichedTickets = await Promise.all(tickets.map(async (ticket) => {
        const event = await Event.findById(ticket.eventId);
        return { ...ticket, event };
      }));
      
      res.json(enrichedTickets);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async bookTicket(req, res) {
    try {
      const { eventId, quantity } = req.body;
      
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Événement non trouvé' });
      }
      
      if (event.availableTickets < quantity) {
        return res.status(400).json({ message: 'Pas assez de tickets disponibles' });
      }
      
      const totalPrice = event.price * quantity;
      
      const ticket = await Ticket.create({
        userId: req.user.id,
        eventId,
        quantity,
        totalPrice
      });
      
      await Event.updateAvailableTickets(eventId, quantity);
      
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async cancelTicket(req, res) {
    try {
      const ticket = await Ticket.findById(req.params.id);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket non trouvé' });
      }
      
      if (ticket.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Non autorisé' });
      }
      
      if (ticket.status === 'cancelled') {
        return res.status(400).json({ message: 'Ticket déjà annulé' });
      }
      
      await Ticket.cancel(req.params.id);
      
      // Restaurer les tickets disponibles
      const event = await Event.findById(ticket.eventId);
      event.availableTickets += ticket.quantity;
      await Event.update(ticket.eventId, { availableTickets: event.availableTickets });
      
      res.json({ message: 'Ticket annulé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async simulatePayment(req, res) {
    try {
      const { ticketId } = req.body;
      
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket non trouvé' });
      }
      
      // Simulation de paiement réussie
      await Ticket.update(ticketId, { paymentStatus: 'paid' });
      
      res.json({ 
        message: 'Paiement simulé avec succès',
        ticket: { ...ticket, paymentStatus: 'paid' }
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = ticketController;