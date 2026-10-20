import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Acceso no autorizado. Token no proporcionado.' });
        return;
    }
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'yachay_lee_super_secret_jwt_key_2026_educacion_peru';
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).json({ error: 'Token inválido o expirado. Por favor inicia sesión nuevamente.' });
    }
};
export const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'No autenticado.' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}.`
            });
            return;
        }
        next();
    };
};
