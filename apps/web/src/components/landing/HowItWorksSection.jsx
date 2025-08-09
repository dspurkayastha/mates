"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Home,
  ShoppingCart,
  CreditCard,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function HowItWorksSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderDrag = (e) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-br from-purple-50 to-pink-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            From 🌀 chaos to ✨ clarity.
          </h2>
          <p className="text-xl text-gray-600">
            All your household stuff, in one place. No more "didn't see it"
            excuses.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div
            className="relative h-96 rounded-3xl overflow-hidden bg-white shadow-2xl cursor-grab active:cursor-grabbing border border-gray-200"
            onMouseMove={handleSliderDrag}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 p-8"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <div className="space-y-4">
                <div className="bg-yellow-200 p-3 rounded-lg transform -rotate-2 shadow-sm">
                  📝 Buy milk - Sarah
                </div>
                <div className="bg-pink-200 p-3 rounded-lg transform rotate-1 shadow-sm">
                  🧹 Clean kitchen - Alex
                </div>
                <div className="bg-blue-200 p-3 rounded-lg transform -rotate-1 shadow-sm">
                  💰 Split electricity bill
                </div>
                <div className="bg-green-200 p-3 rounded-lg transform rotate-2 shadow-sm">
                  🛒 Grocery run needed
                </div>
                <p className="text-center text-gray-500 mt-8 font-medium">
                  Scattered sticky notes and endless group chats
                </p>
              </div>
            </div>

            <div
              className="absolute inset-0 bg-gradient-to-r from-purple-50 to-blue-50 p-8"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <div className="grid grid-cols-3 gap-4 h-full">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-100 shadow-sm">
                  <Home className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-3">Chores</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Kitchen ✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      <span className="text-sm">Laundry</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-pink-100 shadow-sm">
                  <ShoppingCart className="w-8 h-8 text-pink-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-3">Shopping</h3>
                  <div className="text-sm text-gray-600">
                    • Milk
                    <br />• Bread
                    <br />• Eggs
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-100 shadow-sm">
                  <CreditCard className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-bold text-gray-900 mb-3">Bills</h3>
                  <div className="text-sm text-gray-600">
                    Electricity
                    <br />
                    <span className="text-green-600 font-medium">
                      $47.50 each
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-center text-gray-700 font-medium mt-4">
                One beautiful app for everything
              </p>
            </div>

            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 shadow-lg z-10"
              style={{
                left: `${sliderPosition}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-purple-200">
                <ChevronLeft className="w-3 h-3 text-gray-600" />
                <ChevronRight className="w-3 h-3 text-gray-600" />
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-4">
            Drag the slider to see the transformation
          </p>
        </motion.div>
      </div>
    </section>
  );
}
