const Category = require('../models/categoryModel');

const categoryController = {
    create: async (req, res) => {
        try {
            const { name } = req.body;

            if (!name || name.trim() === "") {
                return res.status(400).json({ message: "Nama kategori wajib diisi!" });
            }

            const existing = await Category.findByName(name.trim());
            if (existing) {
                return res.status(409).json({ message: "Kategori dengan nama tersebut sudah ada!" });
            }

            const categoryId = await Category.create(name.trim());
            res.status(201).json({ message: "Kategori berhasil ditambahkan!", id: categoryId });
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body; 

            const category = await Category.findById(id);
            if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan!" });

            const duplicate = await Category.findByName(name);
            if (duplicate && duplicate.id != id) {
                return res.status(409).json({ message: "Nama kategori sudah digunakan oleh ID lain!" });
            }

            await Category.update(id, name);
            res.status(200).json({ message: "Kategori diperbarui!" });
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const category = await Category.findById(id);
            if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan!" });

            const inUse = await Category.isUsed(id);
            if (inUse) {
                return res.status(400).json({ 
                    message: "Gagal menghapus, Masih ada obat yang terdaftar di kategori ini. Hapus atau pindahkan obatnya dulu." 
                });
            }

            await Category.delete(id);
            res.status(200).json({ message: "Kategori berhasil dihapus!" });
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    },

    getAll: async (req, res) => {
        try {
            const data = await Category.findAll();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: "Server Error" });
        }
    }
};

module.exports = categoryController;