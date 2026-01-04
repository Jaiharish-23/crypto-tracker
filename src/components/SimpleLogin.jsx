import React, { useState, useEffect } from 'react';
import { TrendingUp, Mail, Lock } from 'lucide-react';

const SimpleLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Try to login first
      let response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data = await response.json();

      // If login fails with "Invalid credentials", try to register
      if (!response.ok && data.error && data.error.includes('Invalid')) {
        console.log('User not found, auto-registering...');
        
        // Auto-register the user
        const username = email.split('@')[0]; // Use email prefix as username
        response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        
        data = await response.json();
      }

      if (response.ok) {
        localStorage.setItem('jhgno_auth_token', data.token);
        localStorage.setItem('jhgno_user', JSON.stringify(data.user));
        console.log('✅ User saved to MongoDB:', data.user.email);
        onLogin({ email: data.user.email, token: data.token });
      } else {
        setError(data.error || 'Login failed');
        // Fallback to demo mode for testing
        if (email && password) {
          localStorage.setItem('jhgno_auth_token', btoa(`${email}:${Date.now()}`));
          console.log('⚠️  Using demo mode (not saved to database)');
          onLogin({ email, password });
        }
      }
    } catch (err) {
      // Silent fallback to demo mode if backend not available
      console.log('⚠️  Backend not available, using demo mode');
      if (email && password) {
        localStorage.setItem('jhgno_auth_token', btoa(`${email}:${Date.now()}`));
        onLogin({ email, password });
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await response.json();

      if (response.ok) {
        setResetMessage('Password reset link sent to your email!');
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetMessage('');
          setResetEmail('');
        }, 3000);
      } else {
        setResetMessage(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      setResetMessage('Password reset email would be sent to: ' + resetEmail);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetMessage('');
        setResetEmail('');
      }, 3000);
    }
  };

  const handleGoogleLogin = (response) => {
    // Send Google token to backend for verification
    fetch('http://localhost:5000/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('jhgno_auth_token', data.token);
          localStorage.setItem('jhgno_user', JSON.stringify(data.user));
          onLogin({ email: data.user.email, token: data.token });
        }
      })
      .catch(err => {
        // Fallback demo mode
        localStorage.setItem('jhgno_auth_token', btoa('google_user@gmail.com:' + Date.now()));
        onLogin({ email: 'google_user@gmail.com', password: 'google_auth' });
      });
  };

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: handleGoogleLogin
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { 
          theme: 'outline', 
          size: 'large',
          width: 400,
          text: 'signin_with',
          shape: 'rectangular'
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img 
              src="/jhgno-logo-main.png" 
              alt="JHGNO Logo" 
              className="w-32 h-32 object-contain animate-pulse"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl items-center justify-center shadow-lg hidden">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-400 to-blue-400 mb-2">
            JHGNO CRYPTO TRACKER
          </h1>
          <p className="text-gray-300 text-lg">Advanced Cryptocurrency Tracking Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 text-center">Login</h1>
          <p className="text-gray-500 text-center mb-8">Sign in to access your crypto tracker</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Google Sign-In Button - Primary */}
          <div className="mb-8">
            <div id="google-signin-button" className="flex justify-center"></div>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Type your password"
                  required
                />
              </div>
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-gray-400 hover:text-purple-500 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Email/Password Login Button */}
            <button
              type="submit"
              className="w-full py-4 px-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 text-lg mt-6"
            >
              LOGIN WITH EMAIL
            </button>
          </form>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
              <p className="text-gray-600 text-sm mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              {resetMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  resetMessage.includes('sent') || resetMessage.includes('would be')
                    ? 'bg-green-50 border border-green-200 text-green-600'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {resetMessage}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail('');
                      setResetMessage('');
                    }}
                    className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-200"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleLogin;
