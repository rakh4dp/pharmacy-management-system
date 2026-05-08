    const jwt = require('jsonwebtoken');

    const authMiddleware = (roles = []) => {
        return (req, res, next) => {
            const authHeader = req.headers['authorization'];
            
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ 
                    message: "Akses ditolak! Anda harus login terlebih dahulu." 
                });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                req.user = decoded;

                if (roles.length > 0 && !roles.includes(req.user.role)) {
                    return res.status(403).json({ 
                        message: "Akses dilarang! Role Anda tidak memiliki izin untuk fitur ini." 
                    });
                }
                next();
            } catch (error) {
                return res.status(403).json({ 
                    message: "Token tidak valid atau sudah kadaluarsa!" 
                });
            }
        };
    };

    module.exports = authMiddleware;