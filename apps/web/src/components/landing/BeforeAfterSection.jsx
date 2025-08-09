"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { beforeAfter } from "./constants";
import { ArrowRight, CheckCircle2, X } from "lucide-react";

export function BeforeAfterSection() {
  const [activeView, setActiveView] = useState("before");

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            See the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              transformation
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            From household chaos to seamless coordination in just a few taps.
          </p>

          {/* Toggle buttons */}
          <div className="inline-flex bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setActiveView("before")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeView === "before"
                  ? "bg-red-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-red-500"
              }`}
            >
              Before Mates
            </button>
            <button
              onClick={() => setActiveView("after")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeView === "after"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              After Mates
            </button>
          </div>
        </motion.div>

        {/* Interactive content */}
        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeView === "before" && (
              <motion.div
                key="before"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-3xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-8">
                    <X className="w-8 h-8 text-red-500" />
                    <h3 className="text-3xl font-bold text-red-700">The Old Way</h3>
                  </div>

                  {/* Realistic sticky notes board */}
                  <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-200 min-h-[400px] overflow-hidden">
                    {/* Cork board texture */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_#8b5a3c_1px,_transparent_1px)] bg-[length:8px_8px]"></div>
                    
                    {/* Messy sticky notes with thumb tacks */}
                    <div className="relative">
                      {/* Thumb tack */}
                      <div className="absolute top-2 left-8 w-3 h-3 bg-red-600 rounded-full shadow-md"></div>
                      <div className="absolute top-0 left-6 w-24 h-24 bg-yellow-300 rounded-lg transform -rotate-12 shadow-lg border border-yellow-400 p-3">
                        <div className="text-xs font-medium text-yellow-900 break-words">
                          "Wait, who's on trash duty?"
                        </div>
                      </div>

                      {/* Thumb tack */}
                      <div className="absolute top-16 right-12 w-3 h-3 bg-blue-600 rounded-full shadow-md"></div>
                      <div className="absolute top-14 right-8 w-32 h-20 bg-pink-300 rounded-lg transform rotate-6 shadow-lg border border-pink-400 p-3">
                        <div className="text-xs font-medium text-pink-900 break-words">
                          "Didn't we already have milk?"
                        </div>
                      </div>

                      {/* Thumb tack */}
                      <div className="absolute bottom-16 left-16 w-3 h-3 bg-green-600 rounded-full shadow-md"></div>
                      <div className="absolute bottom-18 left-12 w-36 h-24 bg-blue-300 rounded-lg transform rotate-3 shadow-lg border border-blue-400 p-3">
                        <div className="text-xs font-medium text-blue-900 break-words">
                          "Who paid the water bill?"
                        </div>
                      </div>

                      {/* Thumb tack */}
                      <div className="absolute bottom-8 right-8 w-3 h-3 bg-purple-600 rounded-full shadow-md"></div>
                      <div className="absolute bottom-10 right-4 w-28 h-28 bg-green-300 rounded-lg transform -rotate-6 shadow-lg border border-green-400 p-3">
                        <div className="text-xs font-medium text-green-900 break-words">
                          "Trash day? When?"
                        </div>
                      </div>

                      {/* Additional scattered notes */}
                      <div className="absolute top-32 left-32 w-3 h-3 bg-orange-600 rounded-full shadow-md"></div>
                      <div className="absolute top-30 left-28 w-20 h-16 bg-orange-300 rounded-lg transform rotate-12 shadow-md border border-orange-400 p-2">
                        <div className="text-xs font-medium text-orange-900">
                          "Buy eggs?"
                        </div>
                      </div>

                      <div className="absolute bottom-32 right-24 w-3 h-3 bg-indigo-600 rounded-full shadow-md"></div>
                      <div className="absolute bottom-34 right-20 w-24 h-20 bg-indigo-300 rounded-lg transform -rotate-3 shadow-md border border-indigo-400 p-2">
                        <div className="text-xs font-medium text-indigo-900">
                          "Split pizza $?"
                        </div>
                      </div>

                      {/* Scattered elements */}
                      <div className="absolute top-20 left-48 w-2 h-2 bg-red-400 rounded-full"></div>
                      <div className="absolute top-48 right-16 w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="absolute bottom-24 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    </div>
                  </div>

                  {/* Before quotes */}
                  <div className="mt-8 grid md:grid-cols-3 gap-4">
                    {beforeAfter.before.map((quote, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-red-200/50"
                      >
                        <div className="flex items-start gap-3">
                          <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700 font-medium">"{quote}"</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === "after" && (
              <motion.div
                key="after"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm border-2 border-purple-200 rounded-3xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-8">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <h3 className="text-3xl font-bold text-purple-700">The Mates Way</h3>
                  </div>

                  {/* Clean app interface mockup */}
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg min-h-[400px]">
                    <div className="space-y-6">
                      {/* Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <h4 className="text-xl font-bold text-gray-900">Household Dashboard</h4>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        </div>
                      </div>

                      {/* Organized sections */}
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Chores */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                            🧹 Chores
                          </h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3 border border-green-200">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Trash: Alex (Today)</span>
                            </div>
                            <div className="flex items-center gap-3 bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Dishes: Sarah (Tue)</span>
                            </div>
                          </div>
                        </div>

                        {/* Groceries */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                            🛒 Shopping
                          </h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-3 border border-purple-200">
                              <CheckCircle2 className="w-4 h-4 text-purple-500" />
                              <span className="text-sm font-medium text-gray-700">Milk ✓</span>
                            </div>
                            <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Eggs (needed)</span>
                            </div>
                          </div>
                        </div>

                        {/* Bills */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                            💸 Bills
                          </h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3 border border-green-200">
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-gray-700">Water: $25 each ✓</span>
                            </div>
                            <div className="flex items-center gap-3 bg-pink-50 rounded-lg p-3 border border-pink-200">
                              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">Pizza: $12 each</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* After benefits */}
                  <div className="mt-8 grid md:grid-cols-3 gap-4">
                    {beforeAfter.after.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-purple-200/50"
                      >
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-700 font-medium">{benefit}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}