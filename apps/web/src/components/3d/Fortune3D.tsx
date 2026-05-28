'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/utils';

// Mystical floating particles
function MysticParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  const reducedMotion = prefersReducedMotion();
  
  useFrame((state) => {
    if (particlesRef.current && !reducedMotion) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const particles = Array.from({ length: 20 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 2,
    ] as [number, number, number],
    scale: 0.02 + Math.random() * 0.03,
  }));

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <Float key={i} speed={2 + i * 0.1} floatIntensity={0.5}>
          <mesh position={particle.position} scale={particle.scale}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#9f4b9c" transparent opacity={0.6} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Upside-down coffee cup for fortune reading
function FortuneCup({ isRevealing }: { isRevealing: boolean }) {
  const cupRef = useRef<THREE.Group>(null);
  const reducedMotion = prefersReducedMotion();
  const [rotation, setRotation] = useState(Math.PI); // Start upside down
  
  useFrame((state, delta) => {
    if (cupRef.current) {
      if (!reducedMotion) {
        // Gentle floating motion
        cupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }
      
      // Flip animation when revealing
      if (isRevealing) {
        const targetRotation = 0;
        setRotation((prev) => THREE.MathUtils.lerp(prev, targetRotation, delta * 2));
        cupRef.current.rotation.x = rotation;
      } else {
        cupRef.current.rotation.x = Math.PI; // Upside down
      }
    }
  });

  return (
    <group ref={cupRef} position={[0, 0, 0]} scale={1.5}>
      {/* Cup body */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.4, 0.7, 32]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Cup rim (gold) */}
      <mesh position={[0, 0.35, 0]}>
        <torusGeometry args={[0.5, 0.03, 16, 32]} />
        <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Handle */}
      <mesh position={[0.55, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.15, 0.04, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.4} />
      </mesh>
      
      {/* Coffee grounds pattern inside (visible when upside down) */}
      <mesh position={[0, 0.25, 0]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial color="#3d2314" roughness={1} />
      </mesh>
      
      {/* Mystical glow */}
      <pointLight position={[0, -0.5, 0]} intensity={0.5} color="#9f4b9c" distance={3} />
    </group>
  );
}

// Saucer/plate
function Saucer() {
  return (
    <group position={[0, -1, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.05, 32]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.4} />
      </mesh>
      {/* Gold rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <torusGeometry args={[0.85, 0.02, 16, 32]} />
        <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

interface Fortune3DProps {
  isRevealing: boolean;
}

export default function Fortune3D({ isRevealing }: Fortune3DProps) {
  return (
    <div className="h-[200px] w-[200px]">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={35} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <pointLight position={[-3, 3, 3]} intensity={0.4} color="#9f4b9c" />
        
        {/* Elements */}
        <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.1}>
          <FortuneCup isRevealing={isRevealing} />
          <Saucer />
        </Float>
        
        <MysticParticles />
      </Canvas>
    </div>
  );
}
