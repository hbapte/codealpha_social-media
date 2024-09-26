// src/middleware/sessionMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifySession } from '../utils/sessionUtils';

const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

    const payload = await verifySession(token);

    if (!payload) {
        return res.status(401).json({ message: 'Session expired or invalid' });
    }

    // Attach userId and other relevant data to the request object
    req.user = {
        id: payload.userId,
        names: payload.names,
        role: payload.role,
    };

    next();
};

export default sessionMiddleware;
