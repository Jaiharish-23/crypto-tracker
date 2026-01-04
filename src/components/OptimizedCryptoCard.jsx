import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import SmoothPrice from './SmoothPrice';

const OptimizedCryptoCard = memo(({ coin, index }) => {
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
  
  const isPositive = priceChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-lg p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">{coin.symbol}</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">{coin.name}</h3>
            <p className="text-gray-400 text-sm">{coin.symbol}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
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
            className="font-semibold"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Price</span>
          <SmoothPrice 
            value={currentPrice}
            className="text-white font-bold text-lg"
            decimals={2}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Market Cap</span>
          <SmoothPrice 
            value={marketCap}
            className="text-gray-300 text-sm"
            decimals={0}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Volume (24h)</span>
          <SmoothPrice 
            value={volume}
            className="text-gray-300 text-sm"
            decimals={0}
          />
        </div>
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

OptimizedCryptoCard.displayName = 'OptimizedCryptoCard';

export default OptimizedCryptoCard;
