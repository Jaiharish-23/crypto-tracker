# 🔐 Google Authentication Setup Guide

## Complete Guide for Email/Password + Google Sign-In

This guide will help you set up **Google OAuth 2.0** authentication alongside email/password login.

---

## 📋 **What You'll Get:**

- ✅ Email/Password authentication
- ✅ Google Sign-In button
- ✅ Secure token-based sessions
- ✅ MongoDB user storage
- ✅ Automatic user creation from Google

---

## 🚀 **Step 1: Get Google OAuth Credentials**

### **1.1 Go to Google Cloud Console**
https://console.cloud.google.com/

### **1.2 Create New Project**
1. Click **"Select a project"** → **"New Project"**
2. Project name: **JHGNO Crypto Tracker**
3. Click **"Create"**

### **1.3 Enable Google+ API**
1. Go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click **"Enable"**

### **1.4 Configure OAuth Consent Screen**
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Select **"External"** → Click **"Create"**
3. Fill in:
   - **App name:** JHGNO Crypto Tracker
   - **User support email:** your@email.com
   - **Developer contact:** your@email.com
4. Click **"Save and Continue"**
5. Skip **Scopes** → Click **"Save and Continue"**
6. Skip **Test users** → Click **"Save and Continue"**
7. Click **"Back to Dashboard"**

### **1.5 Create OAuth Client ID**
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: **JHGNO Web Client**
5. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   http://localhost:5000
   ```
6. **Authorized redirect URIs:**
   ```
   http://localhost:3000
   http://localhost:5000/api/auth/google/callback
   ```
7. Click **"Create"**
8. **SAVE YOUR CLIENT ID!** (looks like: `123456789-abc...apps.googleusercontent.com`)

---

## 🔧 **Step 2: Update Frontend**

### **2.1 Update SimpleLogin.jsx**

Replace line 75 with your actual Client ID:

```javascript
client_id: 'YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com',
```

Example:
```javascript
client_id: '123456789-abc123def456.apps.googleusercontent.com',
```

### **2.2 The Google button will render automatically**

The script loads Google's Sign-In library and renders the button in the `#google-signin-button` div.

---

## 🗄️ **Step 3: Update Backend**

### **3.1 Install Google Auth Library**

```bash
cd backend
npm install google-auth-library
```

### **3.2 Update .env file**

Add your Google Client ID:

```env
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
```

### **3.3 Create Google Auth Route**

Add to `backend/routes/auth.js`:

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔐 GOOGLE SIGN-IN
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user from Google account
      user = new User({
        username: email.split('@')[0], // Use email prefix as username
        email,
        password: Math.random().toString(36), // Random password (won't be used)
        googleId,
        picture
      });
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        picture: user.picture || picture
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ error: 'Google authentication failed' });
  }
});
```

### **3.4 Update User Model**

Add to `backend/models/User.js`:

```javascript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  googleId: {  // ← ADD THIS
    type: String,
    sparse: true,
    unique: true
  },
  picture: {   // ← ADD THIS
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});
```

---

## 🔄 **Step 4: How It Works**

### **Email/Password Flow:**
```
1. User enters email & password
   ↓
2. POST /api/auth/login
   ↓
3. Backend verifies with bcrypt
   ↓
4. Returns JWT token
   ↓
5. Frontend stores token
   ↓
6. User logged in! ✅
```

### **Google Sign-In Flow:**
```
1. User clicks "Sign in with Google"
   ↓
2. Google popup appears
   ↓
3. User selects Google account
   ↓
4. Google returns credential token
   ↓
5. Frontend sends token to backend
   ↓
6. Backend verifies with Google
   ↓
7. Backend creates/finds user
   ↓
8. Returns JWT token
   ↓
9. Frontend stores token
   ↓
10. User logged in! ✅
```

---

## 📝 **Step 5: Start Everything**

### **5.1 Start Backend**
```bash
cd backend
npm run dev
```

### **5.2 Start Frontend**
```bash
cd ..  # back to JHGNO_CRYPTO_TRACKER
npm run dev
```

### **5.3 Test Login**

**Option 1: Email/Password**
- Email: `demo@jhgno.com`
- Password: `password`

**Option 2: Google Sign-In**
- Click the Google button
- Select your Google account
- Automatic login!

---

## ✅ **Features Included:**

### **Email/Password:**
- ✅ bcrypt password hashing
- ✅ JWT token generation
- ✅ Secure password storage
- ✅ Email validation

### **Google Sign-In:**
- ✅ Official Google OAuth 2.0
- ✅ Secure token verification
- ✅ Automatic user creation
- ✅ Profile picture support
- ✅ No password required
- ✅ One-click login

---

## 🔒 **Security Features:**

1. **Passwords encrypted with bcrypt** (10 salt rounds)
2. **Google tokens verified server-side**
3. **JWT tokens** for session management
4. **Email validation**
5. **CORS protection**
6. **Unique email enforcement**
7. **Secure credential handling**

---

## 🐛 **Troubleshooting:**

### **Google button not showing?**
- Check browser console for errors
- Verify Client ID is correct
- Make sure script loaded: `window.google`
- Check authorized origins in Google Console

### **"Invalid Client" error?**
- Client ID doesn't match
- Update .env with correct ID
- Restart backend server

### **Login works but no user data?**
- Check MongoDB connection
- Verify User model has googleId field
- Check backend logs

---

## 📊 **Database Schema:**

```javascript
{
  _id: ObjectId,
  username: "john_doe",
  email: "john@gmail.com",
  password: "$2a$10$hashed...",  // bcrypt hash
  googleId: "123456789",          // Google user ID
  picture: "https://...",         // Google profile pic
  createdAt: "2025-10-19T...",
  lastLogin: "2025-10-19T..."
}
```

---

## 🚀 **Production Deployment:**

### **Update Authorized Origins:**
```
https://yourdomain.com
https://api.yourdomain.com
```

### **Update .env:**
```env
GOOGLE_CLIENT_ID=your_production_client_id
FRONTEND_URL=https://yourdomain.com
```

### **Use HTTPS:**
Google OAuth requires HTTPS in production!

---

## 📱 **Testing:**

### **Test Email Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@jhgno.com","password":"password"}'
```

### **Test Google Login:**
Click the Google button in the frontend and select an account.

---

## ✅ **Checklist:**

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Client ID obtained
- [ ] Frontend updated with Client ID
- [ ] Backend google-auth-library installed
- [ ] Google auth route added
- [ ] User model updated (googleId, picture fields)
- [ ] .env updated with GOOGLE_CLIENT_ID
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Tested email/password login
- [ ] Tested Google Sign-In

---

**Your JHGNO Crypto Tracker now has professional-grade authentication with both email/password and Google Sign-In!** 🔐✨

## 📞 **Support:**

If you encounter issues:
1. Check browser console
2. Check backend logs
3. Verify all credentials in .env
4. Ensure MongoDB is running
5. Test with demo credentials first

---

**Happy coding!** 🚀
