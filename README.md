# Login Page - Full Stack Application

A complete, production-ready login page with React frontend and Node.js backend.

## Features
✅ User registration and login
✅ JWT authentication
✅ Password hashing with bcryptjs
✅ Protected routes
✅ MongoDB database
✅ Beautiful, responsive UI
✅ Error handling
✅ Deployment-ready

## Tech Stack

**Frontend:**
- React 18
- React Router
- Axios
- Vite (bundler)
- CSS3 (responsive design)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (password hashing)
- CORS enabled

## Project Structure

```
login_page/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── pages/        # Login, Signup, Dashboard
│   │   ├── components/   # PrivateRoute
│   │   ├── context/      # Auth state management
│   │   ├── styles/       # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/               # Express API
│   ├── routes/           # Auth endpoints
│   ├── models/           # User schema
│   ├── middleware/       # Auth, error handling
│   ├── server.js
│   └── package.json
│
├── vercel.json           # Vercel deployment config
├── DEPLOYMENT.md         # Deployment instructions
├── .env.example          # Environment template
└── package.json          # Root package.json

```

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   npm install --workspace=frontend
   npm install --workspace=backend
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

4. **Visit:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Available Routes

### Authentication API
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Protected Routes
- `GET /api/protected/dashboard` - Example protected route

## Test Users

After running the application, you can:
1. Sign up a new account
2. Login with your credentials
3. Access protected dashboard

## Environment Variables

See `.env.example` for all required variables:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key_at_least_32_chars
NODE_ENV=development
PORT=5000
REACT_APP_API_URL=http://localhost:5000
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions to:
- Vercel
- Netlify  
- Railway
- Any cloud provider

## Security Features
- Password hashing (bcryptjs)
- JWT token-based auth
- Protected routes
- CORS configuration
- Error handling

## Future Enhancements
- [ ] Email verification
- [ ] Password reset
- [ ] OAuth integration (Google, GitHub)
- [ ] Two-factor authentication
- [ ] User profile page
- [ ] Refresh tokens

## Support
For issues or questions, check the DEPLOYMENT.md or create an issue in your repository.

## License
MIT
