"use client";

import { motion } from "framer-motion";

// Dreamy Valentine City Park Scene
// A peaceful, ideal world celebrating human connection
export function ValentineScene() {
    return (
        <div className="absolute inset-0 z-[-1] overflow-hidden">
            <svg
                className="absolute bottom-0 left-0 w-full h-full"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMax slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Warm Sky Gradient - Golden Hour Feel */}
                    <linearGradient id="warmSky" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fff7ed" /> {/* Warm cream */}
                        <stop offset="40%" stopColor="#fef3c7" /> {/* Soft yellow */}
                        <stop offset="100%" stopColor="#fce7f3" /> {/* Soft pink */}
                    </linearGradient>

                    {/* Pastel Building Colors */}
                    <linearGradient id="buildingPink" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fecdd3" />
                        <stop offset="100%" stopColor="#fda4af" />
                    </linearGradient>
                    <linearGradient id="buildingCream" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fef3c7" />
                        <stop offset="100%" stopColor="#fde68a" />
                    </linearGradient>
                    <linearGradient id="buildingOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fed7aa" />
                        <stop offset="100%" stopColor="#fdba74" />
                    </linearGradient>
                    <linearGradient id="buildingPeach" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fecaca" />
                        <stop offset="100%" stopColor="#fca5a5" />
                    </linearGradient>

                    {/* Grass Gradient */}
                    <linearGradient id="grassGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#bbf7d0" />
                        <stop offset="100%" stopColor="#86efac" />
                    </linearGradient>
                    <linearGradient id="grassDark" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#86efac" />
                        <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>

                    {/* Path */}
                    <linearGradient id="pathColor" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fef3c7" />
                        <stop offset="100%" stopColor="#fde68a" />
                    </linearGradient>

                    {/* Soft shadow */}
                    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* === WARM SKY === */}
                <rect width="100%" height="100%" fill="url(#warmSky)" />

                {/* === SOFT CLOUDS === */}
                <motion.g
                    animate={{ x: [0, 20, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                >
                    <g opacity="0.6" fill="#fff">
                        <ellipse cx="150" cy="120" rx="60" ry="30" />
                        <ellipse cx="200" cy="130" rx="70" ry="35" />
                        <ellipse cx="260" cy="120" rx="50" ry="25" />
                    </g>
                    <g opacity="0.5" fill="#fff">
                        <ellipse cx="900" cy="100" rx="55" ry="28" />
                        <ellipse cx="960" cy="110" rx="65" ry="32" />
                        <ellipse cx="1020" cy="100" rx="50" ry="25" />
                    </g>
                </motion.g>

                {/* === CITY SKYLINE - Simple, Rounded, Pastel === */}
                <g filter="url(#softGlow)">
                    {/* Far Left */}
                    <rect x="20" y="420" width="60" height="180" rx="20" fill="url(#buildingPink)" />
                    <rect x="90" y="380" width="80" height="220" rx="25" fill="url(#buildingCream)" />
                    <rect x="180" y="440" width="55" height="160" rx="18" fill="url(#buildingOrange)" />
                    <rect x="245" y="400" width="70" height="200" rx="22" fill="url(#buildingPeach)" />

                    {/* Center Left */}
                    <rect x="340" y="350" width="65" height="250" rx="20" fill="url(#buildingPink)" />
                    <rect x="415" y="400" width="75" height="200" rx="24" fill="url(#buildingCream)" />

                    {/* Center */}
                    <rect x="520" y="320" width="90" height="280" rx="28" fill="url(#buildingOrange)" />
                    <rect x="620" y="370" width="70" height="230" rx="22" fill="url(#buildingPink)" />
                    <rect x="700" y="340" width="85" height="260" rx="26" fill="url(#buildingCream)" />
                    <rect x="795" y="390" width="65" height="210" rx="20" fill="url(#buildingPeach)" />

                    {/* Center Right */}
                    <rect x="880" y="360" width="75" height="240" rx="24" fill="url(#buildingOrange)" />
                    <rect x="965" y="410" width="60" height="190" rx="19" fill="url(#buildingPink)" />

                    {/* Far Right */}
                    <rect x="1050" y="370" width="80" height="230" rx="25" fill="url(#buildingCream)" />
                    <rect x="1140" y="420" width="70" height="180" rx="22" fill="url(#buildingPeach)" />
                    <rect x="1220" y="380" width="85" height="220" rx="26" fill="url(#buildingOrange)" />
                    <rect x="1320" y="430" width="60" height="170" rx="19" fill="url(#buildingPink)" />
                    <rect x="1390" y="400" width="50" height="200" rx="16" fill="url(#buildingCream)" />

                    {/* Windows - Small, soft, scattered */}
                    <g fill="#fff" fillOpacity="0.5">
                        <circle cx="130" cy="420" r="8" />
                        <circle cx="130" cy="450" r="8" />
                        <circle cx="565" cy="380" r="10" />
                        <circle cx="565" cy="420" r="10" />
                        <circle cx="742" cy="400" r="9" />
                        <circle cx="742" cy="440" r="9" />
                        <circle cx="1090" cy="420" r="8" />
                        <circle cx="1090" cy="460" r="8" />
                        <circle cx="1262" cy="430" r="9" />
                        <circle cx="1262" cy="470" r="9" />
                    </g>
                </g>

                {/* === BACK GRASS HILL === */}
                <path
                    d="M0 600 Q 200 550 400 580 Q 600 610 800 560 Q 1000 520 1200 570 Q 1350 610 1440 580 V 900 H 0 Z"
                    fill="url(#grassGreen)"
                />

                {/* === ROUND CUTE TREES (Back) - Storybook Style === */}
                <g opacity="0.9">
                    {/* Tree 1 */}
                    <g transform="translate(100, 510)">
                        <rect x="18" y="55" width="14" height="45" rx="7" fill="#a8a29e" />
                        <circle cx="25" cy="35" r="35" fill="#86efac" />
                        <circle cx="25" cy="20" r="25" fill="#bbf7d0" />
                    </g>
                    {/* Tree 2 */}
                    <g transform="translate(350, 490)">
                        <rect x="15" y="50" width="12" height="40" rx="6" fill="#a8a29e" />
                        <circle cx="21" cy="32" r="30" fill="#4ade80" />
                        <circle cx="21" cy="18" r="20" fill="#86efac" />
                    </g>
                    {/* Tree 3 */}
                    <g transform="translate(1050, 500)">
                        <rect x="16" y="52" width="13" height="42" rx="6" fill="#a8a29e" />
                        <circle cx="22" cy="34" r="32" fill="#86efac" />
                        <circle cx="22" cy="18" r="22" fill="#bbf7d0" />
                    </g>
                    {/* Tree 4 */}
                    <g transform="translate(1300, 520)">
                        <rect x="14" y="48" width="12" height="38" rx="6" fill="#a8a29e" />
                        <circle cx="20" cy="30" r="28" fill="#4ade80" />
                        <circle cx="20" cy="16" r="18" fill="#86efac" />
                    </g>
                </g>

                {/* === FRONT GRASS HILL === */}
                <path
                    d="M0 700 Q 250 660 500 700 Q 750 740 950 680 Q 1150 630 1440 700 V 900 H 0 Z"
                    fill="url(#grassDark)"
                />

                {/* === WINDING PATH - Curves for Leisurely Walk === */}
                <path
                    d="M-20 850 Q 150 780 350 800 Q 550 820 720 760 Q 900 700 1100 750 Q 1300 800 1460 780"
                    stroke="url(#pathColor)"
                    strokeWidth="35"
                    fill="none"
                    strokeLinecap="round"
                />
                <path
                    d="M-20 850 Q 150 780 350 800 Q 550 820 720 760 Q 900 700 1100 750 Q 1300 800 1460 780"
                    stroke="#fef9c3"
                    strokeWidth="25"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* === ROUND CUTE TREES (Front) === */}
                <g>
                    {/* Pink Tree Left */}
                    <g transform="translate(50, 680)">
                        <rect x="20" y="70" width="16" height="50" rx="8" fill="#a8a29e" />
                        <circle cx="28" cy="45" r="40" fill="#fda4af" />
                        <circle cx="28" cy="25" r="28" fill="#fecdd3" />
                    </g>
                    {/* Green Tree */}
                    <g transform="translate(250, 700)">
                        <rect x="16" y="60" width="14" height="45" rx="7" fill="#a8a29e" />
                        <circle cx="23" cy="38" r="35" fill="#4ade80" />
                        <circle cx="23" cy="20" r="24" fill="#86efac" />
                    </g>
                    {/* Pink Tree Right */}
                    <g transform="translate(1250, 670)">
                        <rect x="22" y="75" width="18" height="55" rx="9" fill="#a8a29e" />
                        <circle cx="31" cy="50" r="45" fill="#fb7185" />
                        <circle cx="31" cy="25" r="32" fill="#fda4af" />
                    </g>
                </g>

                {/* === PEOPLE & ACTIVITIES - Faceless, Warm, Universal === */}

                {/* Bench with Person (Alone, Peaceful) */}
                <g transform="translate(180, 760)">
                    {/* Bench */}
                    <rect x="0" y="20" width="60" height="6" rx="3" fill="#a8a29e" />
                    <rect x="5" y="8" width="50" height="5" rx="2" fill="#d6d3d1" />
                    <rect x="8" y="26" width="6" height="18" rx="2" fill="#78716c" />
                    <rect x="46" y="26" width="6" height="18" rx="2" fill="#78716c" />
                    {/* Person sitting */}
                    <circle cx="30" cy="0" r="7" fill="#fda4af" />
                    <path d="M22 8 Q30 25 22 28 H38 Q30 25 38 8 Z" fill="#fda4af" />
                </g>

                {/* Couple Walking Together */}
                <g transform="translate(700, 730)">
                    {/* Person 1 */}
                    <circle cx="0" cy="0" r="9" fill="#fb7185" />
                    <path d="M-10 12 Q0 40 -10 55 H10 Q0 40 10 12 Z" fill="#fb7185" />
                    {/* Person 2 */}
                    <circle cx="30" cy="5" r="8" fill="#fdba74" />
                    <path d="M20 15 Q30 42 20 55 H40 Q30 42 40 15 Z" fill="#fdba74" />
                    {/* Holding hands hint */}
                    <ellipse cx="15" cy="35" rx="6" ry="4" fill="#fde68a" opacity="0.6" />
                </g>

                {/* Picnic Couple */}
                <g transform="translate(500, 780)">
                    {/* Blanket */}
                    <ellipse cx="40" cy="30" rx="50" ry="20" fill="#fecdd3" />
                    <ellipse cx="40" cy="30" rx="40" ry="15" fill="#fff1f2" />
                    {/* Person 1 */}
                    <circle cx="25" cy="15" r="8" fill="#fdba74" />
                    <ellipse cx="25" cy="30" rx="10" ry="8" fill="#fdba74" />
                    {/* Person 2 */}
                    <circle cx="55" cy="18" r="7" fill="#fda4af" />
                    <ellipse cx="55" cy="32" rx="9" ry="7" fill="#fda4af" />
                    {/* Basket */}
                    <rect x="35" y="25" width="12" height="10" rx="3" fill="#a8a29e" />
                </g>

                {/* Person with Heart Balloon */}
                <g transform="translate(950, 720)">
                    {/* Person */}
                    <circle cx="0" cy="20" r="8" fill="#fda4af" />
                    <path d="M-9 30 Q0 55 -9 65 H9 Q0 55 9 30 Z" fill="#fda4af" />
                    {/* Balloon string */}
                    <path d="M5 30 Q10 10 8 -20" stroke="#d6d3d1" strokeWidth="1" fill="none" />
                    {/* Heart Balloon */}
                    <path d="M8 -35 C-5 -55 -5 -70 8 -55 C21 -70 21 -55 8 -35" fill="#f43f5e" />
                </g>

                {/* Couple on Bench */}
                <g transform="translate(1100, 740)">
                    {/* Bench */}
                    <rect x="0" y="25" width="70" height="6" rx="3" fill="#a8a29e" />
                    <rect x="5" y="12" width="60" height="5" rx="2" fill="#d6d3d1" />
                    <rect x="10" y="31" width="6" height="20" rx="2" fill="#78716c" />
                    <rect x="54" y="31" width="6" height="20" rx="2" fill="#78716c" />
                    {/* Person 1 */}
                    <circle cx="25" cy="2" r="8" fill="#fb7185" />
                    <path d="M16 12 Q25 30 16 35 H34 Q25 30 34 12 Z" fill="#fb7185" />
                    {/* Person 2 */}
                    <circle cx="50" cy="5" r="7" fill="#fde68a" />
                    <path d="M42 14 Q50 30 42 35 H58 Q50 30 58 14 Z" fill="#fde68a" />
                </g>

                {/* Person with Gift */}
                <g transform="translate(400, 770)">
                    {/* Person */}
                    <circle cx="0" cy="0" r="7" fill="#86efac" />
                    <path d="M-8 10 Q0 32 -8 42 H8 Q0 32 8 10 Z" fill="#86efac" />
                    {/* Gift box */}
                    <rect x="10" y="20" width="15" height="12" rx="2" fill="#f43f5e" />
                    <rect x="10" y="18" width="15" height="4" rx="1" fill="#fda4af" />
                    <line x1="17.5" y1="18" x2="17.5" y2="32" stroke="#fff" strokeWidth="2" />
                </g>

                {/* Walking Person (Alone but Content) */}
                <g transform="translate(1350, 750)">
                    <circle cx="0" cy="0" r="7" fill="#fdba74" />
                    <path d="M-8 10 Q0 35 -8 48 H8 Q0 35 8 10 Z" fill="#fdba74" />
                </g>

                {/* Extra Balloons Floating */}
                <motion.g
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                    <g transform="translate(600, 650)">
                        <path d="M0 0 Q0 20 5 40" stroke="#e5e5e5" strokeWidth="1" fill="none" />
                        <ellipse cx="0" cy="-12" rx="10" ry="14" fill="#fb7185" />
                    </g>
                    <g transform="translate(850, 630)">
                        <path d="M0 0 Q0 18 3 35" stroke="#e5e5e5" strokeWidth="1" fill="none" />
                        <ellipse cx="0" cy="-10" rx="8" ry="12" fill="#fda4af" />
                    </g>
                </motion.g>

                {/* Small Bushes & Flowers */}
                <g fill="#86efac">
                    <ellipse cx="30" cy="870" rx="40" ry="20" />
                    <ellipse cx="90" cy="880" rx="35" ry="18" />
                    <ellipse cx="1380" cy="865" rx="45" ry="22" />
                    <ellipse cx="1430" cy="878" rx="30" ry="15" />
                </g>
                <g fill="#fda4af" opacity="0.7">
                    <circle cx="60" cy="860" r="6" />
                    <circle cx="80" cy="855" r="5" />
                    <circle cx="1400" cy="855" r="6" />
                </g>

            </svg>

            {/* Gentle Overlay for Dreamy Feel & Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-white/30" />
        </div>
    );
}
