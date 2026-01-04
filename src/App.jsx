import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import SimpleLogin from './components/SimpleLogin';
import ResetPassword from './pages/ResetPassword';
import Layout from '../component.jsx';
import Dashboard from '../PAGE/dashboard.jsx';
import Markets from '../PAGE/markst.jsx';
import Charts from '../PAGE/chart.jsx';
import News from '../PAGE/news.jsx';
import { createPageUrl } from './utils';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const authToken = localStorage.getItem('jhgno_auth_token');
    if (authToken) {
      setIsAuthenticated(true);
    }
    
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // GSAP initial animations
    gsap.fromTo('.app-container', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
    );
  }, []);

  const handleLogin = (credentials) => {
    // Authentication with email or username
    if ((credentials.email || credentials.username) && (credentials.password || credentials.token)) {
      // Token might already be set by login component
      if (!credentials.token) {
        const identifier = credentials.email || credentials.username;
        const token = btoa(`${identifier}:${Date.now()}`);
        localStorage.setItem('jhgno_auth_token', token);
      }
      setIsAuthenticated(true);
      
      // GSAP animation for successful login
      gsap.to('.login-container', {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      });
      
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('jhgno_auth_token');
    setIsAuthenticated(false);
    
    // GSAP animation for logout
    gsap.fromTo('.app-container',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-bold">Loading JHGNO Crypto Tracker...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public route - accessible without authentication */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected routes */}
          <Route path="/*" element={
            <AnimatePresence mode="wait">
              {!isAuthenticated ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SimpleLogin onLogin={handleLogin} />
                </motion.div>
              ) : (
                <motion.div
                  key="app"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Layout onLogout={handleLogout}>
                    <Routes>
                      <Route path="/" element={<Navigate to={createPageUrl("Dashboard")} replace />} />
                      <Route path={createPageUrl("Dashboard")} element={<Dashboard />} />
                      <Route path={createPageUrl("Markets")} element={<Markets />} />
                      <Route path={createPageUrl("Charts")} element={<Charts />} />
                      <Route path={createPageUrl("News")} element={<News />} />
                    </Routes>
                  </Layout>
                </motion.div>
              )}
            </AnimatePresence>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
