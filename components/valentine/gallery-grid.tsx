"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"

export function GalleryGrid() {
    // Create an array of 50 empty items
    const placeholders = Array.from({ length: 50 }, (_, i) => i + 1)

    return (
        <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
                {placeholders.map((item, index) => (
                    <motion.div
                        key={item}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.02, // Stagger effect
                            type: "spring",
                            bounce: 0.3
                        }}
                        whileHover={{
                            scale: 1.05,
                            zIndex: 10,
                            rotate: Math.random() * 2 - 1 // Slight random tilt
                        }}
                        className="group relative aspect-[3/4] cursor-pointer"
                    >
                        {/* Card Content */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl bg-neutral-100 border-2 border-neutral-400 shadow-md transition-all duration-300 group-hover:border-primary/60 group-hover:bg-white group-hover:shadow-xl">

                            {/* Placeholder Indicator */}
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-300 transition-colors group-hover:text-neutral-500">
                                <div className="rounded-full bg-neutral-100 p-3 group-hover:bg-pink-50 group-hover:text-pink-500 group-hover:scale-110 transition-all duration-300">
                                    <Plus className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-medium tracking-wider">SLOT {item}</span>
                            </div>
                        </div>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}
