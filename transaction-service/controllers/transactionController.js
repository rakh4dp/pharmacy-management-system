const Transaction = require('../models/transactionModel');
const db = require('../config/db');
const { sendToQueue } = require('../config/broker');

const transactionController = {
    create: async (req, res) => {
        try {
            const { customer_name, items } = req.body; 
            const userId = req.user.id; 

            if (!customer_name || !items || items.length === 0) {
                return res.status(400).json({ message: "Data tidak lengkap. Nama pelanggan dan item wajib diisi." });
            }

            let totalPrice = 0;
            const processedItems = [];

            for (const item of items) {
                const [medicine] = await db.execute(
                    'SELECT name, price FROM medicines WHERE id = ?', 
                     [item.medicine_id]
                );

                if (medicine.length === 0) {
                    return res.status(404).json({ message: `Obat dengan ID ${item.medicine_id} tidak ditemukan!` });
                }

                const priceFromDb = medicine[0].price;
                const subtotal = priceFromDb * item.quantity;
                totalPrice += subtotal;

                processedItems.push({
                    medicine_id: item.medicine_id,
                    medicine_name: medicine[0].name, 
                    quantity: item.quantity,
                    price: priceFromDb,
                    subtotal: subtotal
                });
            }
            const transactionId = await Transaction.create(userId, customer_name, totalPrice, processedItems);

            sendToQueue({
                transactionId,
                customer_name,
                items: processedItems
            });

            res.status(201).json({
                message: "Transaksi berhasil diproses!",
                transaction_id: transactionId,
                customer_name: customer_name,
                items: processedItems, 
                total_bayar: totalPrice 
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Gagal memproses transaksi." });
        }
    },

    getHistory: async (req, res) => {
        try {
            const data = await Transaction.findAll();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: "Gagal mengambil riwayat." });
        }
    },

    getDetail: async (req, res) => {
        try {
            const data = await Transaction.findById(req.params.id);
            if (!data) return res.status(404).json({ message: "Transaksi tidak ditemukan" });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: "Gagal mengambil detail." });
        }
    }
};

module.exports = transactionController;