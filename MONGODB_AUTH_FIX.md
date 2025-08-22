# Fix MongoDB Authentication

## Current Issue
✅ **Cluster reachable** - Connection string is working  
❌ **Authentication failed** - Username/password incorrect

## Quick Fix Steps

### 1. Check MongoDB Atlas Credentials
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign in to your account
3. Navigate to your `innerself-cluster` project
4. Go to **Database Access** (in left sidebar)

### 2. Verify/Create Database User
You should see a user that matches your connection string. If not:

**Create a new user:**
1. Click **"+ ADD NEW DATABASE USER"**
2. Choose **"Password"** authentication method
3. Set username (remember this!)
4. Generate a secure password (remember this!)
5. Set **Database User Privileges** to **"Read and write to any database"**
6. Click **"Add User"**

### 3. Update Environment Variable in Render
1. Go to your [Render Dashboard](https://dashboard.render.com)
2. Find your `inner-self-backend` service
3. Go to **Environment** tab
4. Update `MONGODB_URI` with correct credentials:

```
mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@innerself-cluster.v4rqwdh.mongodb.net/innerself?retryWrites=true&w=majority&appName=innerself-cluster
```

**Important:** 
- Replace `YOUR_USERNAME` with actual username
- Replace `YOUR_PASSWORD` with actual password  
- Add `/innerself` as database name before the `?`
- If password contains special characters, URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `%` becomes `%25`
  - etc.

### 4. Redeploy
After updating the environment variable, your service will automatically redeploy.

### 5. Verify Success
Look for this log message:
```
✅ Connected to MongoDB
```

## Example Working Connection String
```
mongodb+srv://myuser:mypassword@innerself-cluster.v4rqwdh.mongodb.net/innerself?retryWrites=true&w=majority&appName=innerself-cluster
```

## Network Access Check (if still issues)
1. In MongoDB Atlas, go to **Network Access**
2. Make sure you have `0.0.0.0/0` in the IP Access List (allows all IPs)
3. Or add Render's IP ranges if you prefer more security

---
**Your deployment is otherwise PERFECT! 🎉 Just need the right MongoDB credentials.**