'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  RoundedBox,
  ContactShadows,
  Environment,
  Html,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
} from '@react-three/drei';

/* --------------------------- helpers --------------------------- */

function useIdleSway(speed = 0.35, ampX = 0.06, ampY = 0.1) {
  // tiny idle sway (adds life even when not hovering)
  const t = useRef(0);
  useFrame((_, dt) => (t.current += dt * speed));
  return {
    x: () => Math.sin(t.current * 1.1) * ampX,
    y: () => Math.cos(t.current * 0.9) * ampY,
  };
}

function createUITexture() {
  const c = document.createElement('canvas');
  c.width = 768;
  c.height = 1536;
  const g = c.getContext('2d');
  if (!g) return null;

  // bg gradient
  const grd = g.createLinearGradient(0, 0, 0, c.height);
  grd.addColorStop(0, '#f7f2ff');
  grd.addColorStop(1, '#ffe6f3');
  g.fillStyle = grd;
  g.fillRect(0, 0, c.width, c.height);

  // soft vignette
  const v = g.createRadialGradient(c.width/2, c.height/2, c.width*0.1, c.width/2, c.height/2, c.width*0.7);
  v.addColorStop(0, 'rgba(0,0,0,0)');
  v.addColorStop(1, 'rgba(0,0,0,0.06)');
  g.fillStyle = v;
  g.fillRect(0, 0, c.width, c.height);

  // cards
  const card = (x, y, w, h, r=28) => {
    g.beginPath();
    g.moveTo(x+r, y);
    g.lineTo(x+w-r, y);
    g.quadraticCurveTo(x+w, y, x+w, y+r);
    g.lineTo(x+w, y+h-r);
    g.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    g.lineTo(x+r, y+h);
    g.quadraticCurveTo(x, y+h, x, y+h-r);
    g.lineTo(x, y+r);
    g.quadraticCurveTo(x, y, x+r, y);
    g.closePath();
    g.fillStyle = 'rgba(255,255,255,0.92)';
    g.fill();
    g.lineWidth = 4;
    g.strokeStyle = 'rgba(255,255,255,0.75)';
    g.stroke();
  };

  // top stats
  card(72, 120, 624, 140, 32);
  g.fillStyle = '#7c3aed';
  g.font = 'bold 90px Inter, system-ui, sans-serif';
  g.fillText('8', 116, 215);
  g.fillStyle = '#6b7280';
  g.font = '600 30px Inter, system-ui, sans-serif';
  g.fillText('Tasks done', 160, 210);

  g.fillStyle = '#ec4899';
  g.font = 'bold 64px Inter, system-ui, sans-serif';
  g.fillText('$24', 600, 210);
  g.fillStyle = '#6b7280';
  g.font = '600 28px Inter, system-ui, sans-serif';
  g.fillText("You're owed", 520, 250);

  // list cards
  let y = 320;
  [['Take out trash', 'Today', '#22c55e'],
   ['Buy groceries', 'Tomorrow', '#eab308'],
   ['Split electricity bill', 'Due Mon', '#a855f7']].forEach(([t, meta, dot]) => {
    card(72, y, 624, 120, 26);
    // colored dot + text
    g.fillStyle = dot; g.beginPath(); g.arc(100, y+60, 10, 0, Math.PI*2); g.fill();
    g.fillStyle = '#374151'; g.font = '600 36px Inter, system-ui, sans-serif'; g.fillText(t, 130, y+72);
    g.fillStyle = '#6b7280'; g.font = '500 28px Inter, system-ui, sans-serif'; g.fillText(meta, 620, y+72);
    y += 140;
  });

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

/* --------------------------- phone model --------------------------- */

function PhoneModel() {
  const group = useRef();
  const [target, setTarget] = useState({ rx: 0.12, ry: 0.28 });
  const [uiTex, setUiTex] = useState(null);
  const sway = useIdleSway(0.35, 0.05, 0.08);

  useEffect(() => {
    const t = createUITexture();
    setUiTex(t);
    return () => t && t.dispose();
  }, []);

  useFrame((_, dt) => {
    if (!group.current) return;
    const idleX = sway.x();
    const idleY = sway.y();
    // damp to target + idle
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      target.rx + idleX,
      6,
      dt
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      target.ry + idleY,
      6,
      dt
    );
  });

  const onMove = (e) => {
    const p = e.pointer || { x: 0, y: 0 }; // normalized -1..1
    const ry = THREE.MathUtils.clamp(p.x, -0.9, 0.9) * 0.4;
    const rx = THREE.MathUtils.clamp(-p.y, -0.9, 0.9) * 0.28;
    setTarget({ rx, ry });
  };

  const onLeave = () => setTarget({ rx: 0.12, ry: 0.28 });

  // simple fresnel for glass edge pop
  const fresnelMat = new THREE.ShaderMaterial({
    uniforms: { color: { value: new THREE.Color('#ffffff') } },
    vertexShader: `
      varying float vF;
      void main(){
        vec3 n = normalize(normalMatrix * normal);
        vec3 v = normalize(- (modelViewMatrix * vec4(position,1.0)).xyz);
        vF = pow(1.0 - max(dot(n, v), 0.0), 3.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: `
      varying float vF;
      uniform vec3 color;
      void main(){
        gl_FragColor = vec4(color, vF * 0.65);
      }
    `,
    transparent: true,
    depthWrite: false,
  });

  return (
    <group
      ref={group}
      position={[0, 0.25, 0]}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {/* Metallic side frame */}
      <RoundedBox args={[1.6, 3.2, 0.14]} radius={0.18} smoothness={8} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#101827"
          metalness={1}
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </RoundedBox>

      {/* Subtle rim strip to fake chamfer */}
      <RoundedBox args={[1.58, 3.18, 0.145]} radius={0.17} smoothness={8}>
        <meshStandardMaterial color="#374151" metalness={1} roughness={0.22} />
      </RoundedBox>

      {/* Screen plate (emissive-ish look) */}
      <RoundedBox args={[1.46, 3.02, 0.01]} radius={0.16} smoothness={8} position={[0, 0, 0.077]}>
        <meshStandardMaterial
          map={uiTex}
          metalness={0.05}
          roughness={0.35}
          emissive={'#ffffff'}
          emissiveIntensity={0.06}
        />
      </RoundedBox>

      {/* Glass with transmission + fresnel overlay */}
      <RoundedBox args={[1.46, 3.02, 0.006]} radius={0.16} smoothness={8} position={[0, 0, 0.081]}>
        <MeshTransmissionMaterial
          thickness={0.28}
          roughness={0.08}
          ior={1.5}
          chromaticAberration={0.015}
          transmission={1}
          anisotropy={0.15}
          temporalDistortion={0.0}
          distortion={0.01}
          distortionScale={0.15}
          samples={6}
        />
      </RoundedBox>
      {/* Fresnel rim (adds pop on edges) */}
      <RoundedBox args={[1.46, 3.02, 0.006]} radius={0.16} smoothness={8} position={[0, 0, 0.082]}>
        <primitive object={fresnelMat} attach="material" />
      </RoundedBox>

      {/* Notch & LED */}
      <RoundedBox args={[0.34, 0.08, 0.04]} radius={0.03} position={[0, 1.46, 0.078]}>
        <meshStandardMaterial color="#0b0b0b" roughness={0.5} metalness={0.2} />
      </RoundedBox>
      <mesh position={[0.72, 1.54, 0.079]}>
        <circleGeometry args={[0.015, 24]} />
        <meshBasicMaterial color="#60e0ff" />
      </mesh>

      {/* Tiny side buttons */}
      <mesh position={[-0.83, 0.4, 0]}>
        <boxGeometry args={[0.02, 0.26, 0.05]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[-0.83, 0.0, 0]}>
        <boxGeometry args={[0.02, 0.18, 0.05]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Floating UI chips with micro float */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
        <Html transform position={[-0.95, 0.95, 0.09]}>
          <div className="bg-white/95 backdrop-blur-md border border-white/60 shadow-lg px-3 py-2 rounded-xl text-xs will-change-transform">
            <div className="font-semibold">Dishes done!</div>
            <div className="text-gray-500">Great job, Alex</div>
          </div>
        </Html>
      </Float>
      <Float speed={1.0} rotationIntensity={0.18} floatIntensity={0.5}>
        <Html transform position={[0.98, -0.3, 0.09]}>
          <div className="bg-white/95 backdrop-blur-md border border-white/60 shadow-lg px-3 py-2 rounded-xl text-xs will-change-transform">
            <div className="font-semibold">Bill split</div>
            <div className="text-gray-500">$47.50 each</div>
          </div>
        </Html>
      </Float>
    </group>
  );
}

/* --------------------------- fallback & boundary --------------------------- */

function PhoneFallback() {
  return (
    <div className="relative w-full max-w-[280px] h-[560px] mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-[32px] border-8 border-gray-900 overflow-hidden shadow-2xl">
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

class WebGLErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { console.error('WebGL Error:', err, info); }
  render() { return this.state.hasError ? (this.props.fallback || <PhoneFallback />) : this.props.children; }
}

/* --------------------------- main export --------------------------- */

export default function PhoneMockup() {
  const [ok, setOk] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return setOk(false);
      // minimal feature check
      if (!gl.getExtension('OES_standard_derivatives')) setOk(false);
    } catch {
      setOk(false);
    }
  }, []);

  if (!ok) return <PhoneFallback />;

  return (
    <div className="relative w-full max-w-[560px] h-[640px]">
      <WebGLErrorBoundary fallback={<PhoneFallback />}>
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.9, 3.6], fov: 35 }}
          className="w-full h-full"
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            {/* Rich environment with lightformers for sexy highlights */}
            <Environment preset="studio">
              <Lightformer intensity={2.5} position={[2, 2, 2]} scale={[4, 3, 1]} form="rect" />
              <Lightformer intensity={1.5} position={[-2, 1, 1]} scale={[2, 2, 1]} form="ring" />
              <Lightformer intensity={1.2} position={[0, -2, 2]} scale={[6, 2, 1]} form="rect" />
            </Environment>

            <ambientLight intensity={0.6} />
            <directionalLight position={[2.5, 3.5, 2]} intensity={1.2} castShadow />

            {/* Slight float on the phone itself for premium feel */}
            <Float speed={0.6} rotationIntensity={0.12} floatIntensity={0.3}>
              <PhoneModel />
            </Float>

            {/* Plush soft shadow under the phone */}
            <ContactShadows
              position={[0, -0.35, 0]}
              opacity={0.45}
              scale={10}
              blur={2.7}
              far={7}
              frames={60}
            />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
