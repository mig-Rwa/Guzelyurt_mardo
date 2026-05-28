'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { prefersReducedMotion } from '@/lib/utils';

// Floating envelope
function Envelope({ subscribed }: { subscribed: boolean }) {
  const envelopeRef = useRef<THREE.Group>(null);
  const reducedMotion = prefersReducedMotion();
  
  useFrame((state) => {
    if (envelopeRef.current && !reducedMotion) {
      // Gentle rotation
      envelopeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
      envelopeRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={envelopeRef} scale={subscribed ? 1.2 : 1}>
      {/* Envelope body */}
      <mesh>
        <boxGeometry args={[1.6, 0.1, 1]} />
        <meshStandardMaterial color="#f5f0e6" roughness={0.5} />
      </mesh>
      
      {/* Envelope flap (back) */}
      <mesh position={[0, 0.05, 0.3]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[1.6, 0.7]} />
        <meshStandardMaterial color="#e8e0d5" side={THREE.DoubleSide} />
      </mesh>
      
      {/* Envelope flap (triangle) */}
      <mesh position={[0, 0.1, 0]} rotation={[subscribed ? -0.8 : -0.3, 0, 0]}>
        <coneGeometry args={[0.8, 0.6, 4]} />
        <meshStandardMaterial color="#f5f0e6" flatShading />
      </mesh>
      
      {/* Seal */}
      <mesh position={[0, 0.15, 0.1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.03, 32]} />
        <meshStandardMaterial color="#c44b4b" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Paper peeking out when subscribed */}
      {subscribed && (
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[1.3, 0.02, 0.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      )}
      
      {/* Glow when subscribed */}
      {subscribed && (
        <pointLight position={[0, 0.5, 0]} intensity={0.8} color="#fad24b" distance={2} />
      )}
    </group>
  );
}

// Floating coffee beans decoration
function CoffeeBeanRing() {
  const ringRef = useRef<THREE.Group>(null);
  const reducedMotion = prefersReducedMotion();
  
  useFrame((state) => {
    if (ringRef.current && !reducedMotion) {
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const beanCount = 8;
  const radius = 1.8;

  return (
    <group ref={ringRef}>
      {Array.from({ length: beanCount }).map((_, i) => {
        const angle = (i / beanCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <Float key={i} speed={1 + i * 0.1} floatIntensity={0.3}>
            <mesh 
              position={[x, Math.sin(angle * 2) * 0.3, z]} 
              rotation={[Math.random() * Math.PI, angle, Math.random() * Math.PI]}
              scale={0.08}
            >
              <capsuleGeometry args={[0.5, 1, 8, 16]} />
              <meshStandardMaterial color="#5d4037" roughness={0.6} />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
}

// Sparkle particles for success state
function Sparkles({ active }: { active: boolean }) {
  const sparklesRef = useRef<THREE.Group>(null);
  const reducedMotion = prefersReducedMotion();
  
  useFrame((state) => {
    if (sparklesRef.current && active && !reducedMotion) {
      sparklesRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  if (!active) return null;

  const sparklePositions = Array.from({ length: 12 }, () => [
    (Math.random() - 0.5) * 3,
    (Math.random() - 0.5) * 2,
    (Math.random() - 0.5) * 2,
  ] as [number, number, number]);

  return (
    <group ref={sparklesRef}>
      {sparklePositions.map((pos, i) => (
        <Float key={i} speed={3} floatIntensity={1}>
          <mesh position={pos} scale={0.03 + Math.random() * 0.02}>
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color="#fad24b" />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

interface Newsletter3DProps {
  subscribed: boolean;
}

export default function Newsletter3D({ subscribed }: Newsletter3DProps) {
  return (
    <div className="h-[160px] w-[160px]">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={30} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <pointLight position={[-3, 2, 3]} intensity={0.3} color="#fad24b" />
        
        {/* Elements */}
        <Float speed={1.5} floatIntensity={0.3} rotationIntensity={0.1}>
          <Envelope subscribed={subscribed} />
        </Float>
        
        <CoffeeBeanRing />
        <Sparkles active={subscribed} />
      </Canvas>
    </div>
  );
}
