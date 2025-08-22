# InnerSelf Deployment Guide

## Current Status
- ✅ Frontend deployed on GitHub Pages: https://sajanikumari.github.io/Inner-self/
- ⏳ Backend needs deployment for full functionality

## Quick Deploy Options

### 1. Vercel (Recommended for Full-Stack)
```bash
npm i -g vercel
vercel
```

### 2. Keep GitHub Pages + Deploy Backend Separately
- Frontend: Already on GitHub Pages
- Backend: Deploy to Railway, Render, or Heroku

### 3. Netlify (Frontend + Serverless Functions)
```bash
npm i -g netlify-cli
netlify deploy --prod
```

## Environment Variables Required
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

## Database Setup
1. Create MongoDB Atlas account (free)
2. Create cluster and get connection string
3. Add connection string to environment variables

## File Structure
```
├── client/          # Frontend (already deployed)
├── server/          # Backend (needs deployment)
├── _config.yml      # GitHub Pages config
├── vercel.json      # Vercel deployment config
└── README.md
```
