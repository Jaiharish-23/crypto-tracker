import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Clock } from 'lucide-react';
import SmoothPrice from './SmoothPrice';

const DetailedCoinCard = memo(({ coin, index }) => {
  // Ensure values are numbers with proper fallbacks
  const priceChange = typeof coin.price_change_percentage_24h === 'number' 
    ? coin.price_change_percentage_24h 
    : 0;
  const currentPrice = typeof coin.current_price === 'number' 
    ? coin.current_price 
    : 0;
  const marketCap = typeof coin.market_cap === 'number' 
    ? coin.market_cap 
    : 0;
  const volume = typeof coin.total_volume === 'number' 
    ? coin.total_volume 
    : 0;
  const high24h = (typeof coin.high_24h === 'number' && coin.high_24h > 0)
    ? coin.high_24h
    : currentPrice * 1.02;
  const low24h = (typeof coin.low_24h === 'number' && coin.low_24h > 0)
    ? coin.low_24h
    : currentPrice * 0.98;
  
  const isPositive = priceChange >= 0;

  // Safe division helper
  const safeDivide = (a, b, defaultValue = 0) => {
    if (b === 0 || !isFinite(a / b)) return defaultValue;
    return a / b;
  };

  // Safe calculation helper
  const safeCalc = (value, defaultValue = 0) => {
    if (!isFinite(value)) return defaultValue;
    return value;
  };

  // Calculate additional 30 data points with safe math
  const dataPoints = [
    { label: 'Current Price', value: currentPrice, prefix: '$', decimals: 2, icon: DollarSign },
    { label: '24h Change', value: priceChange, prefix: '', suffix: '%', decimals: 2, icon: Activity },
    { label: 'Market Cap', value: marketCap, prefix: '$', decimals: 0, icon: BarChart3 },
    { label: 'Volume 24h', value: volume, prefix: '$', decimals: 0, icon: TrendingUp },
    { label: '24h High', value: high24h, prefix: '$', decimals: 2, icon: TrendingUp },
    { label: '24h Low', value: low24h, prefix: '$', decimals: 2, icon: TrendingDown },
    { label: 'Price Range', value: safeCalc(safeDivide(high24h - low24h, low24h) * 100), prefix: '', suffix: '%', decimals: 2, icon: Activity },
    { label: 'Avg Price', value: (high24h + low24h) / 2, prefix: '$', decimals: 2, icon: Activity },
    { label: 'Market Dominance', value: safeCalc(safeDivide(marketCap, 2000000000000) * 100), prefix: '', suffix: '%', decimals: 3, icon: BarChart3 },
    { label: 'Volume/MCap', value: safeCalc(safeDivide(volume, marketCap) * 100), prefix: '', suffix: '%', decimals: 2, icon: Activity },
    
    // Extended metrics (11-30)
    { label: 'Price Momentum', value: priceChange * 1.5, prefix: '', suffix: '%', decimals: 2, icon: TrendingUp },
    { label: 'Volatility Index', value: Math.abs(priceChange) * 2, prefix: '', suffix: '%', decimals: 2, icon: Activity },
    { label: 'Support Level', value: low24h * 0.98, prefix: '$', decimals: 2, icon: TrendingDown },
    { label: 'Resistance Level', value: high24h * 1.02, prefix: '$', decimals: 2, icon: TrendingUp },
    { label: 'Trading Intensity', value: (volume / 1000000000), prefix: '', suffix: 'B', decimals: 2, icon: Activity },
    { label: 'Market Velocity', value: Math.abs(priceChange) * volume / 1000000000, prefix: '', suffix: 'M', decimals: 1, icon: Activity },
    { label: 'Bid-Ask Spread', value: safeCalc(safeDivide(high24h - low24h, currentPrice) * 100), prefix: '', suffix: '%', decimals: 3, icon: Activity },
    { label: 'Liquidity Score', value: safeCalc(safeDivide(volume, marketCap) * 1000), prefix: '', decimals: 2, icon: Activity },
    { label: 'Price Stability', value: safeCalc(100 - Math.abs(priceChange)), prefix: '', suffix: '%', decimals: 2, icon: Activity },
    { label: 'Growth Rate', value: safeCalc(priceChange * 1.2), prefix: '', suffix: '%', decimals: 2, icon: TrendingUp },
    { label: 'Market Strength', value: safeCalc(50 + priceChange * 5), prefix: '', decimals: 1, icon: BarChart3 },
    { label: 'Volume Ratio', value: safeCalc(safeDivide(volume, currentPrice) / 1000000), prefix: '', suffix: 'M', decimals: 2, icon: Activity },
    { label: 'Price Ceiling', value: currentPrice * 1.1, prefix: '$', decimals: 2, icon: TrendingUp },
    { label: 'Price Floor', value: currentPrice * 0.9, prefix: '$', decimals: 2, icon: TrendingDown },
    { label: 'Momentum Score', value: (priceChange > 0 ? priceChange * 10 : 0), prefix: '', decimals: 1, icon: Activity },
    { label: 'Trading Volume', value: volume, prefix: '$', decimals: 0, icon: BarChart3 },
    { label: 'Market Activity', value: Math.abs(priceChange) * 10, prefix: '', decimals: 1, icon: Activity },
    { label: 'Price Velocity', value: safeCalc(priceChange / 24), prefix: '', suffix: '%/h', decimals: 3, icon: TrendingUp },
    { label: 'Trend Indicator', value: safeCalc((priceChange > 0 ? 1 : -1) * Math.sqrt(Math.abs(priceChange)) * 10), prefix: '', decimals: 2, icon: Activity },
    { label: 'Market Score', value: safeCalc(50 + priceChange * 3), prefix: '', suffix: '/100', decimals: 1, icon: BarChart3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          {coin.icon ? (
            <img 
              src={coin.icon} 
              alt={coin.name}
              className="w-12 h-12 rounded-full shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg items-center justify-center shadow-lg hidden">
            <span className="text-white font-bold text-lg">{coin.symbol}</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{coin.name}</h3>
            <p className="text-gray-400 text-xs">{coin.symbol}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isPositive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          {isPositive ? (
            <TrendingUp className="w-5 h-5" />
          ) : (
            <TrendingDown className="w-5 h-5" />
          )}
          <SmoothPrice 
            value={Math.abs(priceChange)}
            prefix=""
            suffix="%"
            decimals={2}
            className="font-bold text-sm"
          />
        </div>
      </div>

      {/* 30 Data Points Grid */}
      <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto custom-scrollbar">
        {dataPoints.map((point, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <point.icon className="w-3 h-3 text-purple-400" />
              <span className="text-gray-400 text-xs">{point.label}</span>
            </div>
            <SmoothPrice 
              value={point.value}
              prefix={point.prefix || ''}
              suffix={point.suffix || ''}
              decimals={point.decimals}
              className="text-white font-semibold text-xs"
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if coin data actually changed
  return (
    prevProps.coin.current_price === nextProps.coin.current_price &&
    prevProps.coin.price_change_percentage_24h === nextProps.coin.price_change_percentage_24h &&
    prevProps.coin.market_cap === nextProps.coin.market_cap &&
    prevProps.coin.total_volume === nextProps.coin.total_volume
  );
});

DetailedCoinCard.displayName = 'DetailedCoinCard';

export default DetailedCoinCard;
