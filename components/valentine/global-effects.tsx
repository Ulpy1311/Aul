"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

// High Quality Falling Leaves Component - Rose petals & leaves with detail
export function FloatingLeaves() {
    // Generate rich positions for varied, natural falling effect
    const leaves = useMemo(() => {
        const positions = [
            // Layer 1 - Front (larger, more visible)
            { x: 8, delay: 0, duration: 12, size: 18, rotate: 45, type: 'petal', layer: 'front' },
            { x: 22, delay: 1.5, duration: 14, size: 20, rotate: 120, type: 'petal', layer: 'front' },
            { x: 42, delay: 0.8, duration: 13, size: 16, rotate: 200, type: 'leaf', layer: 'front' },
            { x: 58, delay: 2.2, duration: 15, size: 22, rotate: 80, type: 'petal', layer: 'front' },
            { x: 78, delay: 0.5, duration: 11, size: 18, rotate: 160, type: 'leaf', layer: 'front' },
            { x: 92, delay: 1.8, duration: 14, size: 20, rotate: 30, type: 'petal', layer: 'front' },

            // Layer 2 - Middle
            { x: 5, delay: 3, duration: 16, size: 14, rotate: 240, type: 'petal', layer: 'mid' },
            { x: 18, delay: 4.5, duration: 18, size: 12, rotate: 100, type: 'leaf', layer: 'mid' },
            { x: 32, delay: 2.8, duration: 15, size: 15, rotate: 180, type: 'petal', layer: 'mid' },
            { x: 48, delay: 5.2, duration: 17, size: 13, rotate: 60, type: 'leaf', layer: 'mid' },
            { x: 65, delay: 3.5, duration: 16, size: 14, rotate: 280, type: 'petal', layer: 'mid' },
            { x: 82, delay: 4.0, duration: 14, size: 16, rotate: 140, type: 'leaf', layer: 'mid' },
            { x: 95, delay: 6.0, duration: 18, size: 12, rotate: 220, type: 'petal', layer: 'mid' },

            // Layer 3 - Back (smaller, blurred for depth)
            { x: 12, delay: 7, duration: 20, size: 10, rotate: 320, type: 'petal', layer: 'back' },
            { x: 28, delay: 8.5, duration: 22, size: 8, rotate: 40, type: 'leaf', layer: 'back' },
            { x: 45, delay: 6.5, duration: 19, size: 11, rotate: 190, type: 'petal', layer: 'back' },
            { x: 62, delay: 9.0, duration: 21, size: 9, rotate: 70, type: 'leaf', layer: 'back' },
            { x: 75, delay: 7.5, duration: 20, size: 10, rotate: 260, type: 'petal', layer: 'back' },
            { x: 88, delay: 10, duration: 23, size: 8, rotate: 130, type: 'leaf', layer: 'back' },

            // Extra floating pieces for richness
            { x: 3, delay: 11, duration: 17, size: 15, rotate: 90, type: 'petal', layer: 'mid' },
            { x: 38, delay: 12, duration: 16, size: 17, rotate: 270, type: 'petal', layer: 'front' },
            { x: 55, delay: 13, duration: 19, size: 11, rotate: 350, type: 'leaf', layer: 'back' },
            { x: 72, delay: 14, duration: 15, size: 19, rotate: 20, type: 'petal', layer: 'front' },
        ];
        return positions;
    }, []);

    const getLayerStyles = (layer: string) => {
        switch (layer) {
            case 'front':
                return { opacity: 0.8, blur: 0, zIndex: 3 };
            case 'mid':
                return { opacity: 0.5, blur: 0.5, zIndex: 2 };
            case 'back':
                return { opacity: 0.3, blur: 1, zIndex: 1 };
            default:
                return { opacity: 0.5, blur: 0, zIndex: 2 };
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[40]">
            {leaves.map((leaf, i) => {
                const layerStyle = getLayerStyles(leaf.layer);
                return (
                    <motion.div
                        key={i}
                        className="absolute"
                        style={{
                            left: `${leaf.x}%`,
                            top: -30,
                            zIndex: layerStyle.zIndex,
                            filter: `blur(${layerStyle.blur}px)`,
                        }}
                        animate={{
                            y: ["0vh", "110vh"],
                            x: [0, leaf.type === 'petal' ? 40 : -30, leaf.type === 'petal' ? -30 : 40, 10],
                            rotate: [leaf.rotate, leaf.rotate + 180, leaf.rotate + 360],
                        }}
                        transition={{
                            duration: leaf.duration,
                            repeat: Infinity,
                            delay: leaf.delay,
                            ease: "easeInOut",
                        }}
                    >
                        {leaf.type === 'petal' ? (
                            // High Quality Rose Petal with gradient
                            <svg
                                width={leaf.size}
                                height={leaf.size * 1.4}
                                viewBox="0 0 24 34"
                                style={{ opacity: layerStyle.opacity }}
                            >
                                <defs>
                                    <linearGradient id={`petalGrad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fb7185" />
                                        <stop offset="50%" stopColor="#f43f5e" />
                                        <stop offset="100%" stopColor="#e11d48" />
                                    </linearGradient>
                                    <filter id={`petalShadow${i}`}>
                                        <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
                                    </filter>
                                </defs>
                                <path
                                    d="M12 0 C18 6, 24 16, 12 34 C0 16, 6 6, 12 0"
                                    fill={`url(#petalGrad${i})`}
                                    filter={`url(#petalShadow${i})`}
                                />
                                {/* Petal vein detail */}
                                <path
                                    d="M12 4 Q14 12, 12 28"
                                    stroke="rgba(255,255,255,0.3)"
                                    strokeWidth="0.5"
                                    fill="none"
                                />
                            </svg>
                        ) : (
                            // High Quality Leaf with gradient
                            <svg
                                width={leaf.size}
                                height={leaf.size * 0.7}
                                viewBox="0 0 28 18"
                                style={{ opacity: layerStyle.opacity }}
                            >
                                <defs>
                                    <linearGradient id={`leafGrad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fda4af" />
                                        <stop offset="50%" stopColor="#fb7185" />
                                        <stop offset="100%" stopColor="#f43f5e" />
                                    </linearGradient>
                                    <filter id={`leafShadow${i}`}>
                                        <feDropShadow dx="0" dy="1" stdDeviation="0.8" floodOpacity="0.25" />
                                    </filter>
                                </defs>
                                <path
                                    d="M0 9 Q7 0, 14 9 Q21 18, 28 9 Q21 12, 14 9 Q7 6, 0 9"
                                    fill={`url(#leafGrad${i})`}
                                    filter={`url(#leafShadow${i})`}
                                />
                                {/* Leaf vein */}
                                <path
                                    d="M2 9 L26 9"
                                    stroke="rgba(255,255,255,0.25)"
                                    strokeWidth="0.4"
                                    fill="none"
                                />
                            </svg>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}

// Romantic Background with subtle textures
export function RomanticBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Soft gradient base */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-50/40 via-transparent to-rose-50/30" />

            {/* Subtle radial glow - top left */}
            <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-rose-100/30 rounded-full blur-3xl" />

            {/* Subtle radial glow - bottom right */}
            <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-100/30 rounded-full blur-3xl" />

            {/* Center glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 bg-rose-50/20 rounded-full blur-3xl" />

            {/* Subtle pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 C35 10, 40 20, 30 35 C20 20, 25 10, 30 5' fill='%23e11d48' opacity='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Vignette effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.04)_100%)]" />
        </div>
    );
}

// Combined Global Effects Component
export function GlobalEffects() {
    return (
        <>
            <RomanticBackground />
            <FloatingLeaves />
        </>
    );
}
