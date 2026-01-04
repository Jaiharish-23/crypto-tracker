import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import FloatingCoins from './FloatingCoins';
import SpaceEnvironment from './SpaceEnvironment';

const ThreeBackground = () => {
  const meshRef = useRef();
  const sphereRef = useRef();
  const particlesRef = useRef();

  // Create particle system
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 1000; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50,
          (Math.random() - 0.5) * 50
        ],
        scale: Math.random() * 0.5 + 0.1
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Animate main sphere
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.5;
    }

    // Animate secondary sphere
    if (sphereRef.current) {
      sphereRef.current.rotation.x = -time * 0.1;
      sphereRef.current.rotation.z = time * 0.2;
      sphereRef.current.position.x = Math.cos(time * 0.3) * 2;
      sphereRef.current.position.z = Math.sin(time * 0.3) * 2;
    }

    // Animate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05;
      particlesRef.current.children.forEach((child, index) => {
        child.position.y += Math.sin(time + index) * 0.001;
        child.rotation.x = time * 0.5;
        child.rotation.y = time * 0.3;
      });
    }
  });

  return (
    <>
      {/* Space Environment with stars and nebulas */}
      <SpaceEnvironment />
      
      {/* Floating Crypto Coins */}
      <FloatingCoins />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#9333ea" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[0, 15, 5]} intensity={0.6} color="#ffd700" />

      {/* Main animated sphere */}
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, -5]}>
          <MeshDistortMaterial
            color="#9333ea"
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
            transparent
            opacity={0.6}
          />
        </Sphere>
      </Float>

      {/* Secondary sphere */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere ref={sphereRef} args={[1, 32, 32]} position={[3, 1, -8]}>
          <MeshDistortMaterial
            color="#3b82f6"
            attach="material"
            distort={0.2}
            speed={1.5}
            roughness={0.1}
            metalness={0.9}
            transparent
            opacity={0.4}
          />
        </Sphere>
      </Float>

      {/* Particle system */}
      <group ref={particlesRef}>
        {particles.map((particle, index) => (
          <mesh key={index} position={particle.position} scale={particle.scale}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? "#9333ea" : "#3b82f6"}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>

      {/* Wireframe torus */}
      <Float speed={0.5} rotationIntensity={2} floatIntensity={0.5}>
        <mesh position={[-4, -2, -6]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[1.5, 0.3, 16, 100]} />
          <meshBasicMaterial
            color="#9333ea"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </Float>

      {/* Rotating ring */}
      <Float speed={3} rotationIntensity={3} floatIntensity={1}>
        <mesh position={[4, 2, -10]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1, 1.5, 32]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>
    </>
  );
};

export default ThreeBackground;
