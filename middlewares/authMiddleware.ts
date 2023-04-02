import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    userId: string;
}

// Middleware function that checks for a valid JWT
const jwtAuthenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Get the JWT token from the authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    // If no token is provided, return an error response
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Verify the JWT token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user ID to the request object for later use
        req.userId = decoded.userId;

        // Call the next middleware function in the chain
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ error: 'Forbidden' });
    }
};

export default jwtAuthenticate;
