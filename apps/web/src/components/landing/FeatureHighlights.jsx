"use client";

import { motion } from "motion/react";
import { featureHighlights } from "./constants";

export function FeatureHighlights() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Three things that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              just work
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to run a household, beautifully simplified.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {featureHighlights.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px rgba(147, 51, 234, 0.15)"
              }}
              className="group relative"
            >
              {/* Glassmorphic card */}
              <div className="relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Icon with emoji */}
                  <div className="flex items-center justify-center w-16 h-16 mb-6 mx-auto">
                    <div className="text-4xl">{feature.emoji}</div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Decorative element */}
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional visual elements */}
        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50 rounded-full px-6 py-3"
          >
            <span className="text-purple-700 font-medium">
              No setup fees • No learning curve • No drama
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}