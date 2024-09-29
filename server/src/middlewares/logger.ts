import { Request, Response, NextFunction } from 'express';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    const timestamp = new Date().toISOString();
    
    // Capture the start time
    const start = process.hrtime();

    // Log the request details
    console.log(`[${timestamp}] ${method} ${url} - Request received`);

    // Hook into the response finish event to log the response details
    res.on('finish', () => {
        const { statusCode } = res;
        const diff = process.hrtime(start);
        const responseTime = diff[0] * 1e3 + diff[1] * 1e-6; // Convert to milliseconds
        const endTimestamp = new Date().toISOString();

        console.log(`[${endTimestamp}] ${method} ${url} - Response sent with status ${statusCode} in ${responseTime.toFixed(3)}ms`);
    });

    next();
};

export default loggerMiddleware;