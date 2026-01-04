import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import anime from "animejs";
import { Skeleton } from "../src/components/ui/skeleton";
import DetailedCoinCard from "../src/components/DetailedCoinCard";
import PriceCard from "../component/pricecard.jsx";
import MarketStats from "../component/marketstats.jsx";
import CandlestickChart from "../component/candlestickchart.jsx";
import { RefreshCw, AlertCircle, TrendingUp, Activity } from "lucide-react";
import { Button } from "../src/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../src/components/ui/alert";
import { base44 } from "../src/api/base44Client.js";

export default function Dashboard() {
  const [cryptoData, setCryptoData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [marketStats, setMarketStats] = useState({
    totalMarketCap: 0,
    totalVolume: 0,
    btcDominance: 0,
    activeCoins: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);
  const dashboardRef = useRef(null);
  const cardsRef = useRef([]);

  const cryptoIcons = {
    bitcoin: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
    ethereum: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    binancecoin: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    ripple: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
    cardano: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
    dogecoin: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
    polkadot: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png',
    polygon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
    avalanche: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png'
  };

  const cryptoIds = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple', 'cardano', 'dogecoin', 'polkadot', 'polygon', 'avalanche'];

  const fetchCryptoData = async () => {
    try {
      setError(null);
      
      // Use the actual getCryptoData method from base44Client
      const response = await base44.getCryptoData();
      
      if (response && response.coins) {
        const formatted = response.coins.map(coin => ({
          id: coin.id,
          symbol: coin.symbol || '',
          name: coin.name,
          current_price: coin.current_price || 0,
          price_change_percentage_24h: coin.price_change_percentage_24h || 0,
          total_volume: coin.total_volume || 0,
          market_cap: coin.market_cap || 0,
          high_24h: coin.high_24h || coin.current_price * 1.02,
          low_24h: coin.low_24h || coin.current_price * 0.98,
          price: coin.current_price || 0,
          change: coin.price_change_percentage_24h || 0,
          icon: cryptoIcons[coin.id],
          volume: coin.total_volume || 0,
          marketCap: coin.market_cap || 0
        }));
        
        setCryptoData(formatted);
        
        const totalMarketCap = formatted.reduce((sum, coin) => sum + coin.marketCap, 0);
        const totalVolume = formatted.reduce((sum, coin) => sum + coin.volume, 0);
        const btcData = formatted.find(c => c.symbol === 'BTC');
        const btcDominance = btcData ? (btcData.marketCap / totalMarketCap) * 100 : 0;
        
        setMarketStats({
          totalMarketCap,
          totalVolume,
          btcDominance,
          activeCoins: 10000
        });
        
        setLastUpdate(new Date());
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      setError(error.message || 'Failed to fetch crypto data');
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Get the last 50 candlestick data points (OHLC - Open, High, Low, Close) for Bitcoin in the past 24 hours. Each data point should include timestamp, open price, high price, low price, and close price in USD.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  timestamp: { type: "number" },
                  open: { type: "number" },
                  high: { type: "number" },
                  low: { type: "number" },
                  close: { type: "number" }
                }
              }
            }
          }
        }
      });
      
      if (response && response.data) {
        const formatted = response.data.map(item => ({
          time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          open: item.open || 0,
          high: item.high || 0,
          low: item.low || 0,
          close: item.close || 0
        }));
        
        setChartData(formatted);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    fetchChartData();
    
    // GSAP entrance animations
    if (dashboardRef.current) {
      gsap.fromTo(dashboardRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }
    
    // Update prices every half second for more dynamic feel
    const priceInterval = setInterval(() => {
      fetchCryptoData();
    }, 500);
    
    // Update chart every 2 minutes
    const chartInterval = setInterval(() => {
      fetchChartData();
    }, 120000);
    
    return () => {
      clearInterval(priceInterval);
      clearInterval(chartInterval);
    };
  }, []);

  useEffect(() => {
    // Animate cards when data loads
    if (cryptoData.length > 0 && cardsRef.current.length > 0) {
      anime({
        targets: cardsRef.current,
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutExpo'
      });
    }
  }, [cryptoData]);

  const handleManualRefresh = () => {
    setLoading(true);
    fetchCryptoData();
    fetchChartData();
  };

  return (
    <motion.div 
      ref={dashboardRef}
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
              JHGNO Crypto Dashboard
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Real-time cryptocurrency market overview
            </motion.p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 ${error ? 'bg-red-500' : 'bg-green-500'} rounded-full animate-pulse`}></span>
              <span className="text-gray-400 text-sm">
                {error ? 'Disconnected' : 'Live'} • {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleManualRefresh}
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {error && (
          <Alert className="bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-500">Connection Error</AlertTitle>
            <AlertDescription className="text-red-300">
              {error} - Updates paused. Click refresh to try again.
            </AlertDescription>
          </Alert>
        )}

        {loading && cryptoData.length === 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 bg-white/5" />
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-40 bg-white/5" />
              ))}
            </div>
          </>
        ) : (
          <>
            <MarketStats stats={marketStats} />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Live Coin Tracking - 30 Metrics Per Coin</h2>
              
              {/* Fixed position detailed crypto cards with 30 data points each - 10 coins */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {cryptoData.slice(0, 10).map((crypto, index) => (
                  <DetailedCoinCard
                    key={crypto.symbol}
                    coin={crypto}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}