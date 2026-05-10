require('dotenv').config();
const db = require('./config/db');
const { consumeFromQueue } = require('./config/broker');

console.log('Message Worker Apotek is starting...');

consumeFromQueue(async (data, ack) => {
    const { transactionId, items, customer_name } = data;

    try {
        for (const item of items) {
            const sql = 'UPDATE medicines SET stock = stock - ? WHERE id = ?';
            await db.execute(sql, [item.quantity, item.medicine_id]);
        }

        const totalHarga = items.reduce((acc, item) => acc + (item.quantity * parseFloat(item.price)), 0);
        const itemsSummary = items.map(item => `${item.quantity} ${item.medicine_name}`).join(', ');

        console.log(`Notification: User ${customer_name} purchased ${itemsSummary}. Order #${transactionId}, Total: ${totalHarga}`);
        
        ack();

    } catch (error) {
        console.error(`Gagal update stok untuk transaksi #${transactionId}:`, error);
    }
});