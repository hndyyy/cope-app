# Backend Architecture

## System Overview

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│      Port 3000 / 3000 (Development)     │
└──────────────────┬──────────────────────┘
                   │ HTTP/JSON
┌──────────────────▼──────────────────────┐
│      Backend (Express + Node.js)        │
│           Port 3001 (Default)           │
├──────────────────────────────────────────┤
│         CORS Middleware                 │
│         JSON Parser Middleware          │
│         Request Logger                  │
├──────────────────────────────────────────┤
│  Routes:                                │
│  ├─ GET  /api/health                   │
│  ├─ POST /api/ai/generate              │
│  ├─ POST /api/ai/chat                  │
│  └─ GET  /api/ai/models                │
├──────────────────────────────────────────┤
│      Google Gemini API Integration      │
│    (via @google/genai package)          │
└──────────────────────────────────────────┘
```

## Component Details

### 1. Server Core (server/index.ts)
- Express app initialization
- CORS configuration
- Static file serving (frontend dist)
- Error handling middleware
- Route registration

### 2. AI Routes (server/routes/ai.ts)
- **POST /api/ai/generate**: Single-shot text generation
- **POST /api/ai/chat**: Multi-turn conversation
- **GET /api/ai/models**: List available models
- Gemini API integration
- Request validation
- Token usage tracking

### 3. Health Routes (server/routes/health.ts)
- **GET /api/health**: Server health status
- Uptime monitoring
- Basic liveness check

### 4. Environment & Config
- `.env.local`: Configuration management
- `server/tsconfig.json`: TypeScript compilation

## Request/Response Flow

### Typical Request Flow
```
Frontend Request
    ↓
Express Server (CORS check)
    ↓
Route Handler (Validation)
    ↓
Gemini API Call
    ↓
Response Processing
    ↓
Format Response (JSON)
    ↓
Send to Frontend
```

### Error Handling Flow
```
Error Occurs
    ↓
Error Caught (try-catch)
    ↓
Log to Console
    ↓
Format Error Response
    ↓
Send JSON Response
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "content": "...",
    "model": "gemini-2.0-flash",
    "usage": { ... }
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Description of error"
}
```

## Development vs Production

### Development
- Frontend: Vite dev server (port 3000/5173)
- Backend: tsx watch (port 3001)
- HMR enabled
- Source maps available
- Detailed logging

### Production
- Build: `npm run build`
- Frontend: Static files in dist/
- Backend: Compiled JS in dist/server/
- Run: `npm start`
- Single server serves both

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| GEMINI_API_KEY | - | Gemini API authentication |
| PORT | 3001 | Server port |
| NODE_ENV | development | Environment mode |
| CORS_ORIGIN | localhost:3000, :5173 | CORS allowed origins |

## Dependencies

### Runtime
- **express**: Web framework
- **cors**: CORS middleware
- **dotenv**: Environment variables
- **@google/genai**: Gemini API client

### Dev
- **typescript**: Type checking
- **tsx**: TypeScript executor
- **@types/express**: Type definitions
- **@types/cors**: Type definitions
- **@types/node**: Node.js types

## Security Considerations

1. **API Keys**: Store GEMINI_API_KEY in .env.local only
2. **CORS**: Restricted to specific origins
3. **Input Validation**: Check prompts before API call
4. **Error Messages**: Don't expose sensitive info
5. **Rate Limiting**: Consider adding for production

## Scalability Notes

- Current setup suitable for single instance
- For scaling, consider:
  - Load balancing
  - API rate limiting
  - Database for chat history
  - Caching layer
  - Request queuing
  - Monitoring/logging service
