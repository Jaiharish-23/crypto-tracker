# 🔐 MongoDB Backend Setup with Encryption

## Complete Guide for Secure Authentication

This guide will help you set up a **Node.js/Express backend** with **MongoDB** and **bcrypt encryption** for secure user authentication.

---

## 📋 **Prerequisites**

- Node.js installed (v16+)
- MongoDB installed locally OR MongoDB Atlas account
- Your current React frontend

---

## 🚀 **Step 1: Create Backend Folder**

```bash
cd c:\Users\admin\Downloads\JHGNO_CRYPTO_TRACKER
mkdir backend
cd backend
npm init -y
```

---

## 📦 **Step 2: Install Dependencies**

```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv cors
npm install --save-dev nodemon
```

### **Package Explanations:**
- `express` - Web server framework
- `mongoose` - MongoDB ORM
- `bcryptjs` - Password encryption
- `jsonwebtoken` - JWT tokens for sessions
- `dotenv` - Environment variables
- `cors` - Enable frontend communication

---

## 📁 **Step 3: Create Backend Structure**

```
backend/
├── server.js          ← Main server file
├── .env              ← Environment variables (SECRET!)
├── models/
│   └── User.js       ← User schema with encryption
├── routes/
│   └── auth.js       ← Authentication routes
└── middleware/
    └── auth.js       ← JWT verification middleware
```

---

## 🔧 **Step 4: Configure Environment Variables**

Create `.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/jhgno_crypto
# For MongoDB Atlas use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jhgno_crypto

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

# Server Port
PORT=5000

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**⚠️ IMPORTANT:** Never commit `.env` to Git! Add it to `.gitignore`

---

## 📄 **Step 5: Create User Model** 

`backend/models/User.js`:

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// 🔐 ENCRYPT PASSWORD BEFORE SAVING
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt (10 rounds is secure and fast)
    const salt = await bcrypt.genSalt(10);
    
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
  } catch (error) {
    next(error);
  }
});

// 🔓 METHOD TO VERIFY PASSWORD
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Hide password in JSON responses
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
```

---

## 🛣️ **Step 6: Create Authentication Routes**

`backend/routes/auth.js`:

```javascript
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 📝 REGISTER NEW USER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this email or username' 
      });
    }

    // Create new user (password auto-encrypted by pre-save hook)
    const user = new User({ username, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// 🔐 LOGIN USER
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password using bcrypt
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ✅ VERIFY TOKEN
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
```

---

## 🌐 **Step 7: Create Main Server File**

`backend/server.js`:

```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## ▶️ **Step 8: Update package.json Scripts**

Add to `backend/package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## 🏃 **Step 9: Start Backend Server**

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB connected successfully
```

---

## 🔗 **Step 10: Update Frontend to Use Backend**

Update `src/App.jsx`:

```javascript
const handleLogin = async (credentials) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('jhgno_auth_token', data.token);
      localStorage.setItem('jhgno_user', JSON.stringify(data.user));
      setIsAuthenticated(true);
      return true;
    } else {
      alert(data.error || 'Login failed');
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Server connection failed');
    return false;
  }
};
```

---

## 🔐 **Security Features Included:**

✅ **Passwords encrypted with bcrypt** (10 salt rounds)
✅ **JWT tokens** for secure sessions
✅ **Passwords never stored in plain text**
✅ **Passwords hidden in API responses**
✅ **Input validation** on username/email/password
✅ **CORS protection**
✅ **Unique username and email** enforcement

---

## 📊 **MongoDB Atlas Setup** (Cloud Option)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Update `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jhgno_crypto
```

---

## ✅ **Testing Your Backend**

### Test Registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

---

**Your JHGNO Crypto Tracker now has enterprise-grade authentication with MongoDB and bcrypt encryption!** 🔐✨
