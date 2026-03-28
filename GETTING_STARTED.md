# Getting Started Guide

## 📋 Prerequisites

Make sure you have:
- **Node.js** v16+ ([Download](https://nodejs.org))
- **npm** v8+ (comes with Node.js)
- **Git** (for version control)
- **MongoDB** (cloud or local)

## 🚀 Quick Start (5 minutes)

### Step 1: Setup Project
```bash
cd login_page
bash setup.sh
```

This will:
- Check if Node.js is installed ✓
- Install all dependencies ✓
- Create .env file ✓

### Step 2: Configure Environment
Edit `.env` file:
```env
# Backend
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/login_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
PORT=5000

# Frontend
VITE_API_URL=http://localhost:5000
```

**Don't have MongoDB?** See setup section below ↓

### Step 3: Start Development
```bash
npm run dev
```

You'll see:
```
Frontend running at: http://localhost:3000
Backend running at: http://localhost:5000
```

### Step 4: Test It Out
1. Open http://localhost:3000
2. Click "Sign Up"
3. Create an account
4. You'll be redirected to Dashboard
5. Click "Logout" to return to login

## 🗄️ MongoDB Setup

### Option A: Cloud MongoDB (Recommended)

1. **Create free cluster:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Sign Up Free"
   - Create account and verify email

2. **Create a cluster:**
   - Click "Create Deployment"
   - Choose "Free" tier
   - Click "Create"
   - Wait 3-5 minutes for cluster to deploy

3. **Get connection string:**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>`

4. **Add to .env:**
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/login_db
   ```

5. **Whitelist your IP:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Add "0.0.0.0/0" for development (add specific IPs in production)

### Option B: Local MongoDB

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
- Download MongoDB Community Server
- Run installer (.msi)
- MongoDB runs automatically

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

Then set in .env:
```env
MONGODB_URI=mongodb://localhost:27017/login_db
```

## 📁 Project Structure

```
login_page/
├── frontend/           ← React app (port 3000)
│   ├── src/
│   │   ├── pages/     → Login, Signup, Dashboard
│   │   ├── context/   → Auth state
│   │   ├── components/→ PrivateRoute
│   │   └── styles/    → CSS
│   └── vite.config.js
│
├── backend/            ← Express API (port 5000)
│   ├── routes/        → /api/auth endpoints
│   ├── models/        → User schema
│   ├── middleware/    → Auth logic
│   └── server.js
│
├── DEPLOYMENT.md      ← Deploy to Vercel/Netlify
├── README.md
└── .env              ← Your secrets (don't commit!)
```

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me (protected)

POST   /api/auth/logout (optional to add)
```

**Response Examples:**

Register:
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

Login:
```json
{
  "message": "Logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## 🧪 Test the API with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (replace TOKEN with real JWT)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start both frontend and backend

# Frontend only
npm run dev --workspace=frontend

# Backend only
npm run dev --workspace=backend

# Build for production
npm run build

# Install new dependency
npm install package-name --workspace=frontend
npm install package-name --workspace=backend
```

## 🚨 Common Issues & Fixes

### Issue: "Cannot find module 'mongoose'"
```bash
# Fix: Reinstall backend dependencies
npm install --workspace=backend
```

### Issue: "MongoDB connection failed"
- Check `.env` has correct `MONGODB_URI`
- Verify MongoDB server is running
- For MongoDB Atlas, check IP whitelist

### Issue: "CORS errors in console"
- Make sure backend is running on port 5000
- Check `FRONTEND_URL` in backend CORS config

### Issue: "TypeError: Cannot read property 'user' of undefined"
- Token may have expired
- Try logging out and back in
- Clear localStorage in browser

### Issue: "Port 3000 already in use"
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

## 📚 Next Steps

Once everything works locally:

1. **Add features:**
   - Email verification
   - Password reset
   - User profile
   - Social login (Google, GitHub)

2. **Improve security:**
   - Add rate limiting
   - Implement refresh tokens
   - Add CSRF protection
   - Use secure cookies

3. **Deploy to production:**
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
   - Set up custom domain
   - Enable SSL/HTTPS
   - Configure email service

## 📞 Need Help?

**Check these resources:**
- [Express.js Docs](https://expressjs.com)
- [React Router Docs](https://reactrouter.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [JWT Guide](https://jwt.io/introduction)

**Browser DevTools:**
- Network tab → See API calls
- Console tab → See errors
- Application tab → See localStorage/cookies

## ✅ Checklist for Production

- [ ] MongoDB Atlas cluster set up
- [ ] JWT_SECRET is strong and secret
- [ ] No .env committed to Git
- [ ] CORS enabled for production domain
- [ ] Error messages don't expose sensitive info
- [ ] Input validation on both frontend & backend
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting configured
- [ ] Monitoring/logging set up

Happy coding! 🎉
