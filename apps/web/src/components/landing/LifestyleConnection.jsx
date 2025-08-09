"use client";

import { motion } from "motion/react";
import { Heart, Users, Home, Sparkles } from "lucide-react";

export function LifestyleConnection() {
  const lifestyleScenarios = [
    {
      icon: Heart,
      title: "Moving in with your partner",
      description: "Start your shared life drama-free with clear expectations",
      color: "from-pink-500 to-red-500",
      bgColor: "bg-pink-50"
    },
    {
      icon: Users,
      title: "Flat-sharing with friends",
      description: "Keep the friendship strong while living together",
      color: "from-purple-500 to-blue-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Home,
      title: "Running a family home",
      description: "Teach kids responsibility while keeping things organized",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    }
  ];

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
            Designed for the way you{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              actually live
            </span>
          </h2>
          
          <div className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed mb-12">
            <p className="mb-4">
              Whether you're moving in with your partner, flat-sharing with friends, or running a family home — 
              Mates keeps things smooth, fair, and drama-free.
            </p>
            <p className="flex items-center justify-center gap-2">
              The look?{" "}
              <span className="font-semibold text-purple-600">Clean.</span>{" "}
              <span className="font-semibold text-pink-600">Minimal.</span>{" "}
              <span className="font-semibold text-blue-600">Seriously aesthetic.</span>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </p>
          </div>
        </motion.div>

        {/* Lifestyle scenarios */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {lifestyleScenarios.map((scenario, index) => (
            <motion.div
              key={scenario.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`${scenario.bgColor} rounded-3xl p-8 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${scenario.color} mb-6`}>
                  <scenario.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {scenario.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {scenario.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Design showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-3xl p-8 lg:p-12 border border-gray-200/50"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Design principles */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Beautiful by design
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Intuitive interface</h4>
                    <p className="text-gray-600">No learning curve. Everything works exactly how you'd expect.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Thoughtful animations</h4>
                    <p className="text-gray-600">Delightful micro-interactions that make household management feel good.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Modern aesthetics</h4>
                    <p className="text-gray-600">Clean, minimal design that looks great on any device.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini phone showcase */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-80 bg-white rounded-3xl shadow-2xl p-4 border border-gray-200">
                  <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 relative overflow-hidden">
                    {/* Floating elements */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl opacity-80"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-60"></div>
                    <div className="absolute top-1/2 left-6 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-lg opacity-70"></div>
                    
                    {/* Center content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm font-semibold text-gray-700">Beautiful</div>
                        <div className="text-xs text-gray-500">Design</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating design elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg shadow-lg"
                ></motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-400 rounded-full shadow-lg"
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}