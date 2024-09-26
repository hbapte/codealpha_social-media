import { Request, Response, NextFunction } from 'express';
import { verifySession } from '../utils/sessionUtils';
import httpStatus from 'http-status';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const sessionToken = req.cookies.session; 

    if (!sessionToken) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Session token is required' });
    }

    const payload = await verifySession(sessionToken);
    
    if (!payload) {
        return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid or Expired session' });
    }
    req.user = payload; 
    next();
};

export default authMiddleware;
