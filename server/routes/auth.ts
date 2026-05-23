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
 * GET /api/auth/demo-accounts
 * Returns list of demo accounts for the login page (no passwords)
 */
router.get('/demo-accounts', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    accounts: [
      {
        username: 'rizky',
        password: 'student123',
        name: 'Rizky Aditya Pratama',
        role: 'student',
        detail: 'NIM: 215150400111 | Smt 5',
        faculty: 'Teknik Informatika',
        emoji: '🎓',
        color: '#2E75B6',
      },
      {
        username: 'dr.sari',
        password: 'konselor123',
        name: 'Dr. Sari Kusumawati',
        role: 'counselor',
        detail: 'Subdirektorat Konseling UB',
        faculty: 'Konselor',
        emoji: '👨‍⚕️',
        color: '#0F6E56',
      },
      {
        username: 'prof.hendra',
        password: 'prof123',
        name: 'Prof. Dr. Hendra Wijaya',
        role: 'prof',
        detail: 'Direktur Kemahasiswaan UB',
        faculty: 'Pimpinan',
        emoji: '📊',
        color: '#BA7517',
      }
    ]
  });
});

export default router;
