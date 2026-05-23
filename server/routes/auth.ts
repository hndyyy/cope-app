import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getUserByUsername, getUserById } from '../db.js';
import { authMiddleware, signToken, RequestWithUser } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Returns: { success, token, user }
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as { username: string; password: string };

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username dan password wajib diisi' });
    }

    const user = await getUserByUsername(username.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, error: 'Username atau password salah' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Username atau password salah' });
    }

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        detail: user.detail,
        faculty: user.faculty,
        nim: user.nim,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Terjadi kesalahan server' });
  }
});

/**
 * GET /api/auth/me
 * Returns current user info from JWT
 */
router.get('/me', authMiddleware, async (req: RequestWithUser, res: Response) => {
  const user = await getUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
  }
  return res.json({ success: true, user });
});

/**
 * POST /api/auth/register
 * Body: { username, password, name, role, detail, faculty, nim }
 * Returns: { success, token, user }
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, name, role, detail, faculty, nim } = req.body;
    
    if (!username || !password || !name || !role) {
      return res.status(400).json({ success: false, error: 'Username, password, nama, dan role wajib diisi' });
    }
    
    // Check if username exists
    const existingUser = await getUserByUsername(username.trim().toLowerCase());
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Username sudah digunakan' });
    }
    
    const { getPool } = await import('../db.js');
    const { nanoid } = await import('nanoid');
    const hash = await bcrypt.hash(password, 10);
    const userId = nanoid();
    
    const pool = getPool();
    await pool.query(
      'INSERT INTO users (id, username, password_hash, name, role, detail, faculty, nim) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, username.trim().toLowerCase(), hash, name, role, detail || null, faculty || null, nim || null]
    );
    
    const user = await getUserById(userId);
    
    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    });
    
    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        detail: user.detail,
        faculty: user.faculty,
        nim: user.nim,
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: 'Terjadi kesalahan server' });
  }
});

export default router;
