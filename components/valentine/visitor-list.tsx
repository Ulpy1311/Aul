"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Heart, MessageCircle } from "lucide-react"

interface Visitor {
    id: string
    name: string
    message: string
    createdAt: string
    avatar?: string
    gender?: "male" | "female"
}

// Generate consistent color based on name
function getAvatarColor(name: string): string {
    const colors = [
        "from-rose-400 to-pink-500",
        "from-violet-400 to-purple-500",
        "from-blue-400 to-indigo-500",
        "from-emerald-400 to-teal-500",
        "from-amber-400 to-orange-500",
        "from-pink-400 to-rose-500",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export function VisitorList({ refreshTrigger }: { refreshTrigger: number }) {
    const [visitors, setVisitors] = useState<Visitor[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchVisitors = async () => {
            setIsLoading(true)
            try {
                const res = await fetch("/api/visitors")
                const data = await res.json()
                setVisitors(data)
            } catch (error) {
                console.error("Failed to fetch visitors", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchVisitors()
    }, [refreshTrigger])

    if (isLoading) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl bg-white/50 border border-neutral-100 animate-pulse"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-neutral-200" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-24 bg-neutral-200 rounded" />
                                    <div className="h-3 w-full bg-neutral-100 rounded" />
                                    <div className="h-3 w-2/3 bg-neutral-100 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {visitors.map((visitor, index) => (
                        <motion.div
                            key={visitor.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="group relative"
                        >
                            <div className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-rose-100/30 transition-all duration-300">
                                {/* Decorative Heart */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Heart className="w-4 h-4 text-primary/30 fill-primary/10" />
                                </div>

                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    {/* Avatar */}
                                    <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-md bg-neutral-100 flex-shrink-0">
                                        {visitor.avatar ? (
                                            <img
                                                src={visitor.avatar}
                                                alt={visitor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={`https://api.dicebear.com/7.x/${visitor.gender === 'female' ? 'lorelei' : 'adventurer'}/svg?seed=${visitor.name}&backgroundColor=${visitor.gender === 'female' ? 'ffdfbf,ffd5dc,c0aede' : 'd1d4f9,b6e3f4,c0aede'}`}
                                                alt={visitor.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {/* Header */}
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <h4 className="font-medium text-foreground truncate">
                                                {visitor.name}
                                            </h4>
                                            <span className="text-[10px] text-muted-foreground bg-neutral-100/80 px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                                                {formatDistanceToNow(new Date(visitor.createdAt), {
                                                    addSuffix: true,
                                                    locale: id
                                                })}
                                            </span>
                                        </div>

                                        {/* Message */}
                                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {visitor.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {visitors.length === 0 && !isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-16 text-center"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
                        <MessageCircle className="w-7 h-7 text-neutral-400" />
                    </div>
                    <p className="text-muted-foreground text-sm mb-1">
                        Belum ada yang berbagi kesan
                    </p>
                    <p className="text-muted-foreground/60 text-xs">
                        Jadilah yang pertama membagikan pendapatmu!
                    </p>
                </motion.div>
            )}
        </div>
    )
}
