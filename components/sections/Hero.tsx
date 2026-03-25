'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { SlotCounter } from '@/components/ui/SlotCounter';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Generate a random initial rotation for the logo
  const initialRotate = useRef(Math.random() * 360).current;

  // Smooth out the mouse movements
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Create the dynamic radial gradient string
  const background = useMotionTemplate`radial-gradient(circle 800px at ${springX}px ${springY}px, rgba(109, 40, 217, 0.25), transparent 80%)`;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    };

    // Set initial position to center
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(rect.width / 2);
      mouseY.set(rect.height / 2);
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0c0a1d] pt-32 pb-24 overflow-hidden"
    >
      {/* Background Logo Watermark */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.12] pointer-events-none">
        <motion.img 
          src="/logo.svg" 
          alt="" 
          className="w-[1000px] h-[1000px] object-contain"
          animate={{
            rotate: [initialRotate, initialRotate + 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-gold mb-8 text-sm font-medium backdrop-blur-sm shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
            </span>
            Trusted by 200+ clinics & salons in the UK
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
            Your AI receptionist.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-yellow-200 to-white">
              Always on.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            Resevia answers calls, books appointments and handles enquiries 24/7 — so you can focus on your clients, not your phone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 items-center mb-8">
            <Link href="/waitlist">
              <Button size="lg" className="bg-brand-gold text-brand-black hover:bg-yellow-400 focus:ring-yellow-400 border-none shadow-[0_0_30px_rgba(201,169,110,0.3)]">
                Join the Waitlist — It's Free
              </Button>
            </Link>
          </div>

          <div className="mb-20">
            <SlotCounter theme="dark" />
          </div>

          {/* Trust Elements / Integrations */}
          <div className="border-t border-white/10 pt-10 mt-8 max-w-4xl mx-auto">
            <p className="text-xs text-brand-gray uppercase tracking-widest mb-6 font-semibold">Integrates seamlessly with your current tools</p>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              {["Fresha", "Treatwell", "Timely", "Phorest"].map((tool) => (
                <div key={tool} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(201,169,110,0.2)] bg-white/70 backdrop-blur-md shadow-sm transition-transform hover:-translate-y-1">
                  <svg className="w-5 h-5 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-brand-black font-display font-semibold text-lg">{tool}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
