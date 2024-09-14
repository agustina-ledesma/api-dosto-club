import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../index.js';

export function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
}
