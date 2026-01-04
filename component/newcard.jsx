import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "../src/components/ui/card";
import { ExternalLink, Clock } from "lucide-react";

export default function NewsCard({ article }) {
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'Just now';
  };

  const handleClick = () => {
    if (article.url && article.url !== '#') {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className="glass-card overflow-hidden hover:bg-white/10 transition-all duration-300 group cursor-pointer"
      onClick={handleClick}
    >
      {article.urlToImage && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.urlToImage} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
          <Clock className="w-3 h-3" />
          <span>{timeAgo(article.publishedAt)}</span>
          {article.source?.name && (
            <>
              <span>•</span>
              <span>{article.source.name}</span>
            </>
          )}
        </div>
        <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors duration-200">
          {article.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-3 mb-4">
          {article.description}
        </p>
        <div
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium cursor-pointer"
        >
          <span className="flex items-center gap-2">
            Read More <ExternalLink className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Card>
  );
}