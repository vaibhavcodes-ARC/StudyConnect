# StudyConnect

A college resource portal with a React frontend and Node.js backend.

## Deployment

This repository is structured as a monorepo.

### Backend (Render)
- **Root Directory**: Leave as root (./) or set to `backend`.
- **Build Command**: `npm install` (in root) or `npm install --workspace=backend`.
- **Start Command**: `npm start` (in root) or `npm start --workspace=backend`.

### Frontend (Vercel)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Environment Variables**: Set `NEXT_PUBLIC_API_URL` to your backend API URL.