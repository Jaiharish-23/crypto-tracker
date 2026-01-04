import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';

const SpaceEnvironment = () => {
  const nebulaRef = useRef();
  const starsRef = useRef();
  
  // Create floating star particles
  const starField = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 1000; i++) {
      stars.push({
        position: [
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 200
        ],
        size: Math.random() * 0.5 + 0.1,
        twinkleSpeed: Math.random() * 2 + 1,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }
    return stars;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate nebula clouds
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = time * 0.01;
      nebulaRef.current.rotation.z = Math.sin(time * 0.005) * 0.1;
    }
    
    // Animate star field
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.002;
    }
  });

  return (
    <>
      {/* Animated star field */}
      <group ref={starsRef}>
        <Stars
          radius={100}
          depth={50}
          count={2000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
      </group>
      
      {/* Nebula clouds */}
      <group ref={nebulaRef}>
        {/* Purple nebula */}
        <Cloud
          position={[-20, 10, -30]}
          speed={0.1}
          opacity={0.2}
          color="#9333ea"
          segments={20}
          bounds={[10, 5, 10]}
          volume={6}
        />
        
        {/* Blue nebula */}
        <Cloud
          position={[25, -15, -40]}
          speed={0.15}
          opacity={0.15}
          color="#3b82f6"
          segments={25}
          bounds={[15, 8, 15]}
          volume={8}
        />
        
        {/* Cyan nebula */}
        <Cloud
          position={[0, 20, -50]}
          speed={0.08}
          opacity={0.1}
          color="#06b6d4"
          segments={30}
          bounds={[20, 6, 20]}
          volume={10}
        />
      </group>
      
      {/* Twinkling stars */}
      {starField.map((star, index) => (
        <TwinklingStar key={index} star={star} index={index} />
      ))}
      
      {/* Distant galaxies */}
      <DistantGalaxies />
    </>
  );
};

const TwinklingStar = ({ star, index }) => {
  const starRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (starRef.current) {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5;
      starRef.current.material.opacity = twinkle * 0.8 + 0.2;
      starRef.current.scale.setScalar(star.size * (twinkle * 0.5 + 0.5));
    }
  });
  
  return (
    <mesh ref={starRef} position={star.position}>
      <sphereGeometry args={[star.size, 8, 8]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

const DistantGalaxies = () => {
  const galaxies = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 200,
        -100 - Math.random() * 100
      ],
      rotation: Math.random() * Math.PI * 2,
      size: Math.random() * 5 + 3,
      color: ['#9333ea', '#3b82f6', '#06b6d4', '#8b5cf6', '#a855f7'][i]
    }));
  }, []);
  
  return (
    <>
      {galaxies.map((galaxy, index) => (
        <Galaxy key={index} galaxy={galaxy} />
      ))}
    </>
  );
};

const Galaxy = ({ galaxy }) => {
  const galaxyRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (galaxyRef.current) {
      galaxyRef.current.rotation.z = galaxy.rotation + time * 0.01;
    }
  });
  
  return (
    <group ref={galaxyRef} position={galaxy.position}>
      {/* Galaxy spiral */}
      <mesh>
        <ringGeometry args={[galaxy.size * 0.5, galaxy.size, 64]} />
        <meshBasicMaterial
          color={galaxy.color}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Galaxy core */}
      <mesh>
        <sphereGeometry args={[galaxy.size * 0.2, 16, 16]} />
        <meshBasicMaterial
          color={galaxy.color}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Galaxy arms */}
      {[0, 1, 2].map((arm) => (
        <mesh key={arm} rotation={[0, 0, (arm * Math.PI * 2) / 3]}>
          <ringGeometry args={[galaxy.size * 0.3, galaxy.size * 0.9, 32]} />
          <meshBasicMaterial
            color={galaxy.color}
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default SpaceEnvironment;
