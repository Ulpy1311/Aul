"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart } from "lucide-react";

export function ClosingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6 bg-card relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-12"
          >
            <Heart className="w-16 h-16 mx-auto text-primary/60" strokeWidth={1} />
          </motion.div>

          <h2 className="font-serif text-4xl md:text-6xl font-light text-foreground mb-8 italic">
            Masih Berharap
          </h2>

          <div className="space-y-6 font-serif text-lg md:text-xl leading-relaxed text-foreground/80">
            <p>
              Aku tau ini mungkin nyiksa banget buat aku sendiri. Tapi memang aku sesayang itu 
              sama kamu. Susah banget buat lupain semua momen yang udah kita lewati bareng.
            </p>

            <p>
              Aku nggak maksa kamu untuk apa-apa. Aku cuma mau kamu tau, aku masih di sini. 
              Masih sama. Masih berharap. Dan kalau suatu hari kamu mau balik lagi, aku selalu ada.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 pt-16 border-t border-border/50"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Dengan semua rasa yang masih tersisa
            </p>
            <p className="font-serif text-3xl md:text-4xl text-foreground italic">
              Dari Aku yang Masih Sayang
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-16 text-sm text-muted-foreground"
          >
            Valentine&apos;s Day 2026
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
