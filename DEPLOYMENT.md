# Deployment Guide for Login Page

## Prerequisites
- Node.js and npm installed
- MongoDB database (cloud or local)
- Git repository (for hosting)

## Local Setup

1. **Clone and install dependencies:**
   ```bash
   cd login_page
   npm install
   npm install --workspace=frontend
   npm install --workspace=backend
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update with your MongoDB URI and JWT secret
   ```bash
   cp .env.example .env
   ```

3. **Run development servers:**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Database Setup

### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string and add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/login_db
   ```

### Option 2: Local MongoDB
```bash
# Install MongoDB locally, then
mongod
```

## Deployment to Vercel

### Frontend & Backend
1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy Backend (API Routes):**
   - Connect your GitHub repo to Vercel
   - Select framework: **Other**
   - Build command: `npm run build --workspace=backend`
   - Output directory: Leave empty (Vercel serverless functions)
   - Environment variables:
     - `MONGODB_URI=your_mongodb_url`
     - `JWT_SECRET=your_secret_key`
   - Deploy!

3. **Deploy Frontend:**
   - Create separate Vercel project for frontend
   - Build command: `npm run build --workspace=frontend`
   - Output directory: `frontend/dist`
   - Environment variables:
     - `REACT_APP_API_URL=https://your-backend.vercel.app`
   - Deploy!

## Deployment to Netlify

### Frontend
1. Connect GitHub repo to Netlify
2. Build command: `npm run build --workspace=frontend`
3. Publish directory: `frontend/dist`
4. Add environment variable: `REACT_APP_API_URL=your_api_url`

### Backend
For the backend API, you can:
- Deploy to Railway.app, Render, or Heroku
- Or use Vercel serverless functions as shown above

## Production Checklist
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Use MongoDB Atlas (not local)
- [ ] Enable CORS for your deployed frontend URL
- [ ] Update `REACT_APP_API_URL` to production backend URL
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Test full login/signup flow on production

## Troubleshooting

**CORS errors:**
- Update `CORS_ORIGIN` in backend to match your frontend URL

**MongoDB connection issues:**
- Check connection string format
- Verify IP whitelist in MongoDB Atlas

**API calls failing:**
- Confirm `REACT_APP_API_URL` matches backend URL
- Check browser console for error details

**JWT errors:**
- Ensure same `JWT_SECRET` on all backend instances
- Check token expiration time

## Security Notes
- Never commit `.env` file with real secrets
- Use strong JWT_SECRET (min 32 characters)
- Validate all inputs on backend
- Use HTTPS only in production
- Implement rate limiting for auth endpoints
- Consider adding 2FA for enhanced security
