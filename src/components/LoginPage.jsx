import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import gsap from 'gsap';
import anime from 'animejs';
import { Eye, EyeOff, Lock, User, TrendingUp } from 'lucide-react';
import ThreeBackground from './ThreeBackground';
import ParticleSystem from './ParticleSystem';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // GSAP animations for login form entrance - with null checks
    const tl = gsap.timeline();
    
    if (titleRef.current) {
      tl.fromTo(titleRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'bounce.out' }
      );
    }
    
    if (formRef.current) {
      tl.fromTo(formRef.current,
        { scale: 0, rotation: 180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' },
        '-=0.5'
      );

      // Anime.js floating animation for the form
      anime({
        targets: formRef.current,
        translateY: [-10, 10],
        duration: 3000,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true
      });
    }

    // Particle animation with delay to ensure elements exist
    setTimeout(() => {
      const particles = document.querySelectorAll('.login-particle');
      particles.forEach((particle, index) => {
        anime({
          targets: particle,
          translateX: () => anime.random(-50, 50),
          translateY: () => anime.random(-50, 50),
          scale: [0.5, 1.5],
          opacity: [0.3, 0.8],
          duration: () => anime.random(2000, 4000),
          delay: index * 100,
          easing: 'easeInOutQuad',
          direction: 'alternate',
          loop: true
        });
      });
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Anime.js loading animation
    anime({
      targets: '.login-button',
      scale: [1, 0.95, 1],
      duration: 200,
      easing: 'easeInOutQuad'
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = onLogin(formData);
    
    if (success) {
      // Success animation
      anime({
        targets: formRef.current,
        scale: [1, 1.1, 0],
        rotate: [0, 360],
        opacity: [1, 0],
        duration: 1000,
        easing: 'easeInBack'
      });
    } else {
      setError('Invalid credentials. Please try again.');
      
      // Error shake animation
      anime({
        targets: formRef.current,
        translateX: [0, -10, 10, -10, 10, 0],
        duration: 500,
        easing: 'easeInOutQuad'
      });
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    
    // Input focus animation
    anime({
      targets: `#${field}-input`,
      scale: [1, 1.05, 1],
      duration: 300,
      easing: 'easeInOutQuad'
    });
  };

  return (
    <div className="login-container relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Simplified Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Simple animated background */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Login Form */}
      <div className="relative z-20 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Title */}
          <div
            ref={titleRef}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold gradient-text">JHGNO CRYPTO</h1>
            </div>
            <p className="text-gray-400">Advanced Cryptocurrency Tracker</p>
          </div>

          {/* Login Form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="login-form space-y-6 bg-black/60 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-2xl"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to access your crypto dashboard</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="username-input"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="login-button w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>

            {/* Skip Login Button for Testing */}
            <motion.button
              type="button"
              onClick={() => onLogin({ username: 'demo', password: 'password' })}
              className="w-full py-2 px-4 bg-gray-600/50 text-gray-300 font-medium rounded-lg hover:bg-gray-600/70 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              Skip Login (Demo Mode)
            </motion.button>

            {/* Helper message (no demo credentials shown) */}
            <div className="text-center text-xs text-gray-400 mt-2">
              Tip: You can also use "Skip Login (Demo Mode)" to preview the app.
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
