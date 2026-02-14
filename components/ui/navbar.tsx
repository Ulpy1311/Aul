"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Menu, X, Sparkles, Lock, Heart } from "lucide-react"

const navItems = [
    { name: "For Aulia", href: "/" },
    { name: "Gallery", href: "/gallery" },
    { name: "Visitor", href: "/visitor" },
    { name: "Chat AI", href: "/chat-ai" },
    { name: "About", href: "/about" },
]

export function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const isChatPage = pathname === "/chat-ai"

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-500",
                    scrolled
                        ? "h-16 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50 shadow-sm"
                        : "h-20 bg-transparent"
                )}
            >
                {/* Brand Identity */}
                <div className="flex items-center gap-4 flex-1">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {isChatPage ? (
                                    <motion.div
                                        key="sparkles"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 180 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Sparkles className="w-6 h-6 text-neutral-900" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="heart"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 180 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative w-full h-full"
                                    >
                                        <img
                                            src="/heart-nav-logo.png"
                                            alt="Logo"
                                            className="w-full h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col">
                            <span
                                className="text-xl font-serif text-neutral-900 tracking-tight leading-none"
                                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                            >
                                {isChatPage ? "Aulia AI" : "Valentine"}
                            </span>
                        </div>
                    </Link>

                    {/* Status Indicator (Desktop) */}
                    {isChatPage && (
                        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100/80 border border-neutral-200">
                            <Lock className="w-3 h-3 text-neutral-400" />
                            <span className="text-[10px] uppercase tracking-wider font-medium text-neutral-500">Private Preview</span>
                        </div>
                    )}
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center justify-center flex-1">
                    <ul className="flex items-center gap-1 p-1 bg-white/50 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "relative px-4 py-1.5 text-sm font-medium transition-all duration-300 rounded-full block",
                                            isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800"
                                        )}
                                    >
                                        {item.name}
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-full -z-10 border border-black/5"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Right Area / Mobile Toggle */}
                <div className="flex-1 flex justify-end">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-full hover:bg-black/5 transition-colors"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6 text-neutral-900" /> : <Menu className="w-6 h-6 text-neutral-900" />}
                    </button>

                    {/* Placeholder for future user/profile actions */}
                    <div className="hidden md:block w-8" />
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 md:hidden"
                    >
                        <nav className="flex flex-col gap-4">
                            {navItems.map((item, i) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "text-2xl font-serif tracking-tight block py-3 border-b border-neutral-100",
                                            pathname === item.href ? "text-rose-500" : "text-neutral-800"
                                        )}
                                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        {isChatPage && (
                            <div className="mt-8 flex items-center justify-center gap-2 text-neutral-400">
                                <Lock className="w-4 h-4" />
                                <span className="text-xs uppercase tracking-widest">Private Preview Mode</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
