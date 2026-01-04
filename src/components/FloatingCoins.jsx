import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const FloatingCoins = () => {
  const groupRef = useRef();
  
  // Crypto coin data with colors and symbols
  const cryptoCoins = useMemo(() => {
    const coins = [
      { symbol: 'BTC', color: '#f7931a', size: 0.8 },
      { symbol: 'ETH', color: '#627eea', size: 0.7 },
      { symbol: 'BNB', color: '#f3ba2f', size: 0.6 },
      { symbol: 'SOL', color: '#9945ff', size: 0.6 },
      { symbol: 'XRP', color: '#23292f', size: 0.5 },
      { symbol: 'ADA', color: '#0033ad', size: 0.5 },
      { symbol: 'DOT', color: '#e6007a', size: 0.5 },
      { symbol: 'MATIC', color: '#8247e5', size: 0.4 },
      { symbol: 'AVAX', color: '#e84142', size: 0.4 },
      { symbol: 'LINK', color: '#375bd2', size: 0.4 }
    ];
    
    return Array.from({ length: 25 }, (_, i) => {
      const coin = coins[i % coins.length];
      return {
        ...coin,
        id: i,
        position: [
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ],
        rotationSpeed: [
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ],
        floatSpeed: Math.random() * 0.5 + 0.2,
        floatOffset: Math.random() * Math.PI * 2
      };
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Rotate the entire group slowly
      groupRef.current.rotation.y = time * 0.1;
      
      // Animate individual coins
      groupRef.current.children.forEach((coinGroup, index) => {
        const coin = cryptoCoins[index];
        if (coinGroup && coin) {
          // Floating motion
          coinGroup.position.y = coin.position[1] + Math.sin(time * coin.floatSpeed + coin.floatOffset) * 2;
          coinGroup.position.x = coin.position[0] + Math.cos(time * coin.floatSpeed * 0.5 + coin.floatOffset) * 1;
          
          // Rotation animation
          coinGroup.rotation.x += coin.rotationSpeed[0];
          coinGroup.rotation.y += coin.rotationSpeed[1];
          coinGroup.rotation.z += coin.rotationSpeed[2];
          
          // Pulsing scale effect
          const scale = 1 + Math.sin(time * 2 + coin.floatOffset) * 0.1;
          coinGroup.scale.setScalar(scale);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {cryptoCoins.map((coin) => (
        <CryptoCoin key={coin.id} coin={coin} />
      ))}
    </group>
  );
};

const CryptoCoin = ({ coin }) => {
  const coinRef = useRef();
  
  return (
    <group ref={coinRef} position={coin.position}>
      {/* Coin base - cylinder shape */}
      <mesh>
        <cylinderGeometry args={[coin.size, coin.size, 0.2, 32]} />
        <meshStandardMaterial
          color={coin.color}
          metalness={0.8}
          roughness={0.2}
          emissive={coin.color}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Coin symbol text on front */}
      <Text
        position={[0, 0, 0.11]}
        fontSize={coin.size * 0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
        maxWidth={coin.size * 1.5}
      >
        {coin.symbol}
      </Text>
      
      {/* Coin symbol text on back (mirrored) */}
      <Text
        position={[0, 0, -0.11]}
        rotation={[0, Math.PI, 0]}
        fontSize={coin.size * 0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
        maxWidth={coin.size * 1.5}
      >
        {coin.symbol}
      </Text>
      
      {/* Glowing ring around coin */}
      <mesh>
        <ringGeometry args={[coin.size * 1.1, coin.size * 1.3, 32]} />
        <meshBasicMaterial
          color={coin.color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default FloatingCoins;
