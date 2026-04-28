# Bible Tracker

A full stack web app for logging daily Bible readings and tracking your reading streak.

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI, SQLModel
- **Database:** SQLite
- **Auth:** JWT tokens, bcrypt password hashing

---

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```
SECRET_KEY=your_secret_key_here
```

Generate a secret key:

```bash
openssl rand -hex 32
```

Run the server:

```bash
uvicorn main:app --reload
```

- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:3000`