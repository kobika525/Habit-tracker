# Habit Tracker

A full-stack habit tracking app: FastAPI + MongoDB backend, React + Vite frontend.

## Project structure

```
Habit-Tracker-Fixed/
├── Back-End/     FastAPI + MongoDB (Motor) API
└── Front-End/    React 19 + Vite + Tailwind CSS v4
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- A MongoDB instance (local `mongod`, or a free cluster on MongoDB Atlas)

## Backend setup

```bash
cd Back-End
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```



Run the API:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`, with interactive docs at
`http://localhost:8000/docs`.

## Frontend setup

```bash
cd Front-End
npm install
```

A `.env` file is already included pointing at the local backend:

```
VITE_API_URL=http://localhost:8000/api
```

Run the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

To build for production:

```bash
npm run build
```

