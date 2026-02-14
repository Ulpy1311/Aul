"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"
import { VisitorForm } from "@/components/valentine/visitor-form"
import { VisitorList } from "@/components/valentine/visitor-list"

export default function VisitorPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    return (
        <main className="min-h-screen w-full bg-gradient-to-b from-rose-50/50 via-background to-background text-foreground relative overflow-hidden">
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-50/40 via-transparent to-transparent" />
            </div>

            {/* Hero Section */}
            <div className="pt-32 pb-16 px-4 text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Spacer */}
                    <div className="h-8" />

                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-foreground"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                        Gimana menurutmu?
                    </h1>
                    <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto leading-relaxed">
                        Makasih banget udah mau baca sampai habis.
                        Kalau ada yang mau disampein—entah itu semangat, saran, atau sekadar sapaan hangat—tulis aja di sini ya.
                        Anggap aja kita lagi ngobrol santai sesama teman. Saling support itu indah, kan?
                    </p>
                </motion.div>

                {/* Decorative Line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-10 w-32 h-px mx-auto bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                />
            </div>

            {/* Form Section */}
            <div className="px-4 relative z-10">
                <VisitorForm onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
            </div>

            {/* Divider */}
            <div className="my-16 flex items-center justify-center gap-4 px-4">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-neutral-200" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-neutral-100"
                >
                    <Heart className="w-3 h-3 text-primary fill-primary/30" />
                    <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
                        Pendapat Pembaca
                    </span>
                    <Heart className="w-3 h-3 text-primary fill-primary/30" />
                </motion.div>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-neutral-200" />
            </div>

            {/* Messages List */}
            <div className="px-4 pb-20 relative z-10">
                <VisitorList refreshTrigger={refreshTrigger} />
            </div>

            {/* Footer Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-rose-50/30 to-transparent pointer-events-none" />
        </main>
    )
}
