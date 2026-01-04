import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "../src/components/ui/card";
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line } from 'recharts';

export default function CandlestickChart({ data, symbol }) {
  const CustomCandlestick = (props) => {
    const { x, y, width, height, open, close, high, low } = props;
    
    const isGreen = close > open;
    const color = isGreen ? '#10b981' : '#ef4444';
    const bodyHeight = Math.abs(close - open);
    const bodyY = isGreen ? y + (height - bodyHeight) : y;
    
    const wickX = x + width / 2;
    const highY = y;
    const lowY = y + height;
    
    return (
      <g>
        {/* High wick */}
        <line
          x1={wickX}
          y1={highY}
          x2={wickX}
          y2={bodyY}
          stroke={color}
          strokeWidth={1}
        />
        {/* Low wick */}
        <line
          x1={wickX}
          x2={wickX}
          y1={bodyY + bodyHeight}
          y2={lowY}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={x}
          y={bodyY}
          width={width}
          height={bodyHeight || 1}
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
            <p className="text-green-500">Open: ${data.open?.toFixed(2)}</p>
            <p className="text-blue-500">High: ${data.high?.toFixed(2)}</p>
            <p className="text-red-500">Low: ${data.low?.toFixed(2)}</p>
            <p className="text-purple-500">Close: ${data.close?.toFixed(2)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CandleBar = (props) => {
    const { x, y, width, height, payload } = props;
    
    if (!payload || !payload.open || !payload.close || !payload.high || !payload.low) {
      return null;
    }

    const isGreen = payload.close > payload.open;
    const color = isGreen ? '#10b981' : '#ef4444';
    
    // Calculate positions relative to the chart's scale
    const scale = height / (payload.high - payload.low);
    const bodyTop = (payload.high - Math.max(payload.open, payload.close)) * scale;
    const bodyHeight = Math.abs(payload.close - payload.open) * scale || 1;
    const wickTop = 0;
    const wickBottom = height;
    
    const wickX = x + width / 2;
    
    return (
      <g>
        {/* High-Low wick */}
        <line
          x1={wickX}
          y1={y + wickTop}
          x2={wickX}
          y2={y + wickBottom}
          stroke={color}
          strokeWidth={1}
        />
        {/* Open-Close body */}
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="glass-card p-6 hover:bg-white/5 transition-all duration-300">
        <motion.h3 
          className="text-white font-bold text-xl mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {symbol} Candlestick Chart
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="high"
                fill="url(#colorPurple)"
                shape={<CandleBar />}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </Card>
    </motion.div>
  );
}