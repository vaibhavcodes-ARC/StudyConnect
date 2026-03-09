"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function FloatingShape({ position, speed, color, scale }: { position: [number, number, number], speed: number, color: string, scale: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 1.5;
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.015 * speed;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial 
        color={color} 
        wireframe={true} 
        emissive={color} 
        emissiveIntensity={0.5} 
        transparent 
        opacity={0.3} 
      />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10 bg-slate-50">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <FloatingShape position={[-6, 2, -5]} speed={0.8} color="#2563eb" scale={2.5} />
        <FloatingShape position={[6, -3, -8]} speed={0.5} color="#3b82f6" scale={3.5} />
        <FloatingShape position={[8, 4, -4]} speed={1.2} color="#60a5fa" scale={1.5} />
        <FloatingShape position={[-8, -4, -6]} speed={0.6} color="#93c5fd" scale={2} />
      </Canvas>
    </div>
  );
}
