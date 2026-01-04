import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "../src/components/ui/card";
import { TrendingUp, DollarSign, Activity, Coins } from "lucide-react";

export default function MarketStats({ stats }) {
  const formatLargeNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  const statItems = [
    {
      title: "Total Market Cap",
      value: `$${formatLargeNumber(stats.totalMarketCap || 0)}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-600/20",
      iconColor: "text-purple-400"
    },
    {
      title: "24h Volume",
      value: `$${formatLargeNumber(stats.totalVolume || 0)}`,
      icon: Activity,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      title: "BTC Dominance",
      value: `${(stats.btcDominance || 0).toFixed(1)}%`,
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-600/20",
      iconColor: "text-orange-400"
    },
    {
      title: "Active Coins",
      value: (stats.activeCoins || 10000).toLocaleString(),
      icon: Coins,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-600/20",
      iconColor: "text-green-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              y: -5,
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <Card className="glass-card p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <motion.p 
                    className="text-gray-400 text-sm font-medium mb-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {stat.title}
                  </motion.p>
                  <motion.p 
                    className="text-2xl font-bold text-white group-hover:scale-105 transition-transform duration-200"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <motion.div 
                  className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                  initial={{ opacity: 0, rotate: -180, scale: 0 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.1 + 0.4,
                    duration: 0.6,
                    type: "spring"
                  }}
                  whileHover={{ rotate: 360 }}
                >
                  <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
                </motion.div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}