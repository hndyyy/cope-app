# Sistem Manajemen Konseling & Deteksi Risiko AI

Platform manajemen konseling yang mengintegrasikan artificial intelligence untuk deteksi dan penilaian risiko mahasiswa secara real-time. Sistem ini dirancang untuk mendukung konselor dalam memberikan layanan konseling yang lebih efektif dan responsif.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Alur Data](#alur-data)
- [Stack Teknologi](#stack-teknologi)
- [Prasyarat Sistem](#prasyarat-sistem)
- [Instalasi & Setup](#instalasi--setup)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Direktori](#struktur-direktori)
- [Konfigurasi](#konfigurasi)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Deployment Docker](#deployment-docker)
- [Workflow Pengembangan](#workflow-pengembangan)

## 🎯 Fitur Utama

### Untuk Mahasiswa
- **Check-in Digital**: Pelaporan status kesejahteraan secara mandiri
- **Screening Otomatis**: Analisis psikologis menggunakan AI (PHQ-9, GAD-7, SRQ-20)
- **Notifikasi Real-time**: Pemberitahuan status dan rekomendasi konseling
- **Dashboard Personal**: Riwayat konseling dan progress monitoring

### Untuk Konselor
- **Dashboard Konselor**: Monitoring kasus dan workload
- **Penilaian Risiko AI**: Scoring otomatis dengan algoritma NLP
- **Sistem Antrian**: Manajemen referral dan prioritas kasus
- **Analitik**: Statistik kasus dan trend kesejahteraan mahasiswa

### Untuk Admin & Pimpinan
- **Panel Administrasi**: Manajemen user dan konfigurasi sistem
- **Analitik Lanjutan**: Dashboard analytics dengan insights mendalam
- **Audit Log**: Pencatatan semua aktivitas sistem
- **Integrasi Institusional**: Sinkronisasi dengan SIAM UB & SIAKAD

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                      Layer Pengguna                              │
│  Mahasiswa • Konselor • Admin Fakultas • Pimpinan Universitas   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│         Web Application (React + TypeScript)                    │
│  PWA - Portal Mahasiswa • Dashboard Konselor • Panel Admin      │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway                                   │
│  Auth (SSO UB) • Rate Limiting • Enkripsi TLS • Audit Log      │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                Backend Microservices                             │
│  Screening • Notification Service • Referral & Queue • Analytics│
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│              AI Risk Engine                                      │
│  Skor Risiko NLP • Deteksi Anomali • Rekomendasi Prioritas     │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│       Integration Middleware (ESB Layer)                         │
│  SIAM UB • SIAKAD • E-Counseling • REST/SOAP Bridge            │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│          Penyimpanan Data & Sistem Eksternal UB                 │
│  PostgreSQL • Redis Cache • SIAKAD UB • SIAM/SSO UB            │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Alur Data Utama

### Flow Proses Konseling

```
Check-in Mingguan
         │
         ▼
Skrining Digital
(PHQ-9 • GAD-7 • SRQ-20)
         │
         ▼
AI Risk Scoring
(Skor 0-100 + Tren Riwayat)
         │
         ▼
Klasifikasi Level Risiko
         │
    ┌─────┼─────┐
    │     │     │
    ▼     ▼     ▼
  RENDAH SEDANG KRISIS
    │     │     │
    ▼     ▼     ▼
 Self-help Booking  Eskalasi Darurat
 Konten  Konseling  (Notif Konselor
 & Tools Terjadwal  dalam 24 jam)
    │     │     │
    └─────┼─────┘
         │
         ▼
Dashboard Konselor
(Triase • Workload • Catatan Kasus)
```

### Data Flow Detail

1. **Check-in**: Mahasiswa melakukan check-in mingguan melalui PWA
2. **Screening**: Sistem mengumpulkan data psikologis via kuesioner terstandar
3. **AI Analysis**: Algoritma NLP memproses respons dan menghitung risk score
4. **Risk Classification**: Kategorisasi ke level Rendah, Sedang, atau Krisis
5. **Routing**: 
   - **Rendah**: Self-help content & tools
   - **Sedang**: Booking konseling dengan jadwal terprioritasi
   - **Krisis**: Eskalasi darurat ke konselor (notif dalam 24 jam)
6. **Monitoring**: Dashboard konselor menampilkan kasus dengan prioritas

## 🛠️ Stack Teknologi

### Frontend
- **React 19**: UI library dengan hooks dan concurrent features
- **TypeScript**: Type safety dan development experience
- **Vite**: Build tool modern dengan fast refresh
- **Tailwind CSS**: Utility-first CSS framework
- **Motion**: Animation library untuk UI interactions

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework minimalist & fleksibel
- **TypeScript**: Type-safe backend development
- **MySQL**: Database relasional utama
- **Redis**: Cache & real-time data management

### DevOps & Tools
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **ESBuild**: Fast bundler
- **tsx**: TypeScript execution runtime

### AI & Integration
- **Groq API**: AI inference untuk risk scoring (LLM-powered)
- **SIAM UB**: SSO authentication integration
- **SIAKAD UB**: Student data integration
- **REST/SOAP Bridge**: Legacy system communication

## 📋 Prasyarat Sistem

- **Node.js**: v18+ atau v20+ (gunakan `node --version` untuk cek)
- **npm**: v9+ atau yarn/pnpm equivalent
- **Docker & Docker Compose**: Untuk containerized deployment
- **MySQL**: v8+ (atau MariaDB 10.6+)
- **Redis**: v6+ (untuk caching)
- **Git**: Untuk version control

## 🚀 Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/counseling-ai-system.git
cd counseling-ai-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
# Copy template ke file lokal
cp .env.example .env.local
```

Edit `.env.local` dan isi variabel yang diperlukan:
```env
# AI Service
GROQ_API_KEY="your_groq_api_key_here"

# Application
APP_URL="http://localhost:3000"
PORT=3001

# Database
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="your_password"
DB_NAME="counseling_db"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRY="7d"

# CORS
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"

# SIAM SSO Integration
SIAM_CLIENT_ID="your_siam_client_id"
SIAM_CLIENT_SECRET="your_siam_client_secret"
SIAM_CALLBACK_URL="http://localhost:3000/auth/siam/callback"
```

### 4. Setup Database
```bash
# Create database dan schema (gunakan MySQL client atau migration tool)
mysql -u root -p < schema.sql
```

### 5. Build Aplikasi
```bash
npm run build
```

## 🏃 Menjalankan Aplikasi

### Development Mode

#### Terminal 1: Frontend
```bash
npm run dev
# Akses: http://localhost:3000
```

#### Terminal 2: Backend
```bash
npm run dev:server
# Server berjalan di: http://localhost:3001
```

### Production Mode
```bash
npm run build
npm start
```

### Testing Server
```bash
./test_server.sh
```

## 📁 Struktur Direktori

```
project-root/
├── src/                          # Frontend source
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point
│   ├── api.ts                    # API client utilities
│   ├── index.css                 # Global styles
│   └── [pages & components]/     # UI components
│
├── server/                       # Backend source
│   ├── index.ts                  # Express app & server setup
│   ├── db.ts                     # Database connection & initialization
│   ├── middleware/               # Express middleware
│   │   └── auth.ts               # JWT & SSO authentication
│   ├── routes/                   # API route handlers
│   │   ├── health.ts             # Health check endpoint
│   │   ├── auth.ts               # Authentication routes
│   │   ├── ai.ts                 # AI & risk scoring routes
│   │   └── data.ts               # Data management routes
│   └── tsconfig.json             # TypeScript config (server)
│
├── public/                       # Static assets
├── dist/                         # Build output (generated)
├── node_modules/                 # Dependencies
├── docker-compose.yml            # Docker services definition
├── Dockerfile                    # Container build config
├── package.json                  # Project dependencies & scripts
├── tsconfig.json                 # TypeScript config (frontend)
├── vite.config.ts                # Vite build configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── .env.example                  # Environment variables template
└── README.md                     # Documentation
```

## ⚙️ Konfigurasi

### Vite Configuration (`vite.config.ts`)
```typescript
- React plugin dengan JSX transformation
- Development server port: 3000
- Optimized build output
```

### TypeScript Configuration (`tsconfig.json`)
```json
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Path aliases untuk imports
```

### Express Server Configuration (`server/index.ts`)
```typescript
- CORS dengan origin whitelist
- JSON body parser (limit 10MB)
- URL-encoded parser untuk form data
- Request logging & error handling
```

## 🔌 API Endpoints

### Health Check
```
GET /api/health
Response: { status: "ok", timestamp: string }
```

### Authentication
```
POST   /api/auth/login              # Login dengan credentials
POST   /api/auth/logout             # Logout
GET    /api/auth/siam/callback      # SIAM SSO callback
POST   /api/auth/refresh            # Refresh JWT token
GET    /api/auth/profile            # Get current user profile
```

### AI & Risk Scoring
```
POST   /api/ai/screening            # Submit screening responses
POST   /api/ai/risk-score           # Calculate risk score
GET    /api/ai/risk-score/:userId   # Get user risk history
POST   /api/ai/recommendations      # Get AI recommendations
```

### Data Management
```
GET    /api/data/users              # List users (admin only)
POST   /api/data/users              # Create user
GET    /api/data/users/:id          # Get user details
PUT    /api/data/users/:id          # Update user
DELETE /api/data/users/:id          # Delete user

GET    /api/data/cases              # List counseling cases
GET    /api/data/cases/:id          # Get case details
POST   /api/data/cases              # Create new case
PUT    /api/data/cases/:id          # Update case status
```

## 🗄️ Database

### Skema Utama

#### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  role ENUM('student', 'counselor', 'admin', 'leader'),
  status ENUM('active', 'inactive', 'suspended'),
  sso_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_sso_id (sso_id)
);
```

#### Screening Responses
```sql
CREATE TABLE screening_responses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  screening_type ENUM('PHQ-9', 'GAD-7', 'SRQ-20') NOT NULL,
  responses JSON,
  score INT,
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_date (user_id, submission_date)
);
```

#### Risk Scores
```sql
CREATE TABLE risk_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  score INT NOT NULL,
  classification ENUM('rendah', 'sedang', 'krisis') NOT NULL,
  trend_change INT,
  ai_recommendation TEXT,
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_classification (user_id, classification)
);
```

#### Counseling Cases
```sql
CREATE TABLE counseling_cases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  counselor_id INT,
  status ENUM('open', 'scheduled', 'in_progress', 'closed', 'escalated') DEFAULT 'open',
  risk_level ENUM('rendah', 'sedang', 'krisis'),
  case_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (counselor_id) REFERENCES users(id),
  INDEX idx_counselor_status (counselor_id, status),
  INDEX idx_risk_level (risk_level)
);
```

### Inisialisasi Database
```bash
# Connect ke MySQL
mysql -u root -p

# Create database
CREATE DATABASE counseling_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Select database
USE counseling_db;

# Execute schema file
SOURCE /path/to/schema.sql;
```

## 🐳 Deployment Docker

### Using Docker Compose (Recommended)

```bash
# Build dan start semua services
docker-compose up -d

# Lihat logs
docker-compose logs -f

# Stop services
docker-compose down
```

### docker-compose.yml Configuration
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      NODE_ENV: production
      DB_HOST: mysql
      REDIS_URL: redis://redis:6379
    depends_on:
      - mysql
      - redis

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: counseling_db
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

### Build & Run Manual Docker
```bash
# Build image
docker build -t counseling-app:latest .

# Run container
docker run -d \
  --name counseling-app \
  -p 3000:3000 \
  -p 3001:3001 \
  -e GROQ_API_KEY="your_key" \
  -e DB_HOST="host.docker.internal" \
  counseling-app:latest
```

## 👨‍💻 Workflow Pengembangan

### Branch Strategy
```
main (production)
  ├── develop (staging/integration)
  └── feature/* (feature branches)
      ├── feature/ai-risk-scoring
      ├── feature/siam-integration
      └── feature/analytics-dashboard
```

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Development & Testing**
   ```bash
   npm run dev           # Frontend
   npm run dev:server    # Backend (separate terminal)
   npm run lint          # Check TypeScript types
   ```

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

4. **Push & Create PR**
   ```bash
   git push origin feature/your-feature-name
   # Create Pull Request via GitHub/GitLab
   ```

5. **Code Review & Merge**
   - Request review dari tim
   - Address feedback
   - Merge ke develop setelah approval

### Build & Deploy Pipeline

```
Feature PR → Code Review → Merge to Develop → 
Auto Build → Test → Staging Deploy → 
Manual Approval → Production Deploy
```

### Useful npm Scripts

```bash
npm run dev              # Start dev server (frontend)
npm run dev:server       # Start server in watch mode
npm run build            # Build frontend & compile backend
npm run start            # Run production build
npm run preview          # Preview production build locally
npm run clean            # Clean build output
npm run lint             # TypeScript type checking
```

## 🔒 Security Considerations

- ✅ **JWT Authentication**: Token-based auth dengan JWT signing
- ✅ **Password Hashing**: bcryptjs untuk secure password storage
- ✅ **CORS Protection**: Whitelist origin untuk cross-origin requests
- ✅ **TLS Encryption**: HTTPS untuk all external communications
- ✅ **Rate Limiting**: API rate limiting di gateway
- ✅ **Input Validation**: Server-side validation untuk all inputs
- ✅ **Audit Logging**: Semua aktivitas dicatat di audit log
- ✅ **SSO Integration**: SIAM UB untuk centralized authentication

## 📞 Support & Troubleshooting

### Common Issues

**Port sudah digunakan**
```bash
# Frontend (3000)
kill -9 $(lsof -t -i:3000)

# Backend (3001)
kill -9 $(lsof -t -i:3001)
```

**Database connection error**
- Cek MySQL running: `mysql -u root -p -e "SELECT 1"`
- Verifikasi credentials di `.env.local`
- Pastikan database sudah dibuat

**AI scoring tidak bekerja**
- Verifikasi `GROQ_API_KEY` di environment
- Check Groq API status: https://console.groq.com
- Review server logs: `npm run dev:server`

### Logs & Debugging

```bash
# Frontend console (Browser DevTools)
- Open: http://localhost:3000
- F12 atau Ctrl+Shift+I
- Tab: Console, Network, Application

# Backend logs
- Terminal tempat server running menampilkan logs
- Juga check: ~/.local/share/application-logs/

# Database query log (MySQL)
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';
SELECT * FROM mysql.general_log;
```

## 📚 Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MySQL Reference](https://dev.mysql.com/doc)
- [Groq API Documentation](https://console.groq.com/docs)

## 📄 License

[Specify your license - e.g., MIT, Apache 2.0, etc.]

## 👥 Contributors

Tim pengembang sistem manajemen konseling UB:
- Backend & DevOps
- Frontend & UI/UX
- AI/ML Engineer
- Database Administrator
- System Architect

---

**Last Updated**: May 24, 2026  
**Version**: 1.0.0  
**Status**: Active Development

Untuk pertanyaan, silakan hubungi tim development atau buat issue di repository ini.
