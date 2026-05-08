const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Akses ditolak, token tidak ditemukan!" });
        }

        try {
            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = decoded;

            // Cek Otorisasi (Role)
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: "Anda tidak memiliki akses (Forbidden)!" });
            }

            next(); 
        } catch (error) {
            return res.status(403).json({ message: "Token tidak valid atau sudah kadaluarsa!" });
        }
    };
};

module.exports = authMiddleware;