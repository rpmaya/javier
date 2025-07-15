const jwt = require('jsonwebtoken');
const { handleHttpError } = require('../utils/handleError');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return handleHttpError(res, "TOKEN_NOT_PROVIDED", 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Agregar información del usuario al objeto req
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            isMerchant: decoded.isMerchant
        };
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return handleHttpError(res, "INVALID_TOKEN", 401);
        }
        if (error.name === 'TokenExpiredError') {
            return handleHttpError(res, "TOKEN_EXPIRED", 401);
        }
        return handleHttpError(res, "ERROR_AUTHENTICATION", 401);
    }
};

module.exports = authMiddleware; 