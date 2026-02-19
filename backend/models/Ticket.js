const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Ticket {
  static async findAll(filters = {}) {
    const tickets = await db.read('tickets');
    
    if (Object.keys(filters).length === 0) return tickets;
    
    return tickets.filter(ticket => {
      for (let key in filters) {
        if (ticket[key] !== filters[key]) return false;
      }
      return true;
    });
  }

  static async findById(id) {
    return await db.findOne('tickets', { id });
  }

  static async findByUser(userId) {
    return await db.find('tickets', { userId });
  }

  static async create(ticketData) {
    const ticketCode = `TICKET-${Date.now()}-${Math.random().toString(36).toUpperCase().substr(2, 6)}`;
    
    const newTicket = {
      id: `tck_${uuidv4()}`,
      ...ticketData,
      ticketCode,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
    return await db.insert('tickets', newTicket);
  }

  static async update(id, updates) {
    return await db.update('tickets', id, updates);
  }

  static async cancel(id) {
    const ticket = await this.findById(id);
    if (!ticket) return null;
    
    ticket.status = 'cancelled';
    return await db.update('tickets', id, { status: 'cancelled' });
  }
}

module.exports = Ticket;