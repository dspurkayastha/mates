'use client';

import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Download, ArrowRight, Star, Play } from 'lucide-react';

// Lazy load the PhoneMockup component
const PhoneMockup = lazy(() => import('./PhoneMockup'));

// Fallback component for loading state
const PhoneMockupFallback = () => (
  <div className="relative w-full max-w-[280px] h-[560px] mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-[32px] border-8 border-gray-900 overflow-hidden shadow-2xl" />
);

const prefixes = ['Room', 'Flat', 'House', 'Soul']; // prefix changes; "mates" stays static

// Animation variants for the tagline
const taglineVariants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: '-100%', opacity: 0 }
};

// Calculate the width of the widest prefix for consistent layout
const getMaxPrefixWidth = () => {
  if (typeof window === 'undefined') return 'auto';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 'auto';
  
  ctx.font = 'bold 72px Inter, system-ui, sans-serif';
  const widths = prefixes.map(text => ctx.measureText(text).width);
  return `${Math.max(...widths) / 16}ch`; // Convert to ch units
};

// Main Hero Section Component
export function HeroSection() {
  const [currentPrefixIndex, setPrefixIndex] = useState(0);
  const [maxPrefixWidth] = useState(getMaxPrefixWidth());
  const containerRef = useRef(null);

  // Animation interval for the prefix rotation
  useEffect(() => {
    const id = setInterval(() => {
      setPrefixIndex(prev => (prev + 1) % prefixes.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    >
      {/* Glassmorphic Background Card */}
      <div className="absolute inset-4 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl" />

      {/* Animated blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
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
              <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Beta now live • Join 15,000+ households</span>
            </motion.div>

            {/* Dynamic tagline */}
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-gray-900">Lets </span>
              
              {/* Animated prefix with fixed width container */}
              <span 
                className="relative inline-block align-middle overflow-visible"
                style={{ width: maxPrefixWidth, height: '1.2em' }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentPrefixIndex}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={taglineVariants}
                    transition={{ duration: 0.45, ease: [0.2, 0.65, 0.2, 1] }}
                    className="absolute left-0 right-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"
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
          <div className="flex justify-center lg:justify-end">
            <Suspense fallback={<PhoneMockupFallback />}>
              <PhoneMockup />
            </Suspense>
          </div>
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

// Only export the Page component as default
export default function Page() {
  return (
    <>
      <HeroSection />
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
          100% { transform: translate(0,0) scale(1); }
        }
        .animate-blob { 
          animation: blob 7s infinite ease-in-out;
          transform-origin: center;
        }
        .animation-delay-2000 { 
          animation-delay: 2s; 
        }
        .animation-delay-4000 { 
          animation-delay: 4s; 
        }
      `}</style>
    </>
  );
}