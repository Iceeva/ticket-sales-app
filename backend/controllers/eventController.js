const Event = require('../models/Event');

const eventController = {
  async getAllEvents(req, res) {
    try {
      const { search, category, date } = req.query;
      const filters = {};
      if (search) filters.title = search;
      if (category) filters.category = category;
      
      const events = await Event.findAll(filters);
      
      // Filtre par date si spécifié
      let filteredEvents = events;
      if (date) {
        const filterDate = new Date(date).toDateString();
        filteredEvents = events.filter(event => 
          new Date(event.date).toDateString() === filterDate
        );
      }
      
      res.json(filteredEvents);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async getEventById(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Événement non trouvé' });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async createEvent(req, res) {
    try {
      const event = await Event.create(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async updateEvent(req, res) {
    try {
      const event = await Event.update(req.params.id, req.body);
      if (!event) {
        return res.status(404).json({ message: 'Événement non trouvé' });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  },

  async deleteEvent(req, res) {
    try {
      await Event.delete(req.params.id);
      res.json({ message: 'Événement supprimé' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
};

module.exports = eventController;