'use client';

import React from 'react';
import { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, ContactShadows, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';

// Error boundary for WebGL components
class WebGLErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('WebGL Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>3D content not available</div>;
    }
    return this.props.children;
  }
}

// Simple gradient texture generator
const createGradientTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const context = canvas.getContext('2d');
  
  // Create gradient
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#f0f4ff');
  gradient.addColorStop(1, '#e6f0ff');
  
  // Fill with gradient
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add some UI elements
  context.fillStyle = '#ffffff';
  context.fillRect(50, 100, 200, 40);
  context.fillRect(50, 160, 150, 30);
  context.fillRect(50, 210, 250, 80);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

// Phone component with 3D model
function PhoneModel() {
  const group = useRef();
  const [target, setTarget] = useState({ rx: 0.1, ry: 0.25 });
  const [texture, setTexture] = useState(null);
  
  // Create texture on client side only
  useEffect(() => {
    setTexture(createGradientTexture());
    
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, []);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      target.rx,
      6,
      dt
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      target.ry,
      6,
      dt
    );
  });

  const onMove = (e) => {
    const p = e.pointer || { x: 0, y: 0 };
    const ry = THREE.MathUtils.clamp(p.x, -0.9, 0.9) * 0.35;
    const rx = THREE.MathUtils.clamp(-p.y, -0.9, 0.9) * 0.25;
    setTarget({ rx, ry });
  };

  const onLeave = () => setTarget({ rx: 0.1, ry: 0.25 });

  return (
    <group
      ref={group}
      position={[0, 0.25, 0]}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {/* Phone body */}
      <RoundedBox
        args={[1.6, 3.2, 0.15]}
        radius={0.18}
        smoothness={8}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#0f172a"
          metalness={0.85}
          roughness={0.25}
          clearcoat={0.8}
          clearcoatRoughness={0.05}
        />
      </RoundedBox>

      {/* Screen */}
      <RoundedBox
        args={[1.5, 3.0, 0.01]}
        radius={0.15}
        smoothness={8}
        position={[0, 0, 0.08]}
      >
        <meshStandardMaterial
          map={texture}
          metalness={0.1}
          roughness={0.3}
        />
      </RoundedBox>

      {/* Glass */}
      <RoundedBox
        args={[1.5, 3.0, 0.005]}
        radius={0.15}
        smoothness={8}
        position={[0, 0, 0.081]}
      >
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.05}
          transmission={0.9}
          transparent
          opacity={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Notch */}
      <RoundedBox
        args={[0.3, 0.07, 0.02]}
        radius={0.03}
        position={[0, 1.45, 0.08]}
      >
        <meshStandardMaterial color="#0b0b0b" roughness={0.4} metalness={0.2} />
      </RoundedBox>

      {/* Floating UI elements */}
      <Html transform position={[-0.7, 0.9, 0.082]}>
        <div className="bg-white/95 backdrop-blur-md border border-white/60 shadow-lg px-3 py-2 rounded-xl text-xs">
          <div className="font-semibold">Dishes done!</div>
          <div className="text-gray-500">Great job, Alex</div>
        </div>
      </Html>
      
      <Html transform position={[0.7, -0.3, 0.082]}>
        <div className="bg-white/95 backdrop-blur-md border border-white/60 shadow-lg px-3 py-2 rounded-xl text-xs">
          <div className="font-semibold">Bill split</div>
          <div className="text-gray-500">$47.50 each</div>
        </div>
      </Html>
    </group>
  );
}

// Fallback component for when WebGL is not available
function PhoneFallback() {
  return (
    <div className="relative w-full max-w-[280px] h-[560px] mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-[32px] border-8 border-gray-900 overflow-hidden shadow-2xl">
      {/* Mock UI content */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="h-16 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
          <div className="w-24 h-1.5 bg-white/30 rounded-full" />
        </div>
        <div className="p-4">
          <div className="h-4 bg-purple-200 rounded mb-2 w-3/4" />
          <div className="h-4 bg-purple-200 rounded w-1/2 mb-6" />
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/80 rounded-xl p-3 shadow">
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-2 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Phone component with WebGL check and error boundary
export default function PhoneMockup() {
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);

  // Check WebGL support on client-side
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      // Additional WebGL feature detection
      if (!gl) {
        setIsWebGLAvailable(false);
        return;
      }
      
      // Check for required extensions
      const requiredExtensions = [
        'OES_texture_float',
        'OES_standard_derivatives'
      ];
      
      const missingExtensions = requiredExtensions.filter(
        ext => !gl.getExtension(ext)
      );
      
      if (missingExtensions.length > 0) {
        console.warn('Missing required WebGL extensions:', missingExtensions);
        setIsWebGLAvailable(false);
      }
    } catch (e) {
      console.error('WebGL initialization error:', e);
      setIsWebGLAvailable(false);
    }
  }, []);

  if (!isWebGLAvailable) {
    return <PhoneFallback />;
  }

  return (
    <div className="relative w-full max-w-[520px] h-[600px]">
      <WebGLErrorBoundary fallback={<PhoneFallback />}>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.9, 3.6], fov: 35 }}
          className="w-full h-full"
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.7} />
            <directionalLight 
              position={[2, 3, 2]} 
              intensity={1.2} 
              castShadow 
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-near={0.5}
              shadow-camera-far={10}
            />
            <Environment preset="city" />
            <PhoneModel />
            <ContactShadows
              position={[0, -0.5, 0]}
              opacity={0.5}
              scale={10}
              blur={2.5}
              far={8}
            />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
