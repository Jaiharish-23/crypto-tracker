# 🔍 WHERE TO SEE USER LOGIN DATA

## 📊 User Data Storage Locations

---

## 1️⃣ **MongoDB Database** (Primary Storage)

### **View in MongoDB Compass (GUI):**

1. **Download MongoDB Compass:**
   - https://www.mongodb.com/try/download/compass
   - Free MongoDB GUI tool

2. **Connect:**
   - Open Compass
   - Connection string: `mongodb://localhost:27017`
   - Click "Connect"

3. **View Users:**
   - Database: `jhgno_crypto`
   - Collection: `users`
   - You'll see all registered users!

### **View in MongoDB Shell:**

```bash
# Open MongoDB shell
mongosh

# Or for older versions
mongo

# Select database
use jhgno_crypto

# View all users
db.users.find().pretty()

# Count users
db.users.countDocuments()

# Find specific user by email
db.users.findOne({ email: "test@example.com" })

# View user fields only (no password hash)
db.users.find({}, { username: 1, email: 1, createdAt: 1, lastLogin: 1 })
```

---

## 2️⃣ **Backend API Endpoints**

### **Get All Users (Create admin endpoint):**

Add to `backend/routes/auth.js`:

```javascript
// 👥 GET ALL USERS (Admin only - for development)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordToken') // Exclude sensitive data
      .sort({ createdAt: -1 });
    
    res.json({ 
      count: users.length,
      users 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

**Test it:**
```bash
# Get all users
curl http://localhost:5000/api/auth/users

# Or open in browser:
# http://localhost:5000/api/auth/users
```

---

## 3️⃣ **Backend Console Logs**

### **Check Terminal Output:**

Look at your backend terminal for logs like:

```
✅ MongoDB connected successfully
✅ Password reset email sent to: user@example.com
✅ Welcome email sent to: newuser@example.com
```

### **Add Custom Logging:**

Add to `backend/routes/auth.js` in login route:

```javascript
// After successful login
console.log('🔐 User logged in:', {
  email: user.email,
  username: user.username,
  loginTime: new Date(),
  lastLogin: user.lastLogin
});
```

---

## 4️⃣ **Browser DevTools (Frontend)**

### **LocalStorage (Client-side):**

1. **Open Browser DevTools:**
   - Press `F12` or `Right-click → Inspect`

2. **Go to Application/Storage Tab:**
   - Expand "Local Storage"
   - Click `http://localhost:3000`

3. **View Stored Data:**
   - `jhgno_auth_token` - JWT token
   - `jhgno_user` - User info (if stored)

### **View in Console:**

Open browser console and type:

```javascript
// View auth token
localStorage.getItem('jhgno_auth_token')

// View user data
localStorage.getItem('jhgno_user')

// Parse user data
JSON.parse(localStorage.getItem('jhgno_user'))

// Decode JWT token (basic)
atob(localStorage.getItem('jhgno_auth_token').split('.')[1])
```

---

## 5️⃣ **Create Admin Dashboard**

### **Quick Admin Page:**

Create `backend/routes/admin.js`:

```javascript
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Simple admin dashboard HTML
router.get('/dashboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordToken')
      .sort({ createdAt: -1 });
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>JHGNO Admin - User List</title>
        <style>
          body { font-family: Arial; padding: 20px; background: #f5f5f5; }
          h1 { color: #667eea; }
          table { width: 100%; background: white; border-collapse: collapse; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #667eea; color: white; }
          tr:hover { background: #f5f5f5; }
          .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .google { background: #4285f4; color: white; }
          .email { background: #34a853; color: white; }
        </style>
      </head>
      <body>
        <h1>👥 JHGNO Crypto Tracker - Users</h1>
        <p><strong>Total Users:</strong> ${users.length}</p>
        <table>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Auth Type</th>
            <th>Created</th>
            <th>Last Login</th>
          </tr>
          ${users.map(user => `
            <tr>
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>
                ${user.googleId 
                  ? '<span class="badge google">Google</span>' 
                  : '<span class="badge email">Email</span>'}
              </td>
              <td>${new Date(user.createdAt).toLocaleString()}</td>
              <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    res.status(500).send('Error loading users');
  }
});

module.exports = router;
```

Add to `backend/server.js`:

```javascript
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);
```

**Access at:** http://localhost:5000/admin/dashboard

---

## 6️⃣ **MongoDB Atlas Web Interface**

If using MongoDB Atlas (cloud):

1. Go to: https://cloud.mongodb.com/
2. Login to your account
3. Click your cluster
4. Click "Browse Collections"
5. Database: `jhgno_crypto`
6. Collection: `users`
7. View all user data!

---

## 📊 **User Data Structure**

```javascript
{
  _id: ObjectId("..."),
  username: "john_doe",
  email: "john@example.com",
  password: "$2a$10$hashed...",        // bcrypt hash (not visible)
  googleId: "123456789",               // If Google user
  picture: "https://...",              // Profile picture URL
  resetPasswordToken: "hashed...",     // If password reset requested
  resetPasswordExpires: Date,          // Token expiry
  createdAt: Date,                     // Registration date
  lastLogin: Date                      // Last login time
}
```

---

## 🔐 **Security Notes**

### **What's Stored:**
- ✅ Username
- ✅ Email
- ✅ Password (bcrypt hashed - safe!)
- ✅ Google ID (if applicable)
- ✅ Profile picture URL
- ✅ Reset token (hashed)
- ✅ Timestamps

### **What's NOT Stored:**
- ❌ Plain text passwords
- ❌ Credit card info
- ❌ Sensitive personal data
- ❌ Unhashed tokens

---

## 🧪 **Quick Test Commands**

### **Check if MongoDB has users:**

```bash
mongosh
use jhgno_crypto
db.users.countDocuments()
db.users.find().pretty()
```

### **Test API endpoint:**

```bash
curl http://localhost:5000/api/auth/users
```

### **Check browser storage:**

```javascript
// In browser console
console.log('Token:', localStorage.getItem('jhgno_auth_token'));
console.log('User:', localStorage.getItem('jhgno_user'));
```

---

## 📱 **Real-Time Monitoring**

### **Watch MongoDB changes:**

```bash
mongosh
use jhgno_crypto
db.users.watch()
```

### **Backend logs:**

Look at your backend terminal - all auth events are logged:
- User registrations
- Login attempts
- Password resets
- Google sign-ins

---

## 🎯 **Recommended Tools**

### **MongoDB GUI Tools:**

1. **MongoDB Compass** (Official)
   - Free, beautiful interface
   - https://www.mongodb.com/try/download/compass

2. **Studio 3T**
   - Free tier available
   - Advanced features

3. **NoSQLBooster**
   - Free for personal use
   - IntelliSense support

### **API Testing:**

1. **Postman**
   - Test API endpoints
   - Save requests

2. **Thunder Client** (VS Code extension)
   - Built into VS Code
   - Lightweight

3. **curl** (Command line)
   - Quick testing
   - Already installed

---

## 📋 **Quick Reference**

| Location | What You See | How to Access |
|----------|--------------|---------------|
| MongoDB | All user records | Compass or mongosh |
| Backend API | User list (JSON) | http://localhost:5000/api/auth/users |
| Backend Terminal | Login events | Check terminal output |
| Browser DevTools | JWT token & user info | F12 → Application → LocalStorage |
| Admin Dashboard | HTML user table | http://localhost:5000/admin/dashboard |

---

## 🚀 **Quick Setup for Admin Dashboard**

1. **Create admin route file** (shown above)
2. **Add to server.js**
3. **Restart backend:** `npm run dev`
4. **Open:** http://localhost:5000/admin/dashboard
5. **See all users!** 👥

---

**Now you can easily view all user login data!** 🎉

**Recommended:** Use MongoDB Compass for the best experience! 🔍
