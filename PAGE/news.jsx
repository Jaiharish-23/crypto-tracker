import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "../src/components/ui/skeleton";
import { Button } from "../src/components/ui/button";
import { RefreshCw, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../src/components/ui/alert";
import NewsCard from "../component/newcard.jsx";
import { base44 } from "../src/api/base44Client.js";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
    
    // Update news every 9 minutes for NewsData.io
    const interval = setInterval(fetchNews, 540000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastUpdate) {
      const timer = setInterval(() => {
        const next = new Date(lastUpdate.getTime() + 540000);
        setNextUpdate(next);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [lastUpdate]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Fetching crypto news...');
      
      // Use the actual getNewsData method from base44Client
      const response = await base44.getNewsData();
      
      console.log('✅ News response received:', response);
      
      if (response && response.articles) {
        // Always accept articles, even if empty array
        const formattedArticles = response.articles.map(article => ({
          title: article.title || 'Untitled Article',
          description: article.description || 'No description available',
          url: article.url || '#',
          urlToImage: article.image_url || 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
          publishedAt: article.published_at || new Date().toISOString(),
          source: { name: article.source_name || 'Crypto News' }
        }));
        
        console.log('📰 Articles formatted:', formattedArticles.length);
        
        setArticles(formattedArticles);
        setLastUpdate(new Date());
        
        // Only set error if we got zero articles
        if (formattedArticles.length === 0) {
          setError('No news articles available. Check back soon!');
        }
      } else {
        console.error('❌ Invalid response format');
        setError('Unable to load news. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error fetching news:', error);
      setError('Failed to fetch crypto news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getTimeUntilNextUpdate = () => {
    if (!nextUpdate) return '';
    const now = new Date();
    const diff = Math.max(0, Math.floor((nextUpdate - now) / 1000));
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      className="min-h-screen p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div>
            <motion.h1 
              className="text-4xl font-bold gradient-text mb-2"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
            >
              JHGNO Crypto News
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Latest cryptocurrency news and market updates
            </motion.p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {lastUpdate && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                {nextUpdate && (
                  <span className="text-purple-400 ml-2">
                    Next update in: {getTimeUntilNextUpdate()}
                  </span>
                )}
              </div>
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={fetchNews}
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh News
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {error && (
          <Alert className="bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-500">Error Loading News</AlertTitle>
            <AlertDescription className="text-red-300">
              {error}. Click refresh to try again.
            </AlertDescription>
          </Alert>
        )}

        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Latest Headlines</h2>
              <p className="text-gray-400 text-sm">Real-time crypto news from around the world</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 bg-white/5" />
                  <Skeleton className="h-4 bg-white/5" />
                  <Skeleton className="h-4 w-3/4 bg-white/5" />
                </div>
              ))}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <NewsCard article={article} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No news articles available at the moment.</p>
              <Button
                onClick={fetchNews}
                variant="outline"
                className="mt-4 bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Try Again
              </Button>
            </div>
          )}
        </motion.div>

        <motion.div 
          className="glass-card p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">Auto-Refresh Enabled</h3>
              <p className="text-gray-400 text-sm">News updates automatically every 9 minutes</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 ${error ? 'bg-red-500' : 'bg-green-500'} rounded-full animate-pulse`}></span>
              <span className="text-gray-400 text-sm">{error ? 'Offline' : 'Live'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}