const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Event {
  static async findAll(filters = {}) {
    const events = await db.read('events');
    
    if (Object.keys(filters).length === 0) return events;
    
    return events.filter(event => {
      for (let key in filters) {
        if (filters[key] && !event[key]?.toLowerCase().includes(filters[key].toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }

  static async findById(id) {
    return await db.findOne('events', { id });
  }

  static async create(eventData) {
    const newEvent = {
      id: `evt_${uuidv4()}`,
      ...eventData,
      totalTickets: parseInt(eventData.totalTickets),
      availableTickets: parseInt(eventData.totalTickets),
      createdAt: new Date().toISOString()
    };
    return await db.insert('events', newEvent);
  }

  static async update(id, updates) {
    return await db.update('events', id, updates);
  }

  static async delete(id) {
    return await db.delete('events', id);
  }

  static async updateAvailableTickets(id, quantity) {
    const event = await this.findById(id);
    if (!event) return null;
    
    event.availableTickets -= quantity;
    return await db.update('events', id, { availableTickets: event.availableTickets });
  }
}

module.exports = Event;