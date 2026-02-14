"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

const memories = [
  {
    id: 1,
    caption: "Waktu pertama kali ketemu",
    placeholder: "bg-primary/10",
  },
  {
    id: 2,
    caption: "Tawa bareng yang nggak bakal lupa",
    placeholder: "bg-accent/10",
  },
  {
    id: 3,
    caption: "Jalan-jalan bareng",
    placeholder: "bg-muted",
  },
  {
    id: 4,
    caption: "Momen sederhana tapi berarti",
    placeholder: "bg-primary/5",
  },
  {
    id: 5,
    caption: "Hari yang bikin aku senyum",
    placeholder: "bg-accent/5",
  },
  {
    id: 6,
    caption: "Kenangan yang susah dilupain",
    placeholder: "bg-secondary",
  },
];

export function GallerySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-32 px-6 bg-card">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            Galeri Kenangan
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-foreground">
            Foto-Foto Kita
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
            Semua momen ini masih tersimpan di hati aku. Dan jujur, aku masih sering liat-liat ini semua.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg cursor-pointer"
              onClick={() => setSelectedImage(memory.id)}
            >
              <div
                className={`absolute inset-0 ${memory.placeholder} transition-transform duration-700 group-hover:scale-105`}
              >
                {/* Placeholder for user photos */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                      <span className="text-2xl text-muted-foreground/50">+</span>
                    </div>
                    <p className="text-xs text-muted-foreground/50 uppercase tracking-wider">
                      Tambah Foto
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-card text-sm font-light">{memory.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-card hover:text-card/80 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="max-w-4xl w-full aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Foto akan ditampilkan di sini</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
