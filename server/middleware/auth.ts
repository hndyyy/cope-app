import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cope-secret-2024';

export interface JwtPayload {
  userId: string;
  username: string;
  role: 'student' | 'counselor' | 'prof';
  name: string;
}

export interface RequestWithUser extends Request {
  user?: JwtPayload;
}

/**
 * Middleware: verify Bearer JWT token.
 * Attaches decoded payload to req.user.
 * Returns 401 if token is missing or invalid.
 */
export function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token tidak ditemukan' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Token tidak valid atau sudah kadaluarsa' });
  }
}

/**
 * Middleware factory: restrict access to specific roles.
 */
export function requireRole(...roles: Array<'student' | 'counselor' | 'prof'>) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Tidak terautentikasi' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Akses ditolak untuk role ini' });
    }
    next();
  };
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
