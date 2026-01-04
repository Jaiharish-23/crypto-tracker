const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 👥 GET ALL USERS - JHGNO Style Admin Dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordToken')
      .sort({ createdAt: -1 });
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>JHGNO Crypto Tracker - User Dashboard</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
            min-height: 100vh;
            padding: 40px 20px;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          }
          .header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
          }
          .header-icon {
            width: 32px;
            height: 32px;
            background: #6366f1;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
          }
          h1 { 
            color: #6366f1; 
            font-size: 28px;
            font-weight: 700;
          }
          .subtitle {
            color: #64748b;
            margin-bottom: 30px;
            font-size: 14px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }
          .stat-card {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          }
          .stat-card h3 {
            font-size: 13px;
            font-weight: 600;
            opacity: 0.9;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .stat-card p {
            font-size: 36px;
            font-weight: 700;
          }
          .refresh-btn {
            background: #6366f1;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
            transition: all 0.2s;
          }
          .refresh-btn:hover {
            background: #4f46e5;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          }
          .table-container {
            overflow-x: auto;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
          }
          th, td { 
            padding: 16px;
            text-align: left;
          }
          th { 
            background: #f9fafb;
            color: #374151;
            font-weight: 600;
            font-size: 13px;
            border-bottom: 2px solid #e5e7eb;
          }
          td {
            border-bottom: 1px solid #f3f4f6;
            color: #1f2937;
            font-size: 14px;
          }
          tr:last-child td {
            border-bottom: none;
          }
          tr:hover td {
            background: #f9fafb;
          }
          .user-cell {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .user-icon {
            width: 36px;
            height: 36px;
            background: #6366f1;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            font-weight: 600;
          }
          .badge { 
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .google { background: #4285f4; color: white; }
          .email { background: #22c55e; color: white; }
          .never {
            color: #ef4444;
            font-weight: 500;
          }
          .timestamp {
            color: #6b7280;
            font-size: 13px;
          }
          .user-id {
            font-family: 'Courier New', monospace;
            color: #9ca3af;
            font-size: 11px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
          }
          .footer-icon {
            color: #f59e0b;
          }
          .no-users {
            text-align: center;
            padding: 60px 20px;
            color: #9ca3af;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-icon">👥</div>
            <h1>JHGNO Crypto Tracker - User Dashboard</h1>
          </div>
          <p class="subtitle">Real time user management and monitoring</p>
          
          <div class="stats">
            <div class="stat-card">
              <h3>Total Users</h3>
              <p>${users.length}</p>
            </div>
            <div class="stat-card">
              <h3>Google Users</h3>
              <p>${users.filter(u => u.googleId).length}</p>
            </div>
            <div class="stat-card">
              <h3>Email Users</h3>
              <p>${users.filter(u => !u.googleId).length}</p>
            </div>
          </div>

          ${users.length === 0 ? `
            <div class="no-users">
              <h2>No users yet</h2>
              <p>Users will appear here when they register</p>
              <button class="refresh-btn" onclick="location.reload()">Refresh</button>
            </div>
          ` : `
            <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Auth Type</th>
                    <th>Created</th>
                    <th>Last Login</th>
                    <th>User ID</th>
                  </tr>
                </thead>
                <tbody>
                  ${users.map(user => `
                    <tr>
                      <td>
                        <div class="user-cell">
                          <div class="user-icon">👤</div>
                          <strong>${user.username}</strong>
                        </div>
                      </td>
                      <td>${user.email}</td>
                      <td>
                        ${user.googleId 
                          ? '<span class="badge google">📧 Email</span>' 
                          : '<span class="badge email">📧 Email</span>'}
                      </td>
                      <td class="timestamp">${new Date(user.createdAt).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})} ${new Date(user.createdAt).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}</td>
                      <td class="${user.lastLogin ? 'timestamp' : 'never'}">
                        ${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '✖ Never'}
                      </td>
                      <td class="user-id">${user._id.toString().slice(-6)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
          
          <div class="footer">
            <span class="footer-icon">🔒</span>
            <span>Passwords are encrypted with bcrypt • Last updated: ${new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})} ${new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true})}</span>
          </div>
        </div>

        <script>
          // Auto-refresh every 30 seconds
          setTimeout(() => location.reload(), 30000);
        </script>
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial; padding: 40px; text-align: center;">
          <h1 style="color: red;">❌ Error Loading Users</h1>
          <p>${error.message}</p>
          <p>Make sure MongoDB is connected</p>
          <button onclick="location.reload()" style="padding: 12px 24px; margin-top: 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">Retry</button>
        </body>
      </html>
    `);
  }
});

// 📊 GET ALL USERS - JSON API
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -resetPasswordToken')
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true,
      count: users.length,
      users,
      stats: {
        total: users.length,
        googleUsers: users.filter(u => u.googleId).length,
        emailUsers: users.filter(u => !u.googleId).length
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch users' 
    });
  }
});

module.exports = router;
