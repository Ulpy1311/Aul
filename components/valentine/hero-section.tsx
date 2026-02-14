"use client";

import { motion } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <Heart className="w-12 h-12 mx-auto text-primary/60 mb-6" strokeWidth={1} />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6"
        >
          Valentine&apos;s Day 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-tight text-foreground mb-8 text-balance"
        >
          Hai, Kamu
          <br />
          <span className="italic">yang masih kucintai</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed"
        >
          Di hari Valentine ini, aku ingin menyampaikan sesuatu—
          <br className="hidden md:block" />
          yang selama ini hanya bisa kupendam sendiri.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-16"
        >
          <div className="flex flex-col items-center gap-3 text-primary/80">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-px h-12 bg-primary/50" />
              <ChevronDown className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
