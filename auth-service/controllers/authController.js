const User = require('../models/userModel'); // Panggil Model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    // REGISTRASI
    register: async (req, res) => {
        try {
            const { username, password, role } = req.body;

            if (!username || !password || !role) {
                return res.status(400).json({ message: "Semua field wajib diisi!" });
            }

            if (username.length < 5) {
                return res.status(400).json({ message: "Username minimal 5 karakter!" });
            }

            if (!['admin', 'kasir'].includes(role)) {
                return res.status(400).json({ message: "Role harus 'admin' atau 'kasir'!" });
            }

            const existingUser = await User.findByUsername(username);
            if (existingUser) {
                return res.status(409).json({ message: "Username sudah digunakan!" });
            }

            // Hashing Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.create(username, hashedPassword, role);

            return res.status(201).json({ message: "User berhasil didaftarkan!" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
        }
    },

    // LOGIN 
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: "Username dan password wajib diisi!" });
            }

            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(401).json({ message: "Username atau password salah!" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Username atau password salah!" });
            }

            // Generate JWT 
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' } 
            );

            return res.status(200).json({
                message: "Login Berhasil!",
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
        }
    }
};

module.exports = authController;