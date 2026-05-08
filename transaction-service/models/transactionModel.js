const db = require('../config/db');

const Transaction = {
    create: async (userId, customerName, totalPrice, items) => {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const [trxResult] = await connection.execute(
                'INSERT INTO transactions (user_id, customer_name, total_price) VALUES (?, ?, ?)',
                [userId, customerName, totalPrice]
            );
            const transactionId = trxResult.insertId;

            for (const item of items) {
                await connection.execute(
                    'INSERT INTO transaction_details (transaction_id, medicine_id, quantity, subtotal) VALUES (?, ?, ?, ?)',
                    [transactionId, item.medicine_id, item.quantity, item.subtotal]
                );
            }

            await connection.commit();
            return transactionId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    findAll: async () => {
        const sql = `
            SELECT t.*, u.username as kasir 
            FROM transactions t 
            JOIN users u ON t.user_id = u.id 
            ORDER BY t.transaction_date DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    findById: async (id) => {
        const [trx] = await db.execute('SELECT * FROM transactions WHERE id = ?', [id]);
        if (trx.length === 0) return null;

        const [details] = await db.execute(`
            SELECT td.*, m.name as medicine_name 
            FROM transaction_details td 
            JOIN medicines m ON td.medicine_id = m.id 
            WHERE td.transaction_id = ?
        `, [id]);

        return { ...trx[0], items: details };
    }
};

module.exports = Transaction;