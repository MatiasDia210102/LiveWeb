const jwt = require('jsonwebtoken');

require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_SECRET || 'TU_SECRETO_SEGURO_LOCAL';

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        console.error("Error al verificar token:", err.message);
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

exports.verifyAdminOrJefe = (req, res, next) => {
    if (!req.user || !req.user.role) {
         return res.status(403).json({ message: 'Permiso denegado. Usuario no autenticado.' });
    }
    
    const role = req.user.role;
    
    if (role === 'administrador' || role === 'jefe') {
        next();
    } else {
        return res.status(403).json({ message: 'Permiso denegado. Rol insuficiente.' });
    }
};