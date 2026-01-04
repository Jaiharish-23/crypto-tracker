# ✅ SETUP CHECKLIST - Complete This in Order

## 🎯 Follow these steps to get everything working!

---

## ☑️ **1. Backend Setup** (10 minutes)

### Install Dependencies:
```bash
cd backend
npm install
```

**Expected packages:**
- express
- mongoose  
- bcryptjs
- jsonwebtoken
- nodemailer
- google-auth-library
- cors
- dotenv

✅ **Checkpoint:** No errors during installation

---

## ☑️ **2. MongoDB Setup** (5 minutes)

### Choose ONE option:

#### Option A: Local MongoDB
- [ ] Download from: https://www.mongodb.com/try/download/community
- [ ] Install with default settings
- [ ] MongoDB should start automatically
- [ ] Test: Open terminal and type `mongosh` or `mongo`

#### Option B: MongoDB Atlas (Cloud)
- [ ] Sign up: https://www.mongodb.com/cloud/atlas/register
- [ ] Create free cluster
- [ ] Click "Connect" → "Connect your application"
- [ ] Copy connection string

✅ **Checkpoint:** MongoDB is running or Atlas cluster created

---

## ☑️ **3. Environment Variables** (5 minutes)

### Create `backend/.env` file:

```env
# Copy everything below into backend/.env file

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# MongoDB (Choose one)
MONGODB_URI=mongodb://localhost:27017/jhgno_crypto
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jhgno_crypto

# JWT Secret - CHANGE THIS!
JWT_SECRET=jhgno_crypto_super_secret_key_2025_change_in_production

# Google Client ID - Will add later
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com

# Email - Gmail
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
EMAIL_FROM=JHGNO Crypto Tracker <noreply@jhgno.com>
```

- [ ] File created at: `backend/.env`
- [ ] MongoDB URI configured
- [ ] JWT_SECRET changed from default

✅ **Checkpoint:** `.env` file exists in backend folder

---

## ☑️ **4. Gmail App Password** (3 minutes)

### Get App Password:

1. [ ] Go to: https://myaccount.google.com/security
2. [ ] Enable **2-Step Verification** (if not already)
3. [ ] Search for **"App passwords"**
4. [ ] App: **Mail**, Device: **Other (JHGNO)**
5. [ ] Click **Generate**
6. [ ] Copy 16-character password (no spaces)
7. [ ] Paste as `EMAIL_PASS` in `.env`

**Your email in .env should look like:**
```env
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  (← remove spaces: abcdefghijklmnop)
```

✅ **Checkpoint:** Email configured in `.env`

---

## ☑️ **5. Google OAuth Setup** (5 minutes)

### Get Google Client ID:

1. [ ] Go to: https://console.cloud.google.com/
2. [ ] Create project: **JHGNO Crypto Tracker**
3. [ ] **OAuth consent screen:**
   - [ ] Type: External
   - [ ] App name: JHGNO Crypto Tracker
   - [ ] Your email
   - [ ] Save
4. [ ] **Create Credentials** → **OAuth client ID:**
   - [ ] Type: Web application
   - [ ] Name: JHGNO Web Client
   - [ ] Authorized JavaScript origins: `http://localhost:3000`
   - [ ] Create
5. [ ] Copy Client ID (looks like: `123456-abc...apps.googleusercontent.com`)
6. [ ] Update in TWO places:
   - [ ] `backend/.env` → `GOOGLE_CLIENT_ID=...`
   - [ ] `src/components/SimpleLogin.jsx` line 119 → `client_id: '...'`

✅ **Checkpoint:** Google Client ID in both files

---

## ☑️ **6. Start Backend** (1 minute)

```bash
cd backend
npm run dev
```

### You should see:
```
🚀 Server running on port 5000
✅ MongoDB connected successfully
```

### If you see errors:
- **MongoDB error?** → Check MongoDB is running
- **Port in use?** → Kill process on port 5000
- **Module error?** → Run `npm install` again

✅ **Checkpoint:** Backend running without errors

---

## ☑️ **7. Start Frontend** (1 minute)

### Open NEW terminal:

```bash
cd JHGNO_CRYPTO_TRACKER
npm run dev
```

### You should see:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:3000/
```

✅ **Checkpoint:** Frontend running on port 3000

---

## ☑️ **8. Test Authentication** (3 minutes)

### Open browser: http://localhost:3000

#### Test 1: Email/Password Login
- [ ] Enter any email: `test@example.com`
- [ ] Enter any password: `password123`
- [ ] Click **LOGIN WITH EMAIL**
- [ ] Should log you in and show dashboard ✅

#### Test 2: Google Sign-In
- [ ] Click **Sign in with Google** button
- [ ] Select your Google account
- [ ] Should log you in ✅

#### Test 3: Password Reset
- [ ] Click **Forgot password?**
- [ ] Enter your Gmail address (the one in .env)
- [ ] Click **Send Reset Link**
- [ ] Check your email inbox 📧
- [ ] Click reset link in email
- [ ] Enter new password
- [ ] Should redirect to login ✅

✅ **Checkpoint:** All 3 authentication methods work!

---

## 🎉 **SUCCESS CRITERIA**

You're done when:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000  
- ✅ MongoDB connected
- ✅ Email/password login works
- ✅ Google Sign-In works
- ✅ Password reset email received
- ✅ No console errors

---

## 🐛 **Common Issues & Fixes**

### Backend won't start
```bash
cd backend
npm install
# Check if port 5000 is free
# Check .env file exists
```

### MongoDB connection fails
```bash
# Check if MongoDB is running
mongosh  # or mongo

# Or use MongoDB Atlas cloud
```

### Emails not sending
- Check Gmail App Password (16 characters, no spaces)
- Try logging in to Gmail in browser first
- Check spam folder
- Use Mailtrap for testing (no real emails)

### Google button not showing
- Check Client ID is correct in SimpleLogin.jsx
- Open browser console for errors
- Check authorized origins in Google Console

### Port 3000 already in use
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

---

## 📁 **Files You Created**

- [ ] `backend/.env` (YOUR environment variables)
- [ ] Updated `src/components/SimpleLogin.jsx` line 119 (Google Client ID)

## 📁 **Files Already Created for You**

All these files are ready to use:
- ✅ `backend/server.js`
- ✅ `backend/package.json`
- ✅ `backend/models/User.js`
- ✅ `backend/routes/auth.js`
- ✅ `backend/services/emailService.js`
- ✅ `src/components/SimpleLogin.jsx`
- ✅ `src/pages/ResetPassword.jsx`
- ✅ `src/App.jsx` (updated with routes)

---

## 📚 **Documentation Files**

- `QUICK_START.md` - Quick setup guide
- `GOOGLE_AUTH_SETUP.md` - Detailed Google OAuth
- `PASSWORD_RESET_SETUP.md` - Detailed password reset
- `MONGODB_BACKEND_SETUP.md` - Detailed MongoDB setup
- `backend/README.md` - Backend API documentation

---

## ⏱️ **Total Time: ~30 minutes**

- Backend setup: 10 min
- MongoDB: 5 min
- Environment: 5 min
- Gmail: 3 min
- Google OAuth: 5 min
- Testing: 2 min

---

## 🎯 **Next Steps After Setup**

1. Test all features thoroughly
2. Customize email templates
3. Add your branding
4. Deploy to production

---

## 🚀 **Production Ready When:**

- [ ] MongoDB Atlas configured
- [ ] SendGrid email service
- [ ] Strong JWT_SECRET
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Proper error logging

---

**🎉 You're all set! Enjoy your JHGNO Crypto Tracker!** 🚀✨
