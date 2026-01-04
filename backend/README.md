# JHGNO Crypto Tracker - Backend API

Complete backend with MongoDB, Google OAuth, and password reset email functionality.

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

1. Copy `.env.example` to `.env`
2. Fill in your credentials:
   - MongoDB URI
   - JWT Secret
   - Google Client ID
   - Email configuration

## ▶️ Running

### Development:
```bash
npm run dev
```

### Production:
```bash
npm start
```

Server will run on: `http://localhost:5000`

## 📡 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Body: { username, email, password }
Response: { token, user }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### Google Sign-In
```
POST /api/auth/google
Body: { credential }
Response: { token, user }
```

### Password Reset

#### Request Reset
```
POST /api/auth/forgot-password
Body: { email }
Response: { message }
```

#### Verify Token
```
GET /api/auth/reset-password/:token
Response: { message, email }
```

#### Reset Password
```
POST /api/auth/reset-password/:token
Body: { password }
Response: { message }
```

### Utility

#### Health Check
```
GET /health
Response: { status, timestamp, mongodb }
```

#### Verify JWT
```
GET /api/auth/verify
Headers: Authorization: Bearer TOKEN
Response: { user }
```

## 🔐 Security Features

- ✅ bcrypt password hashing (10 rounds)
- ✅ JWT tokens (7-day expiry)
- ✅ Google OAuth 2.0
- ✅ SHA-256 token hashing
- ✅ 1-hour reset token expiry
- ✅ CORS protection
- ✅ Environment variables

## 📁 Structure

```
backend/
├── server.js              Main server file
├── package.json           Dependencies
├── .env                   Environment variables (create this)
├── .env.example           Template
├── models/
│   └── User.js           User schema with bcrypt
├── routes/
│   └── auth.js           Authentication routes
└── services/
    └── emailService.js   Email sending
```

## 🗄️ MongoDB Schema

```javascript
User {
  username: String (unique),
  email: String (unique, required),
  password: String (bcrypt hashed),
  googleId: String (optional),
  picture: String (optional),
  resetPasswordToken: String (SHA-256 hashed),
  resetPasswordExpires: Date,
  createdAt: Date,
  lastLogin: Date
}
```

## 📧 Email Configuration

### Gmail:
1. Enable 2-Step Verification
2. Generate App Password
3. Add to `.env`

### SendGrid:
1. Get API key from SendGrid
2. Set `EMAIL_SERVICE=sendgrid`
3. Add API key to `.env`

### Mailtrap (Testing):
1. Sign up at mailtrap.io
2. Get SMTP credentials
3. Add to `.env`

## 🐛 Troubleshooting

**MongoDB connection error?**
- Check if MongoDB is running
- Verify MONGODB_URI in .env

**Email not sending?**
- Check email credentials
- Try Mailtrap for testing

**Google auth failing?**
- Verify Client ID
- Check authorized origins in Google Console

## 📚 Documentation

See root folder for detailed guides:
- `QUICK_START.md` - Quick setup guide
- `GOOGLE_AUTH_SETUP.md` - Google OAuth details
- `PASSWORD_RESET_SETUP.md` - Password reset details
- `MONGODB_BACKEND_SETUP.md` - MongoDB setup

## 🚀 Production Checklist

- [ ] Use MongoDB Atlas (cloud)
- [ ] Strong JWT_SECRET
- [ ] Professional email service (SendGrid)
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Input sanitization
- [ ] Proper logging
- [ ] Error monitoring
- [ ] Backup strategy

---

**Built with ❤️ by JHGNO Team**
