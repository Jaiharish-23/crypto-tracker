const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // Gmail configuration
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // App password, not regular password
      }
    });
  }
  
  // SendGrid configuration
  if (process.env.EMAIL_SERVICE === 'sendgrid') {
    return nodemailer.createTransporter({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  }
  
  // Generic SMTP (Mailtrap, custom SMTP, etc.)
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();
  
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'JHGNO Crypto Tracker <noreply@jhgno.com>',
    to: email,
    subject: 'Password Reset Request - JHGNO Crypto Tracker',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            border-radius: 10px 10px 0 0; 
          }
          .header h1 { margin: 0; font-size: 28px; }
          .content { 
            background: #f9f9f9; 
            padding: 40px 30px; 
            border-radius: 0 0 10px 10px; 
          }
          .button { 
            display: inline-block; 
            padding: 15px 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white !important; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            margin: 20px 0; 
            font-size: 16px;
          }
          .button:hover { opacity: 0.9; }
          .link-box { 
            background: #fff; 
            padding: 15px; 
            border-radius: 5px; 
            word-break: break-all; 
            border: 1px solid #ddd;
            margin: 20px 0;
          }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            color: #666; 
            font-size: 12px; 
            padding: 20px;
          }
          .warning { 
            background: #fff3cd; 
            border-left: 4px solid #ffc107; 
            padding: 15px; 
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You requested to reset your password for your <strong>JHGNO Crypto Tracker</strong> account.</p>
            <p>Click the button below to reset your password:</p>
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            <p>Or copy and paste this link into your browser:</p>
            <div class="link-box">
              ${resetUrl}
            </div>
            <div class="warning">
              <strong>⏰ Important:</strong> This link will expire in <strong>1 hour</strong>.
            </div>
            <p>If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
            <p>For security reasons, we never ask for your password via email.</p>
          </div>
          <div class="footer">
            <p><strong>© 2025 JHGNO Crypto Tracker</strong></p>
            <p>All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset Request - JHGNO Crypto Tracker

Hello,

You requested to reset your password for your JHGNO Crypto Tracker account.

Click this link to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this, please ignore this email and your password will remain unchanged.

© 2025 JHGNO Crypto Tracker
This is an automated email, please do not reply.
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent to:', email);
    console.log('📧 Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Send welcome email (optional)
const sendWelcomeEmail = async (email, username) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'JHGNO Crypto Tracker <noreply@jhgno.com>',
    to: email,
    subject: 'Welcome to JHGNO Crypto Tracker! 🚀',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 40px 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to JHGNO Crypto Tracker!</h1>
          </div>
          <div class="content">
            <p>Hi ${username},</p>
            <p>Welcome to <strong>JHGNO Crypto Tracker</strong> - your advanced cryptocurrency tracking platform!</p>
            <p>You can now:</p>
            <ul>
              <li>📊 Track real-time crypto prices</li>
              <li>📈 View detailed market analytics</li>
              <li>📰 Stay updated with crypto news</li>
              <li>💹 Monitor your portfolio performance</li>
            </ul>
            <center>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Start Tracking</a>
            </center>
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>© 2025 JHGNO Crypto Tracker. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    // Don't throw error for welcome email
  }
};

module.exports = { 
  sendPasswordResetEmail,
  sendWelcomeEmail
};
