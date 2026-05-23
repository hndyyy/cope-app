# Backend Setup Guide

Backend untuk aplikasi Anda telah dibuat. Berikut adalah panduan lengkap untuk setup dan menjalankannya.

## 📁 Struktur Backend

```
server/
├── index.ts                 # Entry point server
├── tsconfig.json           # TypeScript config untuk server
├── routes/
│   ├── ai.ts              # AI/Gemini API routes
│   └── health.ts          # Health check endpoint
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Environment
Edit file `.env.local` di root project:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (defaults provided)
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

Dapatkan API key dari: https://ai.google.dev

### 3. Development Mode

**Terminal 1 - Frontend (Vite):**
```bash
npm run dev
```
Frontend akan berjalan di: http://localhost:3000 atau http://localhost:5173

**Terminal 2 - Backend (Express):**
```bash
npm run dev:server
```
Backend akan berjalan di: http://localhost:3001

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "uptime": 12.345
}
```

### Generate Content
```
POST /api/ai/generate
Content-Type: application/json

{
  "prompt": "Hello, how are you?",
  "model": "gemini-2.0-flash",
  "temperature": 0.7,
  "topP": 0.9,
  "topK": 40,
  "maxOutputTokens": 2048
}
```

Response:
```json
{
  "success": true,
  "data": {
    "content": "I'm doing well, thank you for asking!",
    "model": "gemini-2.0-flash",
    "usage": {
      "promptTokens": 10,
      "candidatesTokens": 20,
      "totalTokens": 30
    }
  }
}
```

### Chat
```
POST /api/ai/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "What is 2+2?"
    }
  ],
  "model": "gemini-2.0-flash",
  "temperature": 0.7,
  "maxOutputTokens": 2048
}
```

Response:
```json
{
  "success": true,
  "data": {
    "content": "2 + 2 = 4",
    "model": "gemini-2.0-flash",
    "usage": {
      "promptTokens": 10,
      "candidatesTokens": 5,
      "totalTokens": 15
    }
  }
}
```

### Available Models
```
GET /api/ai/models
```

Response:
```json
{
  "success": true,
  "data": {
    "models": [
      "gemini-2.0-flash",
      "gemini-1.5-pro",
      "gemini-1.5-flash"
    ]
  }
}
```

## 🔧 Build & Deployment

### Build
```bash
npm run build
```
Output:
- Frontend: `dist/` (React app)
- Backend: `dist/server/` (Compiled TypeScript)

### Production Start
```bash
npm start
```
Server akan serve frontend + backend di port 3001 (atau PORT yang dikonfigurasi)

## 📝 Scripts Available

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Start dev server frontend (Vite) |
| `npm run dev:server` | Start dev server backend (hot reload) |
| `npm run build` | Build frontend + server |
| `npm start` | Start production server |
| `npm run lint` | Check TypeScript errors |
| `npm run clean` | Clean dist folder |

## 🛡️ Konfigurasi

### CORS
Backend sudah dikonfigurasi untuk menerima request dari:
- http://localhost:3000
- http://localhost:5173

Untuk production, update `CORS_ORIGIN` di `.env.local`

### Error Handling
Backend memiliki error handling di setiap endpoint. Response format konsisten:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🔌 Integrasi dengan Frontend

Untuk menggunakan API dari frontend React:

```typescript
// example.ts
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    prompt: 'Your prompt here',
  }),
});

const data = await response.json();
```

## 📚 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **API**: Google Gemini API
- **Frontend Integration**: CORS enabled
- **Environment**: dotenv for configuration

## ⚠️ Important Notes

1. Jangan commit `.env.local` ke git - pastikan di `.gitignore`
2. GEMINI_API_KEY adalah required untuk production
3. Server otomatis serve frontend yang sudah di-build
4. Development mode memisahkan frontend dan backend untuk HMR

## 🐛 Troubleshooting

**Error: "GEMINI_API_KEY is not configured"**
- Set GEMINI_API_KEY di .env.local

**Error: "Port 3001 already in use"**
- Ubah PORT di .env.local atau kill process yang pakai port tersebut

**CORS Error di frontend**
- Pastikan CORS_ORIGIN di .env.local mencakup origin frontend Anda

## 📖 References

- [Gemini API Documentation](https://ai.google.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
