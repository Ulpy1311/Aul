"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart } from "lucide-react";

const promises = [
  "Jangan sungkan sama aku, jangan malu, jangan gengsi—karena aku masih tetap yang sama",
  "Aku masih jadi orang yang sama juga, nggak beda. Jangan mikir aku bakal ini itu atau kepikiran hal ini itu lagi",
  "Aku sesayang itu sama kamu, susah banget buat lupain di masa-masa itu",
  "Aku cuman mau sama kamu aja, dan aku masih berharap kita bisa kembali seperti dulu",
];

export function PromiseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6 bg-primary/5">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Yang Perlu Kamu Tahu
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            Aku Masih Yang Sama
          </h2>
        </motion.div>

        <div className="space-y-6">
          {promises.map((promise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="flex items-start gap-4 p-6 bg-card rounded-lg border border-border/50"
            >
              <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
              <p className="font-serif text-lg text-foreground/80">{promise}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
