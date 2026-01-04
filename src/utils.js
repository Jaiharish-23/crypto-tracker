export const createPageUrl = (pageName) => {
  return `/${pageName.toLowerCase()}`;
};

export const formatPrice = (price) => {
  if (!price && price !== 0) return '$0.00';
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatChange = (change) => {
  if (!change && change !== 0) return '0.00';
  return change.toFixed(2);
};

export const formatVolume = (volume) => {
  if (!volume && volume !== 0) return '$0.00B';
  if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
  return `$${volume.toFixed(2)}`;
};

export const generateParticles = (count = 50) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2
    });
  }
  return particles;
};
