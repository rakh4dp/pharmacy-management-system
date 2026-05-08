const db = require('../config/db');

const User = {
    findByUsername: async (username) => {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0]; 
    },

    create: async (username, hashedPassword, role) => {
        const [result] = await db.execute(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );
        return result.insertId;
    }
};

module.exports = User;