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

A `.env` file is already included with safe local-dev defaults. Edit it (or copy
`.env.example`) to point at your own MongoDB instance and to set a real `JWT_SECRET`
before deploying:

```
PORT=8000
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=habit-tracker
JWT_SECRET=change_this_secret
JWT_ALGORITHM=HS256
JWT_EXPIRE_DAYS=30
CLIENT_URL=http://localhost:5173
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

## Notes on what was fixed

- **Backend**: modernized the startup hook to FastAPI's `lifespan` API, added a
  `/health` endpoint and a `/api/auth/me` endpoint (used by the profile page),
  and made `CLIENT_URL` support a comma-separated list of allowed origins.
- **Frontend**:
  - Fixed a missing `recharts` import in `Dashboard.jsx` that broke the build,
    and consolidated chart rendering into the reusable `ProgressChart` component.
  - Fixed `Footer.jsx` (lowercase `classname` typos and a missing `export default`
    that made the component impossible to import).
  - Implemented the previously empty `Register.jsx` and `profile.jsx` pages, and
    wired up a `/profile` route.
  - Fixed `Navbar.jsx` to read auth state from `AuthContext` instead of directly
    from `localStorage`, so the UI updates immediately on login/logout.
  - Fixed invalid Tailwind class `bg-gradient-to-right` (not a real utility) to
    `bg-gradient-to-r` in `Navbar.jsx` and `Login.jsx`.
  - Fixed `ui/Button.jsx` and `ui/Card.jsx`, which referenced `clsx` (and an
    undefined `Spinner` component) without importing them; added `clsx` as a
    dependency and wired the `ConfirmDialog` component into the habit delete flow.
  - Removed two dead, empty route files (`routes/AppRoute.jsx`,
    `routes/ProtectedRoute.jsx`) that duplicated `PrivateRoute` and were never used.
  - Moved the API base URL and hardcoded production URL out of `src/api/api.js`
    and into `VITE_API_URL`, and removed a leftover `console.log` of the auth token.
  - Wrapped `/habits` and added `/profile` behind `PrivateRoute` in `App.jsx`, and
    rendered the `Footer` component (it existed but was never used).
- **Security**: the uploaded project's `Back-End/.env` contained a real MongoDB
  Atlas connection string with a live username/password and a weak hardcoded JWT
  secret. Both have been replaced with local placeholder values in this copy.
  **If that connection string was ever pushed anywhere (GitHub, a shared drive,
  etc.), rotate the MongoDB Atlas password immediately** — it should be treated
  as compromised.
- Added `.env` / `.env.example` / `.gitignore` for both the backend and frontend
  so secrets aren't accidentally committed to source control.
