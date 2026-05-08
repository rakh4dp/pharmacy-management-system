const db = require('../config/db');

const Category = {
    findAll: async () => {
        const [rows] = await db.execute('SELECT * FROM categories');
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
        return rows[0];
    },
    findByName: async (name) => {
        const [rows] = await db.execute('SELECT * FROM categories WHERE name = ?', [name]);
        return rows[0];
    },
    create: async (name) => {
        const [result] = await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
        return result.insertId;
    },
    update: async (id, name) => {
        return await db.execute('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    },
    delete: async (id) => {
        return await db.execute('DELETE FROM categories WHERE id = ?', [id]);
    },
    isUsed: async (id) => {
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM medicines WHERE category_id = ?', [id]);
        return rows[0].count > 0;
    }
};

module.exports = Category;