require('dotenv').config();
const db = require('./config/db');
const { consumeFromQueue } = require('./config/broker');

console.log('Message Worker Apotek is starting...');

consumeFromQueue(async (data, ack) => {
    const { transactionId, items } = data;
    console.log(`Menerima transaksi #${transactionId}`);

    try {
        for (const item of items) {
            console.log(`   - Mengurangi stok ID ${item.medicine_id} sebanyak ${item.quantity}`);

            const sql = 'UPDATE medicines SET stock = stock - ? WHERE id = ?';
            await db.execute(sql, [item.quantity, item.medicine_id]);
        }

        console.log(`Stok untuk transaksi #${transactionId} berhasil diupdate`);
        
        ack();

    } catch (error) {
        console.error(`Gagal update stok untuk transaksi #${transactionId}:`, error);
    }
});