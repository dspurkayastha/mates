"use client";

import { ArrowLeft, Heart, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back button */}
        <a 
          href="/"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </a>

        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Mates</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We believe household management shouldn't be a source of stress. 
            It should bring people together, not drive them apart.
          </p>
        </div>

        {/* Story */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 lg:p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Mates was born from a simple frustration: why is it so hard to manage a shared household? 
              We've all been there—sticky notes everywhere, confusing group chats, and awkward conversations about money.
            </p>
            <p className="mb-4">
              After trying every solution out there (and finding them all either ugly, complicated, or both), 
              we decided to build something different. Something that actually feels good to use.
            </p>
            <p>
              Today, over 15,000 households across 12 countries use Mates to keep their shared lives running smoothly. 
              And we're just getting started.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What We Believe</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Relationships First</h3>
              <p className="text-gray-600">
                Good household management strengthens relationships. It shouldn't create friction.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Simplicity Wins</h3>
              <p className="text-gray-600">
                The best tools disappear into the background. They just work, beautifully.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Everyone Included</h3>
              <p className="text-gray-600">
                From couples to families to friend groups—every household type deserves great tools.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center bg-gray-50 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions, feedback, or just want to say hi? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:hello@mates.app"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              hello@mates.app
            </a>
            <a 
              href="#"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-700 transition-all duration-300"
            >
              Follow on Twitter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}