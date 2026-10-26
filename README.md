# CareerMatch AI

CareerMatch AI is a job and internship discovery app with a React frontend and an Express API.

## Requirements

- Node.js 22 or newer
- npm

## Run locally

1. Configure the backend:

   ```powershell
   cd backend
   npm install
   Copy-Item .env.example .env
   ```

   Set `JWT_SECRET` in `backend/.env` to a long, random value before starting the API.

2. Start the backend in that terminal:

   ```powershell
   npm start
   ```

3. In a second terminal, start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite (by default, `http://localhost:5173`).

The frontend proxies `/api` requests to the backend on port 5000. The backend creates its local SQLite database when it starts; database files and environment files are excluded from version control.
