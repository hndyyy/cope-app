import { Router, Response } from 'express';
import { nanoid } from 'nanoid';
import {
  addMoodCheckin,
  addPhq9Submission,
  addJournal,
  addBooking,
  saveSoapNote,
  updateTriageStatus,
  getPhq9History,
} from '../db.js';
import { authMiddleware, requireRole, RequestWithUser } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// ====== STUDENT ROUTES ======

/**
 * POST /api/data/mood
 * Save mood check-in (student only)
 */
router.post('/mood', requireRole('student'), async (req: RequestWithUser, res: Response) => {
  try {
    const { mood, stress, sleep, moodLabel, stressLabel, sleepLabel } = req.body;
    if (mood === undefined || stress === undefined || sleep === undefined) {
      return res.status(400).json({ success: false, error: 'Data mood tidak lengkap' });
    }
    await addMoodCheckin({
      id: nanoid(),
      userId: req.user!.userId,
      mood: Number(mood),
      stress: Number(stress),
      sleep: Number(sleep),
      moodLabel: moodLabel || '',
      stressLabel: stressLabel || '',
      sleepLabel: sleepLabel || '',
    });
    return res.json({ success: true, message: 'Check-in berhasil disimpan' });
  } catch (err) {
    console.error('Mood checkin error:', err);
    return res.status(500).json({ success: false, error: 'Gagal menyimpan check-in' });
  }
});

/**
 * POST /api/data/phq9
 * Save PHQ-9 submission (student only)
 */
router.post('/phq9', requireRole('student'), async (req: RequestWithUser, res: Response) => {
  try {
    const { answers, score, category, riskFlag } = req.body;
    if (!answers || score === undefined || !category) {
      return res.status(400).json({ success: false, error: 'Data PHQ-9 tidak lengkap' });
    }
    await addPhq9Submission({
      id: nanoid(),
      userId: req.user!.userId,
      answers: answers as number[],
      score: Number(score),
      category,
      riskFlag: Boolean(riskFlag),
    });
    return res.json({ success: true, message: 'Hasil skrining berhasil disimpan' });
  } catch (err) {
    console.error('PHQ-9 submit error:', err);
    return res.status(500).json({ success: false, error: 'Gagal menyimpan hasil skrining' });
  }
});

/**
 * POST /api/data/journal
 * Save daily journal entry (student only)
 */
router.post('/journal', requireRole('student'), async (req: RequestWithUser, res: Response) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Isi jurnal tidak boleh kosong' });
    }
    await addJournal({
      id: nanoid(),
      userId: req.user!.userId,
      content: content.trim(),
    });
    return res.json({ success: true, message: 'Jurnal berhasil disimpan' });
  } catch (err) {
    console.error('Journal error:', err);
    return res.status(500).json({ success: false, error: 'Gagal menyimpan jurnal' });
  }
});

/**
 * POST /api/data/booking
 * Book a counseling session (student only)
 */
router.post('/booking', requireRole('student'), async (req: RequestWithUser, res: Response) => {
  try {
    const { counselorName, scheduleTime } = req.body;
    if (!counselorName || !scheduleTime) {
      return res.status(400).json({ success: false, error: 'Data booking tidak lengkap' });
    }
    await addBooking({
      id: nanoid(),
      studentId: req.user!.userId,
      counselorName,
      scheduleTime,
    });
    return res.json({ success: true, message: 'Booking konseling berhasil disimpan' });
  } catch (err) {
    console.error('Booking error:', err);
    return res.status(500).json({ success: false, error: 'Gagal menyimpan booking' });
  }
});

/**
 * GET /api/data/history
 * Get PHQ-9 history for the logged-in student
 */
router.get('/history', requireRole('student'), async (req: RequestWithUser, res: Response) => {
  try {
    const rows = await getPhq9History(req.user!.userId);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error('History error:', err);
    return res.status(500).json({ success: false, error: 'Gagal mengambil riwayat' });
  }
});

// ====== COUNSELOR ROUTES ======

/**
 * POST /api/data/soap
 * Save or update SOAP notes for a student (counselor only)
 */
router.post('/soap', requireRole('counselor'), async (req: RequestWithUser, res: Response) => {
  try {
    const { studentId, content } = req.body;
    if (!studentId || !content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Data SOAP tidak lengkap' });
    }
    await saveSoapNote({
      counselorId: req.user!.userId,
      studentId,
      content: content.trim(),
    });
    return res.json({ success: true, message: 'Catatan SOAP berhasil disimpan' });
  } catch (err) {
    console.error('SOAP error:', err);
    return res.status(500).json({ success: false, error: 'Gagal menyimpan catatan SOAP' });
  }
});

/**
 * PATCH /api/data/triage/:studentId
 * Update triage status of a student (counselor only)
 */
router.patch('/triage/:studentId', requireRole('counselor'), async (req: RequestWithUser, res: Response) => {
  try {
    const { studentId } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status triase wajib diisi' });
    }
    await updateTriageStatus({
      studentId,
      counselorId: req.user!.userId,
      status,
    });
    return res.json({ success: true, message: 'Status triase berhasil diperbarui' });
  } catch (err) {
    console.error('Triage update error:', err);
    return res.status(500).json({ success: false, error: 'Gagal memperbarui status triase' });
  }
});

export default router;
