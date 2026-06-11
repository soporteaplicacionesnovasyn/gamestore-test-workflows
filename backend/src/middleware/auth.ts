import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'hardcoded-secret-key-12345';

export interface AuthRequest extends Request {
  userId?: number;
  userRole?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const generateToken = (userId: number, role: string) => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || '24h') as string;
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn } as jwt.SignOptions);
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: number };
};

export { JWT_SECRET };