const db = require('../config/db');

const Medicine = {
    findAll: async () => {
        const sql = `
            SELECT m.*, c.name as category_name 
            FROM medicines m 
            LEFT JOIN categories c ON m.category_id = c.id
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },
    findById: async (id) => {
        const [rows] = await db.execute('SELECT * FROM medicines WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { category_id, name, price, stock } = data;
        const [result] = await db.execute(
            'INSERT INTO medicines (category_id, name, price, stock) VALUES (?, ?, ?, ?)',
            [category_id, name, price, stock]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const { name, price, stock, category_id } = data;
        return await db.execute(
            'UPDATE medicines SET name=?, price=?, stock=?, category_id=? WHERE id=?',
            [name, price, stock, category_id, id]
        );
    },
    delete: async (id) => {
        return await db.execute('DELETE FROM medicines WHERE id = ?', [id]);
    },

    patch: async (id, fields) => {
        const keys = Object.keys(fields);
        const values = Object.values(fields);
        
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        
        const sql = `UPDATE medicines SET ${setClause} WHERE id = ?`;
        
        return await db.execute(sql, [...values, id]);
    },

    findByName: async (name) => {
        const [rows] = await db.execute('SELECT * FROM medicines WHERE name = ?', [name]);
        return rows[0];
    }
};

module.exports = Medicine;