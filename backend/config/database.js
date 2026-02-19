const fs = require('fs').promises;
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data');

class Database {
  constructor() {
    this.tables = {
      users: path.join(DATA_PATH, 'users.json'),
      events: path.join(DATA_PATH, 'events.json'),
      tickets: path.join(DATA_PATH, 'tickets.json')
    };
  }

  async read(table) {
    try {
      const data = await fs.readFile(this.tables[table], 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Erreur lecture ${table}:`, error);
      return [];
    }
  }

  async write(table, data) {
    try {
      await fs.writeFile(this.tables[table], JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Erreur écriture ${table}:`, error);
      return false;
    }
  }

  async findOne(table, query) {
    const data = await this.read(table);
    return data.find(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  async find(table, query = {}) {
    const data = await this.read(table);
    if (Object.keys(query).length === 0) return data;
    
    return data.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  async insert(table, newItem) {
    const data = await this.read(table);
    data.push(newItem);
    await this.write(table, data);
    return newItem;
  }

  async update(table, id, updates) {
    const data = await this.read(table);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates };
    await this.write(table, data);
    return data[index];
  }

  async delete(table, id) {
    const data = await this.read(table);
    const filtered = data.filter(item => item.id !== id);
    await this.write(table, filtered);
    return true;
  }
}

module.exports = new Database();