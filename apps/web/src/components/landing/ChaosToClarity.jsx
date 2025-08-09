"use client";

import { motion } from "motion/react";
import { CheckCircle2, X, ArrowRight } from "lucide-react";

export function ChaosToClarity() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            From <span className="text-red-500">chaos</span> to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              clarity
            </span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed"
          >
            <p className="mb-4">
              Ever juggled sticky notes, group chats, and awkward money talks just to run your household?
            </p>
            <p className="mb-6">
              <strong>Mates makes it <em>one tap simple</em>:</strong>
            </p>
            <div className="text-left space-y-2 inline-block">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Chores get done on time.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Groceries don't get bought twice.</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Bills split themselves.</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Before/After Visual */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <X className="w-6 h-6 text-red-500" />
                <h3 className="text-2xl font-bold text-red-700">Before</h3>
              </div>
              
              {/* Messy sticky notes */}
              <div className="relative h-64">
                <div className="absolute top-4 left-4 w-24 h-24 bg-yellow-200 rounded-lg transform -rotate-12 shadow-md border border-yellow-300 p-2">
                  <div className="text-xs font-medium text-yellow-800">Dishes?</div>
                </div>
                <div className="absolute top-12 right-8 w-28 h-20 bg-pink-200 rounded-lg transform rotate-6 shadow-md border border-pink-300 p-2">
                  <div className="text-xs font-medium text-pink-800">Buy milk again??</div>
                </div>
                <div className="absolute bottom-8 left-12 w-32 h-24 bg-blue-200 rounded-lg transform rotate-3 shadow-md border border-blue-300 p-2">
                  <div className="text-xs font-medium text-blue-800">Who paid electric?</div>
                </div>
                <div className="absolute bottom-4 right-4 w-24 h-28 bg-green-200 rounded-lg transform -rotate-6 shadow-md border border-green-300 p-2">
                  <div className="text-xs font-medium text-green-800">Trash day?</div>
                </div>
                
                {/* Scattered elements */}
                <div className="absolute top-20 left-32 w-2 h-2 bg-red-400 rounded-full"></div>
                <div className="absolute top-32 right-12 w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="absolute bottom-12 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              </div>
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <h3 className="text-2xl font-bold text-purple-700">After</h3>
              </div>
              
              {/* Clean organized interface */}
              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Clear tasks, clear deadlines</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Synced grocery lists</span>
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Auto expense splits</span>
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}