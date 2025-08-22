# InnerSelf Deployment Guide

## Current Status
- ✅ Frontend deployed on GitHub Pages: https://sajanikumari.github.io/Inner-self/
- ⏳ Backend needs deployment for full functionality

## Backend Deployment from GitHub

### **Option 1: Render (Recommended)**
1. Go to https://render.com and sign up with GitHub
2. Click "New" → "Web Service"
3. Connect repository: `sajanikumari/Inner-self`
4. Configure:
   - **Name**: `inner-self-backend`
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/innerself
     JWT_SECRET=your-super-secret-jwt-key-here
     PORT=10000
     NODE_ENV=production
     ```
5. Click "Deploy" - Done!

### **Option 2: Railway**
1. Go to https://railway.app and sign up with GitHub
2. Click "Deploy from GitHub repo"
3. Select `sajanikumari/Inner-self`
4. Railway auto-detects Node.js and deploys from `/server`
5. Add environment variables in Railway dashboard

### **Option 3: Vercel**
```bash
npm i -g vercel
vercel
```

## After Backend Deployment
1. Copy your backend URL (e.g., `https://your-app.onrender.com`)
2. Update `client/js/config.js` line 6:
   ```javascript
   return 'https://your-backend-app.onrender.com/api';
   ```
3. Commit and push to update frontend

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

## Local Development
```bash
# Backend (requires MongoDB)
cd server
npm install
npm run dev

# Frontend (static files)
cd client
# Open index.html in browser or use live server
```

## Production Deployment Status
- ✅ GitHub Pages: Static frontend
- ⏳ Backend: Needs cloud deployment
- ⏳ Database: Needs MongoDB Atlas setup
