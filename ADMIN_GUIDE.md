# 🛡️ Admin Panel - Quick Start

## Akses Admin Panel

### Lokal
```
http://localhost:3001/admin/login
```

### Production (Setelah Deploy)
```
https://your-frontend.vercel.app/admin/login
```

---

## 📋 Admin Credentials (Default)

```
Username: masuk123
Password: masuk123
```

⚠️ **IMPORTANT**: Ubah credentials ini sebelum production!

---

## ✨ Fitur Admin Panel

### 1. **Login Admin**
- Username & Password authentication
- JWT token untuk security
- Session expiry: 7 hari

### 2. **Lihat Semua User**
- Total username user counter
- Table view dengan info:
  - Name
  - Email
  - Join Date
  - Action buttons

### 3. **Delete User**
- Hapus user tertentu
- Confirmation dialog

### 4. **Logout**
- Secure logout
- Clear token dari localStorage

---

## 🔐 Mengubah Admin Password

### Lokal Development
Edit file: `backend/routes/admin.js`

```javascript
// Line 7-8
const ADMIN_USERNAME = 'username_baru';
const ADMIN_PASSWORD = 'password_baru';
```

Restart server.

### Production (Vercel/Railway)
1. Update variable di environment
2. Atau update di code → push ke repo → auto redeploy
3. URL: `/admin/login` dengan password baru

---

## 📊 Data User yang Ditampilkan

Ketika Anda login ke admin panel, Anda bisa lihat:

```
┌─────────────────────────────────────────┐
│ Total Users: 5                          │
├─────────────────────────────────────────┤
│ No │ Name      │ Email           │ Join │
├────┼───────────┼─────────────────┼──────┤
│ 1  │ John Doe  │ john@gmail.com  │ 3/28 │
│ 2  │ Jane Smith│ jane@gmail.com  │ 3/28 │
│ 3  │ Bob       │ bob@gmail.com   │ 3/27 │
│ ... │           │                 │      │
└─────────────────────────────────────────┘
```

---

## 🔄 Testing Admin Features

### 1. Test User Signup & Admin View

**Terminal 1: Start Backend**
```bash
npm run dev --workspace=backend
```

**Terminal 2: Start Frontend**
```bash
npm run dev --workspace=frontend
```

**Browser 1: Signup as User**
```
1. Go to http://localhost:3001
2. Click "Sign up"
3. Fill form: name, email, password
4. Click Sign up
5. Redirect to dashboard
```

**Browser 2: Admin View**
```
1. Go to http://localhost:3001/admin/login
2. Enter: masuk123 / masuk123
3. Klik Login
4. Lihat user yang baru signup di table!
```

---

## 🛠️ API Endpoints

Admin menggunakan API endpoints:

```
POST   /api/admin/login
GET    /api/admin/users
GET    /api/admin/users/:id
DELETE /api/admin/users/:id
```

Semua endpoints memerlukan JWT token dari admin login.

---

## 📝 Sample cURL Commands

### Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "masuk123",
    "password": "masuk123"
  }'

# Response:
{
  "message": "Admin logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "admin",
    "role": "admin",
    "username": "Admin"
  }
}
```

### Get All Users (dengan token)
```bash
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."

# Response:
{
  "total": 5,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@gmail.com",
      "createdAt": "2026-03-28T10:30:00Z"
    },
    ...
  ]
}
```

### Delete User
```bash
curl -X DELETE http://localhost:5000/api/admin/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## 🔒 Security Features

✅ **JWT Authentication** - Admin token harus valid
✅ **Role-based Access** - Hanya admin yang bisa access
✅ **Token Expiry** - Token expired after 7 days
✅ **Password Hashing** - User password tidak pernah terlihat
✅ **Logout** - Clear token dari browser

---

## ⚠️ Admin Panel Security Tips

1. **Change Default Password**
   ```javascript
   // Jangan biarkan masuk123/masuk123 di production!
   // Update ke password yang kuat
   ```

2. **Use Strong JWT Secret**
   ```
   JWT_SECRET harus: 
   - Min 32 characters
   - Mix upper, lower, numbers, symbols
   - Example: Kh#2@xPqL9mN$vB2@4xWqZp1!tYuIoP
   ```

3. **Enable HTTPS**
   - Vercel/Railway otomatis https
   - Admin credentials encrypted in transit

4. **Rate Limiting** (Future)
   - Prevent brute force attacks
   - Max 5 login attempts per hour

5. **Audit Logging** (Future)
   - Log siapa yang login/delete user
   - Store untuk security purposes

---

## 🆘 Troubleshooting

### ❌ "Invalid admin credentials"
> Password atau username salah
```
Default: masuk123 / masuk123
```

### ❌ "No token provided"
> Anda tidak login admin
```
1. Go ke /admin/login
2. Login dulu
3. Token akan tersimpan di localStorage
```

### ❌ "Not authorized as admin"
> Token expired atau invalid
```
1. Logout (/admin/login → Logout button)
2. Login lagi
3. Get new token
```

### ❌ "Cannot GET /api/admin/users"
> Backend tidak jalan
```
npm run dev --workspace=backend
```

---

## 📱 Admin Features Roadmap

Fitur masa depan:
- [ ] Export user data to CSV
- [ ] Search & filter users
- [ ] Edit user profile
- [ ] 2FA untuk admin login
- [ ] Audit logs
- [ ] User statistics
- [ ] Email notifications

---

## ✅ Checklist

Setup Admin:
- [ ] Start backend & frontend
- [ ] Go to /admin/login
- [ ] Login dengan masuk123/masuk123
- [ ] Lihat dashboard dengan 0 users
- [ ] Signup user baru dari /login page
- [ ] Refresh admin dashboard → user muncul!
- [ ] Test delete user
- [ ] Test logout

---

**Admin Panel Ready! 🚀**

Sekarang Anda bisa:
✅ Monitor semua user yang signup
✅ Manage user data
✅ Track growth aplikasi

Next: Setup deployment! Lihat DEPLOY_GUIDE.md 📗
