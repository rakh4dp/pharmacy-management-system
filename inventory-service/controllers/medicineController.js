const Medicine = require('../models/medicineModel');
const Category = require('../models/categoryModel');

const medicineController = {
    create: async (req, res) => {
        try {
            const { category_id, name, price, stock } = req.body;
            
            if (!category_id || !name || price === undefined || stock === undefined) {
                return res.status(400).json({ message: "Data obat tidak lengkap!" });
            }

            const existingMedicine = await Medicine.findByName(name.trim());
            if (existingMedicine) {
                return res.status(409).json({ 
                    message: `Obat dengan nama '${name}' sudah ada` 
                });
            }

            const categoryExists = await Category.findById(category_id);
            if (!categoryExists) return res.status(400).json({ message: "Kategori tidak ditemukan!" });

            await Medicine.create({ category_id, name: name.trim(), price, stock });
            res.status(201).json({ message: "Obat berhasil ditambahkan" });
        } catch (error) {
            res.status(500).json({ message: "Gagal menambahkan obat" });
        }
    },

    getAll: async (req, res) => {
        try {
            const medicines = await Medicine.findAll();
            res.status(200).json(medicines);
        } catch (error) {
            res.status(500).json({ message: "Gagal mengambil data obat." });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, stock, category_id } = req.body;

            const existing = await Medicine.findById(id);
            if (!existing) {
                return res.status(404).json({ message: "Obat tidak ditemukan!" });
            }

            await Medicine.update(id, { name, price, stock, category_id });

            const updatedMedicine = await Medicine.findById(id);
            res.status(200).json({ 
                message: "Data obat berhasil diperbarui!",
                data: updatedMedicine
            });
        } catch (error) {
            res.status(500).json({ message: "Gagal memperbarui obat." });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            await Medicine.delete(id);
            res.status(200).json({ message: "Obat berhasil dihapus!" });
        } catch (error) {
            res.status(500).json({ message: "Gagal menghapus obat." });
        }
    },

    patch: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;

            const existing = await Medicine.findById(id);
            if (!existing) {
                return res.status(404).json({ message: "Obat tidak ditemukan!" });
            }

            const allowedFields = ['name', 'price', 'stock', 'category_id'];
            const fieldsToUpdate = {};
            
            Object.keys(data).forEach(key => {
                if (allowedFields.includes(key)) {
                    fieldsToUpdate[key] = data[key];
                }
            });

            if (Object.keys(fieldsToUpdate).length === 0) {
                return res.status(400).json({ message: "Tidak ada field valid yang dikirim untuk diupdate!" });
            }

            if (fieldsToUpdate.category_id) {
                const categoryExists = await Category.findById(fieldsToUpdate.category_id);
                if (!categoryExists) {
                    return res.status(400).json({ message: "Kategori baru tidak ditemukan!" });
                }
            }

            if (fieldsToUpdate.price < 0 || fieldsToUpdate.stock < 0) {
                return res.status(400).json({ message: "Harga atau Stok tidak boleh negatif!" });
            }

            await Medicine.patch(id, fieldsToUpdate);

            const updatedMedicine = await Medicine.findById(id);

            const changes = {};
            Object.keys(fieldsToUpdate).forEach(key => {
                changes[key] = {
                    before: existing[key],
                    after: updatedMedicine[key]
                };
            });
            
            res.status(200).json({ 
                message: "Data obat berhasil diperbarui sebagian!",
                updatedFields: Object.keys(fieldsToUpdate),
                changes: changes
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Gagal memperbarui data obat." });
        }
    }
};

module.exports = medicineController;