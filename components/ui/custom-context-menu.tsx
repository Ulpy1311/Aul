"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    RotateCcw,
    Copy,
    ArrowLeft,
    ArrowRight,
    Share2,
    Home,
    Heart
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function CustomContextMenu() {
    const [visible, setVisible] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()

            // Adjust position to keep menu within viewport
            const x = Math.min(e.clientX, window.innerWidth - 250)
            const y = Math.min(e.clientY, window.innerHeight - 300)

            setPosition({ x, y })
            setVisible(true)
        }

        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setVisible(false)
            }
        }

        const handleScroll = () => {
            setVisible(false)
        }

        document.addEventListener("contextmenu", handleContextMenu)
        document.addEventListener("click", handleClick)
        document.addEventListener("scroll", handleScroll)

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu)
            document.removeEventListener("click", handleClick)
            document.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const handleAction = (action: () => void) => {
        action()
        setVisible(false)
    }

    const menuItems = [
        {
            label: "Back",
            icon: ArrowLeft,
            action: () => router.back(),
            shortcut: "Alt + ←",
            disabled: pathname === "/"
        },
        {
            label: "Forward",
            icon: ArrowRight,
            action: () => router.forward(),
            shortcut: "Alt + →"
        },
        {
            label: "Reload",
            icon: RotateCcw,
            action: () => window.location.reload(),
            shortcut: "Ctrl + R"
        },
        {
            type: "separator"
        },
        {
            label: "Copy Link",
            icon: Copy,
            action: () => {
                navigator.clipboard.writeText(window.location.href)
            },
            shortcut: "Ctrl + C"
        },
        {
            label: "Return Home",
            icon: Home,
            action: () => router.push("/"),
            disabled: pathname === "/"
        }
    ]

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="fixed z-[9999] min-w-[240px] overflow-hidden rounded-xl border border-white/20 bg-black/80 p-1.5 shadow-2xl backdrop-blur-xl supports-[backdrop-filter]:bg-black/60"
                    style={{
                        top: position.y,
                        left: position.x
                    }}
                >
                    <div className="flex flex-col gap-1">
                        <div className="px-2 py-1.5 text-xs font-medium text-white/40">
                            Navigation
                        </div>

                        {menuItems.map((item, index) => {
                            if (item.type === "separator") {
                                return <div key={index} className="my-1 h-px bg-white/10" />
                            }

                            const Icon = item.icon!

                            return (
                                <button
                                    key={index}
                                    onClick={() => !item.disabled && handleAction(item.action!)}
                                    disabled={item.disabled}
                                    className={`
                    group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-all
                    ${item.disabled
                                            ? "cursor-not-allowed opacity-50"
                                            : "hover:bg-white/10 text-white/90 hover:text-white cursor-none"
                                        }
                  `}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.shortcut && (
                                        <span className="text-xs text-white/30 group-hover:text-white/50">
                                            {item.shortcut}
                                        </span>
                                    )}
                                </button>
                            )
                        })}

                        <div className="my-1 h-px bg-white/10" />

                        <div className="px-2 py-1.5 text-[10px] text-center text-white/20 font-medium">
                            Made with <Heart className="inline h-2 w-2 text-red-500 mx-0.5 fill-red-500" /> for Aulia
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
