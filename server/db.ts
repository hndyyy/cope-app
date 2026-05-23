import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

// ===== CONNECTION POOL =====

let _pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!_pool) {
    _pool = mysql.createPool({
      host:     process.env.DB_HOST     || 'localhost',
      port:     Number(process.env.DB_PORT) || 3306,
      user:     process.env.DB_USER     || 'cope_user',
      password: process.env.DB_PASSWORD || 'cope_password',
      database: process.env.DB_NAME     || 'cope',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return _pool;
}

// ===== INIT SCHEMA + SEED =====

export async function initDb(): Promise<void> {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role ENUM('student','counselor','prof') NOT NULL,
      detail TEXT,
      faculty TEXT,
      nim TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS mood_checkins (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      mood INT NOT NULL,
      stress INT NOT NULL,
      sleep_quality INT NOT NULL,
      mood_label TEXT,
      stress_label TEXT,
      sleep_label TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS phq9_submissions (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      answers TEXT NOT NULL,
      score INT NOT NULL,
      category TEXT NOT NULL,
      risk_flag TINYINT(1) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS journals (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS counseling_bookings (
      id VARCHAR(36) PRIMARY KEY,
      student_id VARCHAR(36) NOT NULL,
      counselor_name VARCHAR(255) NOT NULL,
      schedule_time VARCHAR(255) NOT NULL,
      status VARCHAR(100) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS soap_notes (
      id VARCHAR(36) PRIMARY KEY,
      counselor_id VARCHAR(36) NOT NULL,
      student_id VARCHAR(36) NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (counselor_id) REFERENCES users(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS triage_status (
      id VARCHAR(36) PRIMARY KEY,
      student_id VARCHAR(36) NOT NULL UNIQUE,
      counselor_id VARCHAR(36),
      status VARCHAR(100) NOT NULL DEFAULT 'Baru / Menunggu Triase',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS inputs (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      route TEXT NOT NULL,
      payload TEXT,
      response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await seedUsers(pool);
}

async function seedUsers(pool: mysql.Pool): Promise<void> {
  const [rows] = await pool.query<mysql.RowDataPacket[]>('SELECT COUNT(*) as cnt FROM users');
  if ((rows[0] as any).cnt > 0) return;

  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  const ins = 'INSERT INTO users (id, username, password_hash, name, role, detail, faculty, nim) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  await pool.query(ins, ['user-student-1',   'rizky',         hash('student123'),  'Rizky Aditya Pratama',    'student',   'NIM: 215150400111 | Smt 5', 'Teknik Informatika', '215150400111']);
  await pool.query(ins, ['user-student-2',   'dewi',          hash('student123'),  'Dewi Rahayu Santoso',     'student',   'NIM: 215150400222 | Smt 3', 'FEB',                '215150400222']);
  await pool.query(ins, ['user-student-3',   'ahmad',         hash('student123'),  'Ahmad Farid Hidayat',     'student',   'NIM: 215150400333 | Smt 7', 'Teknik Informatika', '215150400333']);
  await pool.query(ins, ['user-student-4',   'budi',          hash('student123'),  'Budi Santoso',            'student',   'NIM: 215150400444 | Smt 1', 'FH',                 '215150400444']);
  await pool.query(ins, ['user-student-5',   'siti',          hash('student123'),  'Siti Nurhaliza',          'student',   'NIM: 215150400555 | Smt 3', 'FK',                 '215150400555']);
  await pool.query(ins, ['user-student-6',   'eko',           hash('student123'),  'Eko Prasetyo',            'student',   'NIM: 215150400666 | Smt 5', 'FIA',                '215150400666']);
  await pool.query(ins, ['user-student-7',   'rina',          hash('student123'),  'Rina Marlina',            'student',   'NIM: 215150400777 | Smt 7', 'Teknik Informatika', '215150400777']);
  await pool.query(ins, ['user-student-8',   'dimas',         hash('student123'),  'Dimas Arifin',            'student',   'NIM: 215150400888 | Smt 1', 'FEB',                '215150400888']);
  await pool.query(ins, ['user-student-9',   'laila',         hash('student123'),  'Laila Fitriani',          'student',   'NIM: 215150400999 | Smt 3', 'FH',                 '215150400999']);
  await pool.query(ins, ['user-student-10',  'joko',          hash('student123'),  'Joko Anwar',              'student',   'NIM: 215150401000 | Smt 5', 'FK',                 '215150401000']);
  await pool.query(ins, ['user-student-11',  'maya',          hash('student123'),  'Maya Sari',               'student',   'NIM: 215150401111 | Smt 7', 'FIA',                '215150401111']);
  await pool.query(ins, ['user-student-12',  'agung',         hash('student123'),  'Agung Hapsah',            'student',   'NIM: 215150401222 | Smt 1', 'Teknik Informatika', '215150401222']);
  
  await pool.query(ins, ['user-counselor-1', 'dr.sari',       hash('konselor123'), 'Dr. Sari Kusumawati',     'counselor', 'Subdirektorat Konseling UB','Konseling UB',       null]);
  await pool.query(ins, ['user-counselor-2', 'ahmad.dahlan',  hash('konselor123'), 'Ahmad Dahlan, M.Psi',     'counselor', 'Konselor Klinis UB',        'Konseling UB',       null]);
  await pool.query(ins, ['user-counselor-3', 'dina.ramadhani',hash('konselor123'), 'Dina Ramadhani, S.Psi',   'counselor', 'Konselor Sebaya UB',        'Konseling UB',       null]);
  await pool.query(ins, ['user-prof-1',      'prof.hendra',   hash('prof123'),     'Prof. Dr. Hendra Wijaya', 'prof',      'Direktur Kemahasiswaan UB', 'Dashboard Pimpinan', null]);
  await pool.query(ins, ['user-prof-2',      'prof.bambang',  hash('prof123'),     'Prof. Dr. Bambang S',     'prof',      'Dekan FILKOM',              'Dashboard Pimpinan', null]);

  const insPhq = 'INSERT INTO phq9_submissions (id, user_id, answers, score, category, risk_flag, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';
  await pool.query(insPhq, ['phq-s1-1','user-student-1',JSON.stringify([0,1,1,1,0,1,0,0,0]),  4, 'Normal',          0,'2023-08-11 10:00:00']);
  await pool.query(insPhq, ['phq-s1-2','user-student-1',JSON.stringify([1,1,1,1,1,0,1,0,0]),  7, 'Depresi Ringan',  0,'2023-08-25 10:00:00']);
  await pool.query(insPhq, ['phq-s1-3','user-student-1',JSON.stringify([1,2,1,1,1,1,1,0,0]),  9, 'Depresi Ringan',  0,'2023-09-08 10:00:00']);
  await pool.query(insPhq, ['phq-s1-4','user-student-1',JSON.stringify([1,1,2,1,1,1,1,0,0]),  8, 'Depresi Ringan',  0,'2023-09-22 10:00:00']);
  await pool.query(insPhq, ['phq-s1-5','user-student-1',JSON.stringify([2,2,1,2,1,1,1,0,0]), 10, 'Depresi Moderat', 0,'2023-10-06 10:00:00']);
  await pool.query(insPhq, ['phq-s1-6','user-student-1',JSON.stringify([2,2,1,2,1,2,1,0,0]), 11, 'Depresi Moderat', 0,'2023-10-20 10:00:00']);
  await pool.query(insPhq, ['phq-s2-1','user-student-2',JSON.stringify([3,3,3,2,3,2,2,2,0]), 20, 'Depresi Berat',   1,'2023-10-21 10:00:00']);
  await pool.query(insPhq, ['phq-s3-1','user-student-3',JSON.stringify([3,3,3,3,3,3,3,3,0]), 24, 'Depresi Berat',   1,'2023-10-22 10:00:00']);
  await pool.query(insPhq, ['phq-s4-1','user-student-4',JSON.stringify([0,0,1,1,0,0,0,0,0]),  2, 'Normal',          0,'2023-10-23 10:00:00']);

  const insJournal = 'INSERT INTO journals (id, user_id, content, created_at) VALUES (?, ?, ?, ?)';
  await pool.query(insJournal, ['j-1', 'user-student-1', 'Hari ini merasa cukup tenang walau tugas menumpuk. Sempat jalan-jalan sebentar sore tadi.', '2023-10-23 18:30:00']);
  await pool.query(insJournal, ['j-2', 'user-student-1', 'Jurnal hari ini: Agak cemas karena besok ada presentasi, tapi sudah kusiapkan sebaik mungkin.', '2023-10-24 20:15:00']);
  await pool.query(insJournal, ['j-3', 'user-student-2', 'Masih merasa sangat lelah. Semalaman nggak bisa tidur dengan nyenyak. Harus coba kurangi kafein.', '2023-10-22 09:00:00']);
  await pool.query(insJournal, ['j-4', 'user-student-2', 'Hari ini rasanya kelam sekali, nggak ada semangat untuk ke kampus. Mau nangis rasanya.', '2023-10-23 11:45:00']);
  await pool.query(insJournal, ['j-5', 'user-student-3', 'Sangat berat. Ingin menyerah tapi teringat keluarga di rumah. Kapan ini berakhir?', '2023-10-22 22:10:00']);
}

// ===== PUBLIC HELPERS (all async) =====

export async function getUserByUsername(username: string): Promise<any> {
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(
    'SELECT * FROM users WHERE username = ?', [username]
  );
  return (rows as any[])[0] ?? null;
}

export async function getUserById(id: string): Promise<any> {
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(
    'SELECT id, username, name, role, detail, faculty, nim FROM users WHERE id = ?', [id]
  );
  return (rows as any[])[0] ?? null;
}

export async function addMoodCheckin(data: {
  id: string; userId: string; mood: number; stress: number; sleep: number;
  moodLabel: string; stressLabel: string; sleepLabel: string;
}): Promise<void> {
  await getPool().query(
    'INSERT INTO mood_checkins (id, user_id, mood, stress, sleep_quality, mood_label, stress_label, sleep_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [data.id, data.userId, data.mood, data.stress, data.sleep, data.moodLabel, data.stressLabel, data.sleepLabel]
  );
}

export async function addPhq9Submission(data: {
  id: string; userId: string; answers: number[]; score: number; category: string; riskFlag: boolean;
}): Promise<void> {
  await getPool().query(
    'INSERT INTO phq9_submissions (id, user_id, answers, score, category, risk_flag) VALUES (?, ?, ?, ?, ?, ?)',
    [data.id, data.userId, JSON.stringify(data.answers), data.score, data.category, data.riskFlag ? 1 : 0]
  );
}

export async function addJournal(data: { id: string; userId: string; content: string }): Promise<void> {
  await getPool().query(
    'INSERT INTO journals (id, user_id, content) VALUES (?, ?, ?)',
    [data.id, data.userId, data.content]
  );
}

export async function addBooking(data: {
  id: string; studentId: string; counselorName: string; scheduleTime: string;
}): Promise<void> {
  await getPool().query(
    'INSERT INTO counseling_bookings (id, student_id, counselor_name, schedule_time) VALUES (?, ?, ?, ?)',
    [data.id, data.studentId, data.counselorName, data.scheduleTime]
  );
}

export async function saveSoapNote(data: {
  counselorId: string; studentId: string; content: string;
}): Promise<void> {
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(
    'SELECT id FROM soap_notes WHERE counselor_id = ? AND student_id = ?',
    [data.counselorId, data.studentId]
  );
  if ((rows as any[]).length > 0) {
    await getPool().query(
      'UPDATE soap_notes SET content = ? WHERE counselor_id = ? AND student_id = ?',
      [data.content, data.counselorId, data.studentId]
    );
  } else {
    await getPool().query(
      'INSERT INTO soap_notes (id, counselor_id, student_id, content) VALUES (?, ?, ?, ?)',
      [nanoid(), data.counselorId, data.studentId, data.content]
    );
  }
}

export async function getSoapNote(studentId: string, counselorId: string): Promise<string> {
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(
    'SELECT content FROM soap_notes WHERE student_id = ? AND counselor_id = ?',
    [studentId, counselorId]
  );
  return (rows as any[])[0]?.content || '';
}

export async function updateTriageStatus(data: {
  studentId: string; counselorId: string; status: string;
}): Promise<void> {
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(
    'SELECT id FROM triage_status WHERE student_id = ?',
    [data.studentId]
  );
  if ((rows as any[]).length > 0) {
    await getPool().query(
      'UPDATE triage_status SET status = ?, counselor_id = ? WHERE student_id = ?',
      [data.status, data.counselorId, data.studentId]
    );
  } else {
    await getPool().query(
      'INSERT INTO triage_status (id, student_id, counselor_id, status) VALUES (?, ?, ?, ?)',
      [nanoid(), data.studentId, data.counselorId, data.status]
    );
  }
}

export async function getPhq9History(userId: string): Promise<any[]> {
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(
    'SELECT * FROM phq9_submissions WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows as any[];
}

export async function addInput(data: {
  id: string; userId?: string; route: string; payload: any; response: any; createdAt: string;
}): Promise<void> {
  await getPool().query(
    'INSERT INTO inputs (id, user_id, route, payload, response, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [data.id, data.userId ?? null, data.route, JSON.stringify(data.payload), JSON.stringify(data.response), data.createdAt]
  );
}

export async function getJournalsByUserId(userId: string): Promise<any[]> {
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(
    'SELECT * FROM journals WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows as any[];
}

export async function getStudentsForTriage(): Promise<any[]> {
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(`
    SELECT 
      u.id, u.name as nama, u.faculty as fak, 
      p.score, p.category as rank_text, p.created_at as phq_date,
      t.status as triage_status,
      CASE 
        WHEN p.score >= 15 THEN 'Krisis'
        WHEN p.score >= 10 THEN 'Tinggi'
        WHEN p.score >= 5 THEN 'Sedang'
        ELSE 'Rendah'
      END as \`rank\`
    FROM users u
    LEFT JOIN (
      SELECT user_id, MAX(created_at) as max_date 
      FROM phq9_submissions GROUP BY user_id
    ) latest_phq ON u.id = latest_phq.user_id
    LEFT JOIN phq9_submissions p ON latest_phq.user_id = p.user_id AND latest_phq.max_date = p.created_at
    LEFT JOIN triage_status t ON u.id = t.student_id
    WHERE u.role = 'student'
    ORDER BY p.score DESC, u.created_at DESC
  `);
  return rows as any[];
}

export async function getCounselors(): Promise<any[]> {
  const [rows] = await getPool().query<mysql.RowDataPacket[]>(
    'SELECT id, name, detail, faculty FROM users WHERE role = "counselor" ORDER BY name ASC'
  );
  return rows as any[];
}
