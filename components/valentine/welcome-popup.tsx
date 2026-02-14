"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, ArrowDownRight, Music } from "lucide-react"

export function WelcomePopup() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        // Show popup after a short delay to let specific animations finish
        const timer = setTimeout(() => {
            setIsOpen(true)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    const handleDismiss = () => {
        setIsOpen(false)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
                        onClick={handleDismiss}
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
                        className="fixed bottom-24 right-4 z-[70] max-w-[320px] md:bottom-32 md:right-10"
                    >
                        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black/80 p-6 shadow-2xl backdrop-blur-xl">
                            {/* Decorative background glow */}
                            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />

                            <div className="relative flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                                        <Music className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white">Music On! 🎵</h3>
                                </div>

                                <p className="text-sm leading-relaxed text-white/80">
                                    Suara lagunya terlalu keras? Kamu bisa <span className="text-white font-medium">mengecilkan</span> atau <span className="text-white font-medium">mematikannya</span> lewat tombol di kanan bawah ya.
                                </p>

                                <div className="flex items-center justify-between gap-4 pt-2">
                                    <div className="flex items-center gap-1 text-xs text-primary/80">
                                        <ArrowDownRight className="h-4 w-4" />
                                        <span>Controls di sana</span>
                                    </div>

                                    <button
                                        onClick={handleDismiss}
                                        className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                                    >
                                        Oke, Mengerti
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Arrow pointing to the actual music player */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="absolute -bottom-16 -right-2 h-16 w-12"
                        >
                            <svg viewBox="0 0 50 100" className="h-full w-full drop-shadow-md">
                                <path
                                    d="M10,10 Q30,50 40,90"
                                    fill="none"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="2"
                                    strokeDasharray="4 4"
                                    className="opacity-60"
                                />
                                <path
                                    d="M35,80 L40,90 L45,80"
                                    fill="none"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="2"
                                />
                            </svg>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
