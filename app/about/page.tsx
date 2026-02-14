"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Heart, Code2, Cloud, Network, Cpu, Globe, Wrench, Sparkles, Quote, ArrowDown } from "lucide-react"

const skills = [
    { name: "Full-Stack Development", icon: Code2, color: "from-violet-500 to-purple-600", description: "Frontend & Backend" },
    { name: "Cloud Engineering", icon: Cloud, color: "from-sky-500 to-blue-600", description: "AWS, GCP, Azure" },
    { name: "Networking", icon: Network, color: "from-emerald-500 to-teal-600", description: "Infrastructure" },
    { name: "Hardware", icon: Cpu, color: "from-orange-500 to-amber-600", description: "IoT & Systems" },
    { name: "Web3 Engineering", icon: Globe, color: "from-pink-500 to-rose-600", description: "Blockchain & DApps" },
    { name: "Modder & Software", icon: Wrench, color: "from-indigo-500 to-violet-600", description: "Customization" },
]

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])

    return (
        <div ref={containerRef} className="min-h-screen bg-background text-foreground">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-rose-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-violet-200/15 to-pink-100/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-rose-100/5 to-transparent rounded-full" />
            </div>

            {/* Hero Section - Full Screen */}
            <motion.section
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="min-h-screen flex flex-col items-center justify-center px-4 relative"
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center"
                >
                    {/* Decorative Ring */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                        className="relative w-32 h-32 mx-auto mb-10"
                    >
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />
                        <div className="absolute inset-2 rounded-full border border-primary/30" />
                        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/10 to-rose-100/50 flex items-center justify-center">
                            <span className="text-4xl font-light text-primary" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                                MR
                            </span>
                        </div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-6"
                    >
                        Tentang Pembuat Website Ini
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-light mb-6"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                        Muh Rafly
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto mb-4"
                    >
                        Developer. Engineer. Creator. Dreamer.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-sm text-muted-foreground/60"
                    >
                        Orang di balik layar yang membangun semua ini dengan sepenuh hati
                    </motion.p>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-12"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-2 text-muted-foreground"
                    >
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <ArrowDown className="w-4 h-4" />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Skills Section */}
            <section className="py-24 px-4 relative">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                            Keahlian & Passion
                        </p>
                        <h2
                            className="text-3xl md:text-4xl font-light"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                        >
                            Yang Aku Kuasai
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="group relative"
                            >
                                <div className="p-6 md:p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-neutral-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full">
                                    {/* Glow Effect */}
                                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                    {/* Icon */}
                                    <div className={`w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br ${skill.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <skill.icon className="w-7 h-7 text-white" />
                                    </div>

                                    <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                                        {skill.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {skill.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 px-4 relative">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <Sparkles className="w-6 h-6 mx-auto mb-4 text-primary/50" />
                        <h2
                            className="text-3xl md:text-4xl font-light"
                            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                        >
                            Cerita di Balik Website Ini
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Main Card */}
                        <div className="p-8 md:p-12 rounded-[2rem] bg-white/90 backdrop-blur-sm border border-neutral-100 shadow-2xl shadow-rose-100/20 relative overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-6 left-6">
                                <Quote className="w-8 h-8 text-primary/10" />
                            </div>
                            <div className="absolute bottom-6 right-6">
                                <Heart className="w-6 h-6 text-primary/15 fill-primary/5" />
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-rose-100/30 to-transparent rounded-bl-full" />

                            <div
                                className="space-y-8 text-foreground/80 relative z-10"
                                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                            >
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="text-xl md:text-2xl leading-relaxed"
                                >
                                    Hai, terima kasih sudah berkunjung ke sini.
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg md:text-xl leading-relaxed"
                                >
                                    Website ini dibuat dengan sepenuh hati dan perasaan. Aku sampai lupa waktu, lupa sudah berapa lama mengerjakan semua ini. Mungkin buat sebagian orang, website seperti ini terlihat sederhana. Tapi yang tidak terlihat adalah proses di baliknya.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                    className="pl-6 border-l-2 border-primary/30"
                                >
                                    <p className="text-lg md:text-xl leading-relaxed italic text-foreground/70">
                                        Memproses semua kata di dalam kepala, mencoba mengeluarkan apa yang ada di hati, dan menuangkannya menjadi sesuatu yang bisa dibaca orang lain. Itu tidak mudah. Setiap paragraf butuh keberanian. Setiap kalimat butuh kejujuran.
                                    </p>
                                </motion.div>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="text-lg md:text-xl leading-relaxed"
                                >
                                    Mungkin ini terdengar berlebihan atau "alay" buat sebagian orang. Tapi ini benar adanya. Perasaan yang ditulis di sini bukan rekayasa. Dan proses membangun website ini bukan sekadar coding, tapi juga proses introspeksi dan berdamai dengan diri sendiri.
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    className="text-lg md:text-xl leading-relaxed"
                                >
                                    Aku berharap website ini bisa terus berdiri selama aku masih mampu menjaganya. Selama server masih berjalan, selama domain masih aktif, aku akan pastikan semua ini tetap ada. Karena ini bukan sekadar website. Ini adalah jejak perasaan yang nyata.
                                </motion.p>

                                {/* Signature */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 }}
                                    className="pt-8 mt-8 border-t border-neutral-100"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">Dengan sepenuh hati,</p>
                                            <p className="text-2xl md:text-3xl italic text-foreground">Muh Rafly</p>
                                        </div>
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-rose-100/50 flex items-center justify-center">
                                            <Heart className="w-6 h-6 text-primary/50 fill-primary/20" />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Closing Section */}
            <section className="py-24 px-4 relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-100 shadow-sm mb-8">
                        <Heart className="w-4 h-4 text-primary fill-primary/30" />
                        <span className="text-sm text-muted-foreground">Pesan Terakhir</span>
                        <Heart className="w-4 h-4 text-primary fill-primary/30" />
                    </div>

                    <p
                        className="text-xl md:text-2xl text-foreground/70 leading-relaxed italic mb-8"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                        "Jadilah website yang sekarang kamu kunjungi ini sebagai bukti bahwa perasaan tulus itu nyata,
                        dan bisa dituangkan ke dalam sesuatu yang bisa dilihat dan dirasakan orang lain."
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Terima kasih sudah meluangkan waktu
                    </p>
                </motion.div>
            </section>

            {/* Footer Spacer */}
            <div className="h-20" />

            {/* CSS for slow spin animation */}
            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
            `}</style>
        </div>
    )
}
