"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Heart, PenLine } from "lucide-react"

interface VisitorFormProps {
    onSuccess: () => void
}

export function VisitorForm({ onSuccess }: VisitorFormProps) {
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [gender, setGender] = useState<"male" | "female">("male")
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name || !message) return

        setIsLoading(true)
        try {
            await fetch("/api/visitors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, message, gender }),
            })
            setName("")
            setMessage("")
            setGender("male")
            setIsSent(true)
            setTimeout(() => setIsSent(false), 3000)
            onSuccess()
        } catch (error) {
            console.error("Failed to submit", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-lg mx-auto"
        >
            <div className="relative p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-neutral-100 shadow-xl shadow-rose-100/20">
                {/* Decorative Corner */}
                <div className="absolute top-4 right-4">
                    <PenLine className="w-5 h-5 text-primary/30" />
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-rose-100 flex items-center justify-center"
                    >
                        <Heart className="w-5 h-5 text-primary fill-primary/20" />
                    </motion.div>
                    <h3
                        className="text-2xl text-foreground mb-2"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                        Bagikan Kesanmu
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Apa yang kamu rasakan setelah membaca?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                            Nama
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-neutral-50/80 border border-neutral-200/80 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm placeholder:text-neutral-400"
                            placeholder="Siapa namamu?"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Gender Selection */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                            Gender (untuk Avatar)
                        </label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setGender("male")}
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${gender === "male"
                                        ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                                        : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                                    }`}
                            >
                                Male 👨
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender("female")}
                                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${gender === "female"
                                        ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
                                        : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                                    }`}
                            >
                                Female 👩
                            </button>
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                            Pesan
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-neutral-50/80 border border-neutral-200/80 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm resize-none h-28 placeholder:text-neutral-400"
                            placeholder="Ceritakan kesan atau pendapatmu..."
                            disabled={isLoading}
                        />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading || !name || !message}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-rose-400 text-white font-medium text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Heart className="w-4 h-4" />
                            </motion.div>
                        ) : isSent ? (
                            <>
                                <Heart className="w-4 h-4 fill-current" /> Terkirim!
                            </>
                        ) : (
                            <>
                                Kirim Pesan <Send className="w-4 h-4" />
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Success Message */}
                {isSent && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-center text-sm text-primary"
                    >
                        Terima kasih sudah meninggalkan pesan! 💕
                    </motion.p>
                )}
            </div>
        </motion.div>
    )
}
