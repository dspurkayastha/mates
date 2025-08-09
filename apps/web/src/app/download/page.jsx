"use client";

import { Download, Apple, Smartphone, ArrowLeft } from "lucide-react";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </a>

        <div className="text-center">
          <Download className="w-16 h-16 text-purple-600 mx-auto mb-6" />

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Download{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Mates
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Get the household management app that actually makes life easier.
            Available for all your devices.
          </p>

          {/* Download options */}
          <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
            <button className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-900 transition-colors">
              <Apple className="w-6 h-6" />
              <div className="text-left">
                <div className="text-sm">Download on the</div>
                <div>App Store</div>
              </div>
            </button>

            <button className="flex items-center justify-center gap-3 bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-green-700 transition-colors">
              <Smartphone className="w-6 h-6" />
              <div className="text-left">
                <div className="text-sm">Get it on</div>
                <div>Google Play</div>
              </div>
            </button>
          </div>

          <div className="mt-12 text-center text-gray-500">
            <p>Beta version • Free during early access</p>
          </div>
        </div>
      </div>
    </div>
  );
}
