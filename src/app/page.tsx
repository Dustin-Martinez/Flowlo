'use client';

import Link from "next/link";
import VantaGlobe from "../components/particleBackground";
import AuthModal from "../components/authModal";
import { useState } from "react";
import { FolderKanban, LayoutDashboard, CheckSquare, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      icon: <FolderKanban className="w-5 h-5" />,
      title: "Projects",
      description: "Organize work into clear, focused projects",
      color: "text-[#8B4513]"
    },
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: "Boards", 
      description: "Visual workflow with intuitive drag-and-drop",
      color: "text-[#A0522D]"
    },
    {
      icon: <CheckSquare className="w-5 h-5" />,
      title: "Tasks",
      description: "Assign, track, and collaborate seamlessly",
      color: "text-[#D2691E]"
    }
  ];

  const handleAuthClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <>
      {/* Vanta Globe Background */}
      <div className="fixed inset-0 -z-10">
        <VantaGlobe />
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <main className="min-h-screen relative z-10">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-30 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8B4513]" />
              <span className="text-lg font-medium text-[#5C4033]">Flowlo</span>
            </div>
            <button
              onClick={handleAuthClick}
              className="px-4 py-2 text-sm font-medium text-[#5C4033] rounded-lg border border-[#90645A]/30 hover:border-[#90645A] hover:bg-white/10 transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Section - Left aligned for better reading */}
        <section className="min-h-screen px-6 flex items-center">
          <div className="max-w-7xl mx-auto w-full relative z-20 pt-16">
            {/* Subtle decorative element */}
            <div className="mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#90645A] to-[#DCAE96] mb-4"></div>
              <span className="text-sm font-medium text-[#8B4513] tracking-wider">PROJECT MANAGEMENT</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#5C4033] mb-6 leading-tight">
              Streamline your workflow
              <span className="block text-[#90645A] font-normal mt-2">with intuitive clarity</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-[#5C4033]/90 mb-10 max-w-xl leading-relaxed">
              A minimalist project management tool designed for modern teams who value focus and efficiency.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <button
                onClick={handleAuthClick}
                className="group px-8 py-4 bg-[#5C4033] text-white font-medium rounded-lg hover:bg-[#6D4C3B] transition-all duration-300 flex items-center gap-2 shadow-sm"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Link
                href="#features"
                className="px-8 py-4 text-[#5C4033] font-medium rounded-lg border border-[#90645A]/30 hover:border-[#90645A] hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              >
                <span>See Features</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust indicator */}
            <div className="mt-12 pt-6 border-t border-[#90645A]/20">
              <p className="text-sm text-[#5C4033]/70">
                Trusted by teams at <span className="font-medium text-[#8B4513]">innovative companies</span>
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-light text-[#5C4033] mb-4">
                Everything you need, nothing you don't
              </h2>
              <p className="text-[#5C4033]/80 max-w-md mx-auto">
                A focused set of tools designed for maximum productivity
              </p>
            </div>
            
            {/* Feature Cards Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {features.map((feature, index) => (
    <div
      key={index}
      className={`group relative p-6 rounded-xl transition-all duration-500 ease-in-out overflow-hidden ${
        hoveredFeature === index 
          ? 'scale-[1.02] shadow-xl' 
          : 'bg-[#FDFBF5]/80 border border-[#90645A]/20'
      }`}
      onMouseEnter={() => setHoveredFeature(index)}
      onMouseLeave={() => setHoveredFeature(null)}
    >
      {/* Backdrop blur overlay on hover */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
        hoveredFeature === index 
          ? 'backdrop-blur-md bg-white/30 opacity-10' 
          : 'opacity-0'
      }`}></div>
      
      {/* Subtle gradient overlay for depth */}
      <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
        hoveredFeature === index 
          ? 'bg-gradient-to-br from-[#90645A]/10 to-[#DCAE96]/5 opacity-100' 
          : 'bg-gradient-to-br from-[#F5F5DC]/10 to-[#F5F5DC]/5 opacity-100'
      }`}></div>
      
      {/* Content container */}
      <div className="relative z-10">
        {/* Icon Container */}
        <div className={`mb-5 p-3 rounded-lg w-fit transition-all duration-500 ease-in-out ${
          hoveredFeature === index 
            ? 'bg-white/50 transform translate-y-0' 
            : `${feature.color} bg-[#F5F5DC]/60 transform translate-y-0`
        }`}>
          {feature.icon}
        </div>
        
        <h3 className={`text-xl font-medium mb-3 transition-all duration-500 ease-in-out ${
          hoveredFeature === index 
            ? 'text-[#5C4033] transform translate-y-0' 
            : 'text-[#5C4033] transform translate-y-0'
        }`}>
          {feature.title}
        </h3>
        
        <p className={`text-sm leading-relaxed transition-all duration-600 ease-in-out ${
          hoveredFeature === index 
            ? 'text-[#5C4033]/90 opacity-100 transform translate-y-0' 
            : 'text-[#5C4033]/80 opacity-100 transform translate-y-0'
        }`}>
          {feature.description}
        </p>
        
        {/* Subtle bottom accent line */}
        <div className={`mt-6 pt-4 border-t transition-all duration-700 ease-in-out ${
          hoveredFeature === index 
            ? 'border-[#90645A]/30' 
            : 'border-[#90645A]/20'
        }`}></div>
        
        {/* Hover indicator arrow */}
        <div className={`absolute top-6 right-6 transition-all duration-500 ease-in-out transform ${
          hoveredFeature === index 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-2'
        }`}>
          <ChevronRight className="w-4 h-4 text-[#8B4513]/70" />
        </div>
      </div>
    </div>
  ))}
</div>

            {/* Bottom CTA Card */}
            <div className="mt-16 max-w-2xl mx-auto p-8 rounded-xl bg-white/5 backdrop-blur-[1px] border border-white/10 text-center">
              <h3 className="text-xl font-medium text-[#5C4033] mb-4">
                Ready to simplify your workflow?
              </h3>
              <p className="text-[#5C4033]/80 mb-6 max-w-md mx-auto">
                Join teams who have transformed their project management with Flowlo.
              </p>
              <button
                onClick={handleAuthClick}
                className="px-6 py-3 text-[#5C4033] font-medium rounded-lg border border-[#90645A]/30 hover:border-[#90645A] hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2"
              >
                <span>Start Free Trial</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-[#90645A]/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#8B4513]" />
                  <span className="text-lg font-medium text-[#5C4033]">Flowlo</span>
                </div>
                <p className="text-sm text-[#5C4033]/60 mt-2">
                  Minimalist project management for focused teams
                </p>
              </div>
              
              <div className="flex flex-col items-center md:items-end">
                <p className="text-sm text-[#5C4033]/60 mb-2">
                  © {new Date().getFullYear()} Flowlo. All rights reserved.
                </p>
                <div className="flex gap-6">
                  <Link href="#" className="text-sm text-[#5C4033]/70 hover:text-[#8B4513] transition-colors">
                    Privacy
                  </Link>
                  <Link href="#" className="text-sm text-[#5C4033]/70 hover:text-[#8B4513] transition-colors">
                    Terms
                  </Link>
                  <Link href="#" className="text-sm text-[#5C4033]/70 hover:text-[#8B4513] transition-colors">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}