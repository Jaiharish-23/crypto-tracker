import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../src/components/ui/card";
import { Button } from "../src/components/ui/button";
import { Skeleton } from "../src/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../src/components/ui/alert";
import { base44 } from "../src/api/base44Client.js";
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Charts() {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [timeframe, setTimeframe] = useState('7');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [error, setError] = useState(null);

  const cryptoIcons = {
    bitcoin: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
    ethereum: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    binancecoin: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    ripple: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
    cardano: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png'
  };

  const coins = [
    { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: cryptoIcons.bitcoin },
    { value: 'ethereum', label: 'Ethereum (ETH)', icon: cryptoIcons.ethereum },
    { value: 'binancecoin', label: 'Binance Coin (BNB)', icon: cryptoIcons.binancecoin },
    { value: 'solana', label: 'Solana (SOL)', icon: cryptoIcons.solana },
    { value: 'ripple', label: 'Ripple (XRP)', icon: cryptoIcons.ripple },
    { value: 'cardano', label: 'Cardano (ADA)', icon: cryptoIcons.cardano }
  ];

  const timeframes = [
    { value: '1', label: '24 Hours' },
    { value: '7', label: '7 Days' },
    { value: '14', label: '14 Days' },
    { value: '30', label: '30 Days' },
    { value: '90', label: '90 Days' },
    { value: '365', label: '1 Year' }
  ];

  useEffect(() => {
    fetchCurrentPrice();
    fetchChartData();
    
    // Update prices every half second (500ms) for real-time updates
    const priceInterval = setInterval(fetchCurrentPrice, 500);
    const chartInterval = setInterval(fetchChartData, 60000);
    
    return () => {
      clearInterval(priceInterval);
      clearInterval(chartInterval);
    };
  }, [selectedCoin, timeframe]);

  const fetchCurrentPrice = async () => {
    try {
      const response = await base44.getCurrentPrice(selectedCoin);
      
      if (response) {
        setCurrentPrice(response.current_price || 0);
        setPriceChange(response.price_change_24h || 0);
      }
    } catch (error) {
      console.error('Error fetching current price:', error);
    }
  };

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Map coin to Binance symbol
      const coinMapping = {
        'bitcoin': 'BTCUSDT',
        'ethereum': 'ETHUSDT',
        'binancecoin': 'BNBUSDT',
        'solana': 'SOLUSDT',
        'ripple': 'XRPUSDT',
        'cardano': 'ADAUSDT'
      };
      
      // Map timeframe to Binance interval
      const intervalMapping = {
        '1': '1h',
        '7': '4h',
        '14': '8h',
        '30': '1d',
        '90': '3d',
        '365': '1w'
      };
      
      const symbol = coinMapping[selectedCoin] || 'BTCUSDT';
      const interval = intervalMapping[timeframe] || '1h';
      const limit = timeframe === '1' ? 24 : timeframe === '7' ? 42 : 50;
      
      const response = await base44.getChartData(symbol, interval, limit);
      
      if (response && response.data) {
        const formatted = response.data.map((item) => ({
          time: formatTime(item.timestamp, timeframe),
          open: item.open || 0,
          high: item.high || 0,
          low: item.low || 0,
          close: item.close || 0
        }));
        
        setChartData(formatted);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setError(error.message || 'Failed to fetch chart data');
      setLoading(false);
    }
  };

  const formatTime = (timestamp, days) => {
    const date = new Date(timestamp);
    if (days === '1') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (parseInt(days) <= 30) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const CandleBar = (props) => {
    const { x, y, width, height, payload } = props;
    
    if (!payload || !payload.open || !payload.close || !payload.high || !payload.low) {
      return null;
    }

    const isGreen = payload.close > payload.open;
    const color = isGreen ? '#10b981' : '#ef4444';
    
    const scale = height / (payload.high - payload.low);
    const bodyTop = (payload.high - Math.max(payload.open, payload.close)) * scale;
    const bodyHeight = Math.abs(payload.close - payload.open) * scale || 1;
    
    const wickX = x + width / 2;
    
    return (
      <g>
        <line
          x1={wickX}
          y1={y}
          x2={wickX}
          y2={y + height}
          stroke={color}
          strokeWidth={1}
        />
        <rect
          x={x + 1}
          y={y + bodyTop}
          width={width - 2}
          height={bodyHeight}
          fill={color}
          stroke={color}
          strokeWidth={1}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-4 border border-white/20">
          <p className="text-white font-bold text-sm mb-2">{data.time}</p>
          <div className="space-y-1 text-xs">
            <p className="text-green-500">Open: ${(data.open || 0).toFixed(2)}</p>
            <p className="text-blue-500">High: ${(data.high || 0).toFixed(2)}</p>
            <p className="text-red-500">Low: ${(data.low || 0).toFixed(2)}</p>
            <p className="text-purple-500">Close: ${(data.close || 0).toFixed(2)}</p>
          </div>
        </div>
      );
    }
    return null;
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
          className="flex items-center justify-between"
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
              JHGNO Price Charts
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Candlestick charts with live price updates
            </motion.p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 ${error ? 'bg-red-500' : 'bg-green-500'} rounded-full animate-pulse`}></span>
            <span className="text-gray-400 text-sm">{error ? 'Offline' : 'Live Prices'}</span>
          </div>
        </motion.div>

        {error && (
          <Alert className="bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-500">Connection Error</AlertTitle>
            <AlertDescription className="text-red-300">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card className="glass-card p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
              <div className="space-y-2">
                <select 
                  value={selectedCoin} 
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="w-64 bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {coins.map(coin => (
                    <option key={coin.value} value={coin.value} className="bg-gray-900 text-white">
                      {coin.label}
                    </option>
                  ))}
                </select>
              <div className="flex items-center gap-4">
                {currentPrice !== null ? (
                  <>
                    <span className="text-3xl font-bold text-white">
                      ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {priceChange !== null && (
                      <span className={`text-lg font-semibold ${priceChange >= 0 ? 'price-up' : 'price-down'}`}>
                        {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                      </span>
                    )}
                  </>
                ) : (
                  <Skeleton className="h-10 w-48 bg-white/5" />
                )}
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {timeframes.map((tf, index) => (
                <motion.div
                  key={tf.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={timeframe === tf.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeframe(tf.value)}
                    className={`${
                      timeframe === tf.value
                        ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {tf.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-96 bg-white/5" />
          ) : (
            <ResponsiveContainer width="100%" height={500}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${(value || 0).toLocaleString()}`}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="high"
                  fill="#10b981"
                  shape={<CandleBar />}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
          </Card>
        </motion.div>

        {!loading && chartData.length > 0 && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {[
              { label: "Period High", value: Math.max(...chartData.map(d => d.high || 0)), color: "text-green-500" },
              { label: "Period Low", value: Math.min(...chartData.map(d => d.low || 0)), color: "text-red-500" },
              { label: "Average Close", value: chartData.reduce((sum, d) => sum + (d.close || 0), 0) / chartData.length, color: "text-blue-500" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="glass-card p-6 hover:bg-white/5 transition-all duration-300">
                  <h3 className="text-gray-400 text-sm mb-2">{stat.label}</h3>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    ${stat.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}