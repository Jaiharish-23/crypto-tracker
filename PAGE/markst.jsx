import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../src/components/ui/card";
import { Input } from "../src/components/ui/input";
import { Button } from "../src/components/ui/button";
import { Search, TrendingUp, TrendingDown, Star, AlertCircle } from "lucide-react";
import { Skeleton } from "../src/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../src/components/ui/alert";
import { base44 } from "../src/api/base44Client.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../src/components/ui/table";

export default function Markets() {
  const [marketData, setMarketData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

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

  // Top 20 cryptocurrencies for market overview
  const cryptoList = [
    'bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple', 'cardano', 
    'dogecoin', 'polkadot', 'polygon', 'avalanche', 'chainlink', 'litecoin',
    'uniswap', 'stellar', 'monero', 'cosmos', 'algorand', 'vechain',
    'filecoin', 'tron'
  ];

  useEffect(() => {
    fetchMarketData();
    // Real-time updates every half second (500ms)
    const interval = setInterval(fetchMarketData, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = marketData.filter(coin => 
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(marketData);
    }
  }, [searchQuery, marketData]);

  const fetchMarketData = async () => {
    try {
      setError(null);
      
      // Use actual getCryptoData method
      const response = await base44.getCryptoData();
      
      if (response && response.coins) {
        const coinData = response.coins.map((coin) => ({
          symbol: (coin.symbol || '').toUpperCase(),
          name: coin.name || 'Unknown',
          price: coin.current_price || 0,
          change24h: coin.price_change_percentage_24h || 0,
          volume: coin.total_volume || 0,
          high24h: coin.high_24h || 0,
          low24h: coin.low_24h || 0,
          icon: cryptoIcons[coin.id] || ''
        }));
        
        // Sort by TOP GAINERS (highest % change first)
        const sortedByGainers = [...coinData].sort((a, b) => b.change24h - a.change24h);
        
        // Add rank after sorting
        const rankedData = sortedByGainers.map((coin, index) => ({
          ...coin,
          rank: index + 1
        }));
        
        setMarketData(rankedData);
        setFilteredData(rankedData);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching market data:', error);
      setError(error.message || 'Failed to fetch market data');
      setLoading(false);
    }
  };

  const toggleFavorite = (symbol) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '$0.00';
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatVolume = (volume) => {
    if (!volume && volume !== 0) return '$0.00B';
    return `$${(volume / 1e9).toFixed(2)}B`;
  };

  const formatChange = (change) => {
    if (!change && change !== 0) return '0.00';
    return change.toFixed(2);
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
              Top 20 Gainers 🚀
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Complete cryptocurrency market overview
            </motion.p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 ${error ? 'bg-red-500' : 'bg-green-500'} rounded-full animate-pulse`}></span>
            <span className="text-gray-400 text-sm">{error ? 'Offline' : 'Live Updates'}</span>
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
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search cryptocurrency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={favorites.length === 0 ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchQuery('')}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                All Coins
              </Button>
              <Button
                variant={favorites.length > 0 ? "default" : "outline"}
                size="sm"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <Star className="w-4 h-4 mr-2" />
                Favorites ({favorites.length})
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-16 bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-gray-400 w-12"></TableHead>
                    <TableHead className="text-gray-400">Rank</TableHead>
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400 text-right">Price</TableHead>
                    <TableHead className="text-gray-400 text-right">24h Change</TableHead>
                    <TableHead className="text-gray-400 text-right">24h Volume</TableHead>
                    <TableHead className="text-gray-400 text-right">24h High</TableHead>
                    <TableHead className="text-gray-400 text-right">24h Low</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((coin, index) => (
                    <motion.tr
                      key={coin.symbol}
                      className="border-white/10 hover:bg-white/5 transition-colors duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)" }}
                    >
                      <TableCell>
                        <button
                          onClick={() => toggleFavorite(coin.symbol)}
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Star 
                            className={`w-5 h-5 ${
                              favorites.includes(coin.symbol) 
                                ? 'fill-yellow-500 text-yellow-500' 
                                : 'text-gray-500'
                            }`}
                          />
                        </button>
                      </TableCell>
                      <TableCell className="text-gray-400 font-medium">#{coin.rank}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img 
                            src={coin.icon || 'https://via.placeholder.com/32'} 
                            alt={coin.name} 
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/32';
                            }}
                          />
                          <div>
                            <p className="text-white font-semibold">{coin.symbol}</p>
                            <p className="text-gray-400 text-sm">{coin.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-white font-semibold">
                        {formatPrice(coin.price)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {coin.change24h >= 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`font-semibold ${coin.change24h >= 0 ? 'price-up' : 'price-down'}`}>
                            {coin.change24h >= 0 ? '+' : ''}{formatChange(coin.change24h)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {formatVolume(coin.volume)}
                      </TableCell>
                      <TableCell className="text-right text-green-500">
                        {formatPrice(coin.high24h)}
                      </TableCell>
                      <TableCell className="text-right text-red-500">
                        {formatPrice(coin.low24h)}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}