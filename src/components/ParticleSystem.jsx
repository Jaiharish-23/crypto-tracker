import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const ParticleSystem = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles with crypto-themed colors
    const particleCount = 150;
    const particles = [];
    const cryptoColors = ['#f7931a', '#627eea', '#f3ba2f', '#9945ff', '#e6007a', '#0033ad', '#375bd2', '#8247e5'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 6 + 2;
      const color = cryptoColors[Math.floor(Math.random() * cryptoColors.length)];
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.7 + 0.3};
        pointer-events: none;
        box-shadow: 0 0 ${size * 2}px ${color};
        animation: particle-float ${8 + Math.random() * 4}s linear infinite;
        animation-delay: ${Math.random() * 8}s;
      `;
      
      container.appendChild(particle);
      particles.push(particle);
    }

    // Animate particles
    particles.forEach((particle, index) => {
      const animateParticle = () => {
        anime({
          targets: particle,
          translateX: () => anime.random(-200, 200),
          translateY: () => anime.random(-200, 200),
          scale: [0.5, 1.5, 0.5],
          opacity: [0.2, 0.8, 0.2],
          duration: () => anime.random(3000, 8000),
          easing: 'easeInOutSine',
          complete: animateParticle
        });
      };

      // Start animation with random delay
      setTimeout(animateParticle, index * 50);
    });

    // Cleanup function
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      style={{ zIndex: 1 }}
    />
  );
};

export default ParticleSystem;
