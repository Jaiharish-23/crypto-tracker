import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Activity } from 'lucide-react';

const ApiStatus = () => {
  const [status, setStatus] = useState({
    coingecko: 'checking',
    binance: 'checking',
    news: 'checking'
  });

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkApiStatus = async () => {
    // Check CoinGecko
    try {
      const response = await fetch('https://api.binance.com/api/v3/ping');
      setStatus(prev => ({ ...prev, coingecko: response.ok ? 'online' : 'offline' }));
    } catch {
      setStatus(prev => ({ ...prev, coingecko: 'offline' }));
    }

    // Check Binance
    try {
      const response = await fetch('https://api.binance.com/api/v3/ping');
      setStatus(prev => ({ ...prev, binance: response.ok ? 'online' : 'offline' }));
    } catch {
      setStatus(prev => ({ ...prev, binance: 'offline' }));
    }

    // Check News API (RSS2JSON)
    try {
      const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss&count=1');
      setStatus(prev => ({ ...prev, news: response.ok ? 'online' : 'offline' }));
    } catch {
      setStatus(prev => ({ ...prev, news: 'offline' }));
    }
  };

  const getStatusColor = (apiStatus) => {
    switch (apiStatus) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusIcon = (apiStatus) => {
    switch (apiStatus) {
      case 'online': return <Wifi className="w-3 h-3" />;
      case 'offline': return <WifiOff className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3 animate-pulse" />;
    }
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-lg rounded-lg p-3 border border-white/10 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <div className="text-xs text-gray-400 mb-2 font-semibold">API Status</div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={getStatusColor(status.coingecko)}>
            {getStatusIcon(status.coingecko)}
          </span>
          <span className="text-xs text-gray-300">CoinGecko</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={getStatusColor(status.binance)}>
            {getStatusIcon(status.binance)}
          </span>
          <span className="text-xs text-gray-300">Binance</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={getStatusColor(status.news)}>
            {getStatusIcon(status.news)}
          </span>
          <span className="text-xs text-gray-300">News</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ApiStatus;
