"use client";

import { motion } from "motion/react";
import { ArrowRight, Shield } from "lucide-react";

export function CallToActionSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Join the first 1,000 households
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Early beta is free. Help shape the app and get lifetime perks.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-purple-600 font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Early Access
              <ArrowRight className="inline-block ml-2 w-5 h-5" />
            </motion.button>

            <div className="flex items-center gap-2 text-sm opacity-80">
              <Shield className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
          </div>

          <p className="text-sm opacity-70">
            🚀 Join 1,247 people already on the waitlist
          </p>
        </motion.div>
      </div>
    </section>
  );
}
