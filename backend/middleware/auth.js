const jwt = require('jsonwebtoken');
const JWT_SECRET = 'TU_SECRETO_SEGURO';

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
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

exports.verifyAdminOrJefe = (req, res, next) => {
    const role = req.user.role;
    
    if (role === 'administrador' || role === 'jefe') {
        next();
    } else {
        return res.status(403).json({ message: 'Permiso denegado. Rol insuficiente.' });
    }
};