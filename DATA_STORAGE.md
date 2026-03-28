# Data Storage & Security Guide

## ✅ Yes - Input Data IS Stored Securely!

Your login application **securely stores all user data** in MongoDB. Here's how it works:

## 📊 What Data Gets Stored

When a user **signs up**, the following data is saved in MongoDB:

```javascript
{
  _id: ObjectId,              // Unique database ID
  email: "user@example.com",  // Email (case-insensitive, indexed)
  password: "hashed_value",   // HASHED with bcryptjs
  name: "John Doe",           // User's full name
  createdAt: Date.now()       // Account creation timestamp
}
```

## 🔐 Security Features

### 1. **Password Hashing (bcryptjs)**
- Passwords are **NEVER stored in plain text**
- Each password is hashed with a salt before storage
- Even if database is compromised, passwords can't be recovered
- Example:
  ```
  Plain: "password123"
  Hashed: "$2b$10$N9qo8uLOickgx2ZMRZoMy..."
  ```

### 2. **JWT Authentication Tokens**
- Users receive a JWT token after login
- Token is stored in **browser's localStorage**
- Token expires after 7 days
- Token is sent with each API request for authentication
- Token contains only user ID (no sensitive data)

### 3. **Database Security**
- MongoDB connection requires username/password
- Data is encrypted in transit (HTTPS)
- MongoDB Atlas (cloud) has additional security layers:
  - IP whitelist/firewall
  - Encryption at rest
  - Role-based access control

### 4. **HTTP-Only Considerations**
- Tokens are stored in localStorage (visible to JavaScript)
- For production, implement HTTP-only cookies for better XSS protection
- See recommendations below

## 📍 Where Data is Stored

### Frontend Storage
```
Browser localStorage:
├── token: "eyJhbGciOiJIUzI1NiIs..."  // JWT token
└── Retrieved when app loads
```

### Backend Storage
```
MongoDB:
├── users collection
│   ├── email (indexed for fast lookup)
│   ├── password (hashed)
│   ├── name
│   └── createdAt
└── All data encrypted in transit
```

## 🔐 Data Flow Diagram

### Registration
```
User enters email & password (Frontend)
              ↓
Validation (no empty fields, password > 6 chars)
              ↓
POST /api/auth/register (over HTTPS)
              ↓
Backend receives email & password
              ↓
Check if email already exists in MongoDB
              ↓
Hash password with bcryptjs
              ↓
Store user record in MongoDB
              ↓
Generate JWT token
              ↓
Return token to frontend
              ↓
Store in localStorage
              ↓
User logged in ✅
```

### Login
```
User enters email & password
              ↓
POST /api/auth/login (over HTTPS)
              ↓
Find user by email in MongoDB
              ↓
Compare entered password with hashed password
              ↓
If match → Generate JWT token
              ↓
Return token
              ↓
Store in localStorage
              ↓
User logged in ✅
```

### Protected Routes
```
User visits /dashboard
              ↓
Check localStorage for token
              ↓
If token found → Send as Authorization header
              ↓
Backend verifies JWT signature
              ↓
Fetch user data from MongoDB
              ↓
Render dashboard ✅
              ↓
If no token → Redirect to /login ❌
```

## 🗄️ MongoDB Data Persistence

Your data **persists permanently** in MongoDB:

```javascript
// Example: User data in MongoDB (permanent storage)
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "john@example.com",
  "password": "$2b$10$N9qo8uLOickgx2...",  // Hashed
  "name": "John Doe",
  "createdAt": ISODate("2026-03-28T10:30:00Z")
}

// Stays in database until explicitly deleted
// Survives server restarts
// Accessible from anywhere (via API)
```

## 💾 Demo User Data (After Signup)

After you sign up on the login page:

**Stored in MongoDB:**
```
Email: testuser@example.com
Password: (hashed version of "password123")
Name: Test User
Created: 2026-03-28 10:30:00
```

**Stored in Browser:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔑 Environment Variables (Sensitive Data)

These should **NEVER** be committed to Git:

```bash
# .env (DO NOT COMMIT)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/login_db
JWT_SECRET=your_super_secret_key_at_least_32_chars
```

These are stored in **production hosting** (Vercel, Netlify, etc.) as secrets.

## 🛡️ Security Recommendations for Production

### 1. Use HTTP-Only Cookies Instead of localStorage
```javascript
// Better approach (server sets):
Set-Cookie: token=jwt_token; HttpOnly; Secure; SameSite=Strict
```

### 2. Implement Refresh Tokens
```javascript
// AccessToken: expires in 15 minutes
// RefreshToken: expires in 7 days (secure storage)
```

### 3. Add Rate Limiting
```javascript
// Prevent brute force attacks
// Max 5 login attempts per IP per hour
```

### 4. CSRF Protection
```javascript
// Prevent cross-site request forgery
// Use CSRF tokens in forms
```

### 5. Input Sanitization
```javascript
// Already implemented with validator.js
// Validates email format
// Checks password requirements
```

### 6. Password Requirements
```
Current: Minimum 6 characters
Better: 
  - Minimum 8 characters
  - Uppercase letter required
  - Number required
  - Special character required
  - password complexity checker
```

## 📝 Database Schema (MongoDB)

### Users Collection
```javascript
db.users.createIndex({ email: 1 }, { unique: true })

// User document structure
{
  _id: ObjectId,
  email: String,              // Indexed, unique
  password: String,           // Hashed (bcryptjs)
  name: String,
  createdAt: Date,
  updatedAt: Date,
  // Optional future fields:
  // profilePicture: String,
  // bio: String,
  // followers: [ObjectId],
  // isVerified: Boolean,
}
```

## 🔍 Querying User Data

**You can query stored user data like this:**

```bash
# Login endpoint retrieves user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response returns user data (minus password)
{
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## ✅ Data Is Safe Because:

1. **Hashed passwords** - Can't be reversed
2. **HTTPS encryption** - Data encrypted in transit
3. **JWT tokens** - Only contains user ID
4. **MongoDB security** - Authentication required
5. **Environment secrets** - Not hardcoded
6. **Input validation** - Prevents injection attacks
7. **Error sanitization** - Doesn't expose sensitive info

## ⚠️ Things to Avoid

❌ Storing plain text passwords  
❌ Committing .env files  
❌ Using hardcoded secrets  
❌ Sending passwords in API response  
❌ Storing sensitive data in cookies  
❌ Trusting client-side validation only  

## 📋 How to Check Stored Data

### Option 1: MongoDB Atlas (GUI)
```
1. Go to MongoDB Atlas
2. Select your cluster
3. Click "Browse Collections"
4. View users collection
5. See all stored user records
```

### Option 2: MongoDB Shell
```bash
mongoctl
db.users.find()              # See all users
db.users.findOne({})         # See first user
db.users.findOne({email: "test@example.com"})  # Find specific user
```

### Option 3: API Call
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer your_jwt_token"
```

## 🚀 Production Data Protection

When deployed to Vercel/Netlify:

```
Frontend (Vercel)
    ↓ (HTTPS Encrypted)
Backend (REST API)
    ↓ (Secure connection with IP whitelist)
MongoDB Atlas (Cloud Database)
    ↓ (Encrypted at rest)
Your Data (Permanently stored)
```

## 📊 Data Retention

- ✅ Data persists indefinitely in MongoDB
- ✅ User can delete their account (optional feature to add)
- ✅ Never expires unless explicitly deleted
- ✅ Accessible anytime with valid login

## 🔐 GDPR Compliance (European Users)

If serving EU users, consider:
- [ ] Right to access data
- [ ] Right to delete data (GDPR)
- [ ] Data portability option
- [ ] Privacy policy acknowledgment
- [ ] Consent before data collection

## Summary

| Aspect | Status | Details |
|--------|--------|---------|
| **Data Stored** | ✅ Yes | In MongoDB |
| **Password Secure** | ✅ Yes | Hashed with bcryptjs |
| **Encryption in Transit** | ✅ Yes | HTTPS |
| **Tokens Secure** | ✅ Yes | JWT with secret |
| **Data Persistent** | ✅ Yes | Survives server restarts |
| **Accessible Only by User** | ✅ Yes | Authentication required |
| **Production Ready** | ⚠️ Partial | Add HTTP-only cookies & 2FA |

Your data is **safe, secure, and persisted** in MongoDB! 🎉
