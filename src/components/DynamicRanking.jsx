import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Crown } from 'lucide-react';
import SmoothPrice from './SmoothPrice';

const DynamicRanking = ({ cryptoData }) => {
  const [sortedCoins, setSortedCoins] = useState([]);

  useEffect(() => {
    // Sort by price change percentage (biggest movers)
    const sorted = [...cryptoData].sort((a, b) => 
      Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h)
    );
    setSortedCoins(sorted);
  }, [cryptoData]);

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-bold text-white">Top Movers</h3>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedCoins.slice(0, 6).map((coin, index) => {
            // Ensure values are valid numbers
            const priceChange = typeof coin.price_change_percentage_24h === 'number' 
              ? coin.price_change_percentage_24h 
              : 0;
            const currentPrice = typeof coin.current_price === 'number' 
              ? coin.current_price 
              : 0;
            
            const isPositive = priceChange >= 0;
            
            return (
              <motion.div
                key={coin.symbol}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  layout: { duration: 0.3, ease: "easeInOut" },
                  opacity: { duration: 0.2 }
                }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-xs ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-700 text-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div>
                    <div className="text-white font-semibold text-sm">{coin.symbol}</div>
                    <div className="text-gray-400 text-xs">{coin.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <SmoothPrice 
                      value={Math.abs(priceChange)}
                      prefix=""
                      suffix="%"
                      decimals={2}
                      className="font-bold text-sm"
                    />
                  </div>
                  <SmoothPrice 
                    value={currentPrice}
                    className="text-gray-400 text-xs"
                    decimals={2}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="text-xs text-gray-400 text-center">
          Rankings update every 0.5s
        </div>
      </div>
    </div>
  );
};

export default DynamicRanking;
