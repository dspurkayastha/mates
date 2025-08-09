"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  CheckCircle2,
  Download,
  ArrowRight,
  Star,
  Play,
} from "lucide-react";
import * as THREE from "three";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  RoundedBox,
  ContactShadows,
  Environment,
  Html,
} from "@react-three/drei";

const prefixes = ["Room", "Flat", "House", "Soul"]; // prefix changes; "mates" stays static

/* --------------------------- PHONE MOCKUP --------------------------- */
function Phone() {
  const group = useRef(null);
  const [target, setTarget] = useState({ rx: 0.1, ry: 0.25 });

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
    const p = e.pointer || { x: 0, y: 0 }; // normalized -1..1
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
      {/* Body */}
      <RoundedBox
        args={[1.6, 3.2, 0.12]}
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

      {/* Side rim hint */}
      <RoundedBox args={[1.58, 3.18, 0.121]} radius={0.17} smoothness={8}>
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.2} />
      </RoundedBox>

      {/* Glass */}
      <RoundedBox
        args={[1.42, 2.98, 0.004]}
        radius={0.14}
        smoothness={8}
        position={[0, 0, 0.061]}
      >
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0}
          roughness={0.15}
          transmission={0.25}
          transparent
        />
      </RoundedBox>

      {/* UI plate under glass */}
      <RoundedBox
        args={[1.42, 2.98, 0.004]}
        radius={0.14}
        smoothness={8}
        position={[0, 0, 0.058]}
      >
        <meshStandardMaterial color="#ffffff" map={makeUITexture()} />
      </RoundedBox>

      {/* Notch */}
      <RoundedBox
        args={[0.32, 0.08, 0.06]}
        radius={0.03}
        position={[0, 1.45, 0.055]}
      >
        <meshStandardMaterial color="#0b0b0b" roughness={0.4} metalness={0.2} />
      </RoundedBox>

      {/* Status LED */}
      <mesh position={[0.74, 1.52, 0.058]}>
        <circleGeometry args={[0.012, 24]} />
        <meshBasicMaterial color="#60e0ff" />
      </mesh>

      {/* Floating chips */}
      <Html transform position={[-0.9, 0.9, 0.07]}>
        <div className="bg-white/95 backdrop-blur-md border border-white/60 shadow-lg px-3 py-2 rounded-xl text-xs">
          <div className="font-semibold">Dishes done!</div>
          <div className="text-gray-500">Great job, Alex</div>
        </div>
      </Html>
      <Html transform position={[0.95, -0.3, 0.07]}>
        <div className="bg-white/95 backdrop-blur-md border border-white/60 shadow-lg px-3 py-2 rounded-xl text-xs">
          <div className="font-semibold">Bill split</div>
          <div className="text-gray-500">$47.50 each</div>
        </div>
      </Html>
    </group>
  );
}

// Simple pastel UI as a CanvasTexture (pure JS)
function makeUITexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 1024;
  const g = c.getContext("2d");
  if (!g) return null;

  // bg
  const grd = g.createLinearGradient(0, 0, 0, c.height);
  grd.addColorStop(0, "#f9f5ff");
  grd.addColorStop(1, "#ffe4f3");
  g.fillStyle = grd;
  g.fillRect(0, 0, c.width, c.height);

  // cards
  g.fillStyle = "rgba(255,255,255,0.9)";
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.lineWidth = 4;
  const card = (y) => {
    g.beginPath();
    const r = 18,
      x = 40,
      w = 432,
      h = 88;
    g.moveTo(x + r, y);
    g.lineTo(x + w - r, y);
    g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r);
    g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h);
    g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r);
    g.quadraticCurveTo(x, y, x + r, y);
    g.fill();
    g.stroke();
  };
  card(120);
  card(230);
  card(340);
  card(450);

  // stats
  g.fillStyle = "#7c3aed";
  g.font = "bold 64px Inter, system-ui, sans-serif";
  g.fillText("8", 70, 90);
  g.fillStyle = "#ec4899";
  g.fillText("$24", 360, 90);

  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

function AppMockup() {
  return (
    <div className="relative w-full max-w-[520px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.9, 3.6], fov: 35 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 2]} intensity={1.2} castShadow />
        <Environment preset="city" />
        <Phone />
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.35}
          scale={6}
          blur={2.4}
          far={4}
        />
      </Canvas>
    </div>
  );
}

/* --------------------------- HERO SECTION --------------------------- */
export function HeroSection() {
  const [currentPrefixIndex, setPrefixIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setPrefixIndex((p) => (p + 1) % prefixes.length),
      2000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Glassmorphic Background Card */}
      <div className="absolute inset-4 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl" />

      {/* Animated blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium mb-8 border border-purple-200/50"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Beta now live • Join 15,000+ households
            </motion.div>

            {/* Dynamic tagline EXACT: “Let’s …mates really be Mates.” */}
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-gray-900">Let’s </span>

              {/* Reserve space + clip while animating */}
              <span className="relative inline-flex align-baseline h-[1em] w-[9ch] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentPrefixIndex}
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: "0%" }}
                    exit={{ opacity: 0, y: "-100%" }}
                    transition={{ duration: 0.45, ease: [0.2, 0.65, 0.2, 1] }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
                    aria-live="polite"
                  >
                    {prefixes[currentPrefixIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-gray-900">mates</span>
              <br />
              <span className="text-gray-900">really be Mates.</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              The beautiful, drama-free way to manage your shared life — from
              chores to groceries to bills.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(147,51,234,.2)",
                }}
                whileTap={{ scale: 0.95 }}
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Download Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </motion.button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  <img
                    className="w-8 h-8 rounded-full border-2 border-white"
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b417?w=32&h=32&fit=crop&crop=face"
                    alt=""
                    loading="lazy"
                  />
                  <img
                    className="w-8 h-8 rounded-full border-2 border-white"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
                    alt=""
                    loading="lazy"
                  />
                  <img
                    className="w-8 h-8 rounded-full border-2 border-white"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
                    alt=""
                    loading="lazy"
                  />
                </div>
                15K+ households
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-1">4.9/5 rating</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Phone Mockup */}
          <AppMockup />
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0,0) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </section>
  );
}

export default function Page() {
  return <HeroSection />;
}