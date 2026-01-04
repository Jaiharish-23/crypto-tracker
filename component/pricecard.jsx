import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "../src/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function PriceCard({ symbol, name, price, change, icon }) {
  const isPositive = change >= 0;
  
  const formatPrice = (value) => {
    if (!value && value !== 0) return '0.00';
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatChange = (value) => {
    if (!value && value !== 0) return '0.00';
    return value.toFixed(2);
  };
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        y: -5,
        boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group overflow-hidden relative">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={false}
        />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon && (
                <motion.img 
                  src={icon} 
                  alt={name} 
                  className="w-10 h-10 rounded-full"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              <div>
                <motion.h3 
                  className="font-bold text-white text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {symbol}
                </motion.h3>
                <motion.p 
                  className="text-gray-400 text-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {name}
                </motion.p>
              </div>
            </div>
            <motion.div
              animate={{ 
                rotate: isPositive ? 0 : 180,
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 0.3 }}
            >
              {isPositive ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
            </motion.div>
          </div>
          
          <div className="space-y-2">
            <motion.p 
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              ${formatPrice(price)}
            </motion.p>
            <div className="flex items-center gap-2">
              <motion.span 
                className={`text-sm font-semibold ${isPositive ? 'price-up' : 'price-down'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                {isPositive ? '+' : ''}{formatChange(change)}%
              </motion.span>
              <span className="text-gray-500 text-xs">24h</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}