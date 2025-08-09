"use client";

import { Play, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back button */}
        <a 
          href="/"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </a>

        <div className="text-center mb-12">
          <Play className="w-16 h-16 text-purple-600 mx-auto mb-6" />
          
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            See <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Mates</span> in action
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Watch how Mates transforms household chaos into seamless coordination.
          </p>
        </div>

        {/* Video placeholder */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Play className="w-10 h-10 text-purple-600 ml-1" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Demo Video</h3>
                <p className="text-gray-600">Coming soon - Interactive demo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features showcased */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            What you'll see in the demo
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Chore Management</h3>
              <p className="text-gray-600">See how tasks automatically rotate, send gentle reminders, and track completion.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Shared Shopping Lists</h3>
              <p className="text-gray-600">Watch collaborative lists sync in real-time and prevent duplicate purchases.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-pink-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Bill Splitting</h3>
              <p className="text-gray-600">See receipts get scanned and bills split automatically among housemates.</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
              <CheckCircle2 className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Beautiful Interface</h3>
              <p className="text-gray-600">Experience the clean, intuitive design that makes household management a joy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}