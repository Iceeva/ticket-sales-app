const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
  static async findAll() {
    return await db.read('users');
  }

  static async findById(id) {
    return await db.findOne('users', { id });
  }

  static async findByEmail(email) {
    return await db.findOne('users', { email });
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      id: uuidv4(),
      ...userData,
      password: hashedPassword,
      role: userData.role || 'user',
      createdAt: new Date().toISOString()
    };
    return await db.insert('users', newUser);
  }

  static async update(id, updates) {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    return await db.update('users', id, updates);
  }

  static async delete(id) {
    return await db.delete('users', id);
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;