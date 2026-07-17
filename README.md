# Stadium Operations Dashboard

## Project Overview

A GenAI-powered operations dashboard designed for FIFA World Cup 2026 stadiums. This application ingests real-time operational signals (crowd density, volunteer availability, medical incidents) and uses Google Gemini to provide structured, reasoned recommendations for stadium organizers and clear, plain-language instructions for volunteers.

## Architecture

- **Frontend**: Next.js (App Router), TypeScript, TailwindCSS (deployed as a PWA)
- **Backend**: FastAPI (Python) for API endpoints and Gemini AI interactions
- **Database/Auth**: Firebase Firestore + Firebase Auth
- **AI**: Google Gemini API (structured JSON output)
- **Maps**: Google Maps JS API

## Folder Structure

```
.
├── frontend/                # Next.js frontend application
│   ├── src/                 # Application source code
│   │   ├── app/             # App router pages (organizer, volunteer)
│   │   ├── components/      # Reusable React components
│   │   └── lib/             # Utility functions, Firebase setup
│   ├── public/              # Static assets
│   └── .env.example         # Frontend environment variables template
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── core/            # Core configuration (Auth, etc.)
│   │   ├── models/          # Pydantic models for validation
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic (Gemini, Firestore)
│   │   └── main.py          # FastAPI application entry point
│   ├── scripts/             # Utility scripts (e.g., seeding demo data)
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Backend environment variables template
└── docs/                    # Product and technical documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.11+)
- Firebase Account (with Firestore and Authentication enabled)
- Google Cloud Account (for Gemini and Google Maps API keys)

### 1. Environment Variables

#### Backend
1. Navigate to the `backend/` directory.
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in the values for `GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`, and `FIREBASE_CREDENTIALS_PATH`.

#### Frontend
1. Navigate to the `frontend/` directory.
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in your Firebase configuration and Google Maps API key.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Development Workflow

- The backend runs on `http://localhost:8000`.
- The frontend runs on `http://localhost:3000`.
- Follow the guidelines in `/docs` (especially `PRD.md`, `API.md`, and `AI.md`) when making changes.
- Ensure all new AI endpoints include tests and fallback mechanisms.

## Deployment Placeholders

- **Frontend**: To be deployed on [Vercel](https://vercel.com).
- **Backend**: To be deployed on [Google Cloud Run](https://cloud.google.com/run).
- **Database**: Managed by Firebase Firestore.
