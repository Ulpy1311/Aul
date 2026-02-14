"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, ArrowDown } from "lucide-react";

interface Song {
    title: string;
    artist: string;
    src: string;
    image: string;
}

const playlist: Song[] = [
    {
        title: "Sempurna",
        artist: "Andra & The Backbone",
        src: "/music/perfect.mp3",
        image: "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2Faabf4b7d67713bed262648b9665bcc39.1000x1000x1.jpg"
    },
    {
        title: "Last Night on Earth",
        artist: "Green Day",
        src: "/music/Green Day - Last Night On Earth (cover).mp3",
        image: "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2Ff1a7df75f535b4df99775c9d3bb7ce02.1000x1000x1.png"
    },
    {
        title: "Iris",
        artist: "The Goo Goo Dolls",
        src: "/music/iris (the goo goo dolls cover).mp3",
        image: "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2Fafef650b1e60e27d632e7c5765b39c37.1000x1000x1.png"
    },
    {
        title: "Bergema Sampai Selamanya",
        artist: "Nadhif Basalamah",
        src: "/music/bergema.mp3",
        image: "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2F0ba5e9ba523736f0c344882de3f5aaba.1000x1000x1.png"
    },
    {
        title: "Kota Ini Tak Sama Tanpamu",
        artist: "Nadhif Basalamah",
        src: "/music/kota-tak-sama.mp3",
        image: "https://t2.genius.com/unsafe/344x344/https%3A%2F%2Fimages.genius.com%2F0ba5e9ba523736f0c344882de3f5aaba.1000x1000x1.png"
    }
];

export function MusicPlayer() {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [isHovered, setIsHovered] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const currentSong = playlist[currentSongIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle initial autoplay
    useEffect(() => {
        const attemptPlay = async () => {
            if (audioRef.current) {
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } catch (error) {
                    console.log("Autoplay prevented by browser policy", error);
                    // Optional: Show a UI hint that user needs to interact
                    setIsPlaying(false);
                }
            }
        };

        attemptPlay();

        // Add a one-time click listener to valid document to try playing if blocked
        const enableAudio = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                }).catch(console.error);
            }
        };

        document.addEventListener('click', enableAudio, { once: true });
        return () => document.removeEventListener('click', enableAudio);
    }, []);

    // Handle auto-play when song changes if it was already playing
    useEffect(() => {
        if (isPlaying && audioRef.current) {
            audioRef.current.play();
        }
    }, [currentSongIndex]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0) {
            setIsMuted(false);
            if (audioRef.current) audioRef.current.muted = false;
        }
    };

    const handleNext = () => {
        setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    };

    const handlePrevious = () => {
        setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    };

    const handleSongEnd = () => {
        handleNext();
    };

    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex items-center gap-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <audio
                ref={audioRef}
                src={currentSong.src}
                onEnded={handleSongEnd}
            />

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-card/80 backdrop-blur-md border border-border p-4 rounded-2xl shadow-lg flex flex-col gap-3 min-w-[240px]"
                        layout
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 flex-shrink-0">
                                <motion.div
                                    key={currentSong.image} // Re-animate on song change
                                    animate={{ rotate: isPlaying ? 360 : 0 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="w-full h-full rounded-full overflow-hidden border-2 border-primary/20"
                                >
                                    <img
                                        src={currentSong.image}
                                        alt="Album Art"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/10 rounded-full" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-card rounded-full border border-border" />
                                </motion.div>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <h3 className="text-sm font-medium truncate text-foreground">{currentSong.title}</h3>
                                <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                            <button
                                onClick={handlePrevious}
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                            >
                                <SkipBack className="w-4 h-4" />
                            </button>

                            <button
                                onClick={togglePlay}
                                className="p-3 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors"
                            >
                                {isPlaying ? (
                                    <Pause className="w-5 h-5 fill-current" />
                                ) : (
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                )}
                            </button>

                            <button
                                onClick={handleNext}
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                            >
                                <SkipForward className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 group/volume">
                            <button
                                onClick={toggleMute}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:scale-110 transition-all"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vertical Hint Text */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className={`absolute bottom-full mb-4 right-1/2 translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-70"
                    }`}
            >
                <div className="[writing-mode:vertical-rl] rotate-180 text-[10px] uppercase tracking-widest text-primary/80 font-bold whitespace-nowrap">
                    Music Control
                </div>
                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center justify-center gap-1"
                >
                    <div className="h-8 w-px bg-primary/50" />
                    <ArrowDown className="w-5 h-5 text-primary" strokeWidth={2.5} />
                </motion.div>
            </motion.div>

            <motion.button
                onClick={() => setIsHovered(!isHovered)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isPlaying ? "bg-card border border-primary/20 animate-pulse-slow" : "bg-card border border-border"
                    }`}
            >
                <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[3px] rounded-full overflow-hidden"
                >
                    <img
                        src={currentSong.image}
                        alt="Mini Album Art"
                        className={`w-full h-full object-cover transition-all duration-500 ${!isPlaying ? "grayscale opacity-60" : ""}`}
                    />
                </motion.div>

                {/* Center hole for vinyl look */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-card rounded-full border border-border z-10 flex items-center justify-center">
                    {!isPlaying && <Play className="w-1.5 h-1.5 text-foreground ml-0.5" />}
                </div>

                {!isHovered && isPlaying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-1 -right-1"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
}
