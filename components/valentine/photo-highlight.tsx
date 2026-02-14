"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function PhotoHighlight() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative py-32 overflow-hidden bg-foreground/5"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Photo placeholder with parallax */}
          <motion.div
            style={{ y }}
            className="relative aspect-[4/5] rounded-lg overflow-hidden bg-primary/10"
          >
            {/* Placeholder for main photo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <span className="text-3xl text-muted-foreground/50">+</span>
                </div>
                <p className="text-sm text-muted-foreground/50 uppercase tracking-wider">
                  Foto Utama
                </p>
                <p className="text-xs text-muted-foreground/30 mt-2">
                  Tambahkan foto spesial kalian
                </p>
              </div>
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            style={{ opacity }}
            className="space-y-6"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Kenangan Kita
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              Susah Banget
              <br />
              <span className="italic">Buat Lupain Ini Semua</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Semua momen yang udah kita lewati bareng, semua tawa dan cerita, 
              semua hal yang bikin kita jadi &ldquo;kita&rdquo;—aku masih inget semuanya. 
              Dan jujur, aku nggak mau lupa.
            </p>
            <div className="pt-6">
              <div className="w-16 h-px bg-primary/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
