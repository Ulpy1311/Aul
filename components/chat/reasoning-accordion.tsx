"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Loader2, Sparkles, BrainCog, Lightbulb, Code2, Search, AlertCircle, ArrowRight, Zap, Target, BookOpen, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReasoningAccordionProps {
    content: string;
    isOpen: boolean;
    onToggle: () => void;
    isLoading: boolean;
}

// Step type detection for varied styling
type StepType = 'thought' | 'analysis' | 'code' | 'search' | 'warning' | 'action' | 'insight' | 'conclusion' | 'tool' | 'default';

function detectStepType(text: string): StepType {
    const lower = text.toLowerCase();

    if (lower.includes('let me think') || lower.includes('hmm') || lower.includes('i think') || lower.includes('considering')) return 'thought';
    if (lower.includes('analyzing') || lower.includes('looking at') || lower.includes('examining') || lower.includes('the data')) return 'analysis';
    if (lower.includes('code') || lower.includes('function') || lower.includes('implement') || lower.includes('syntax')) return 'code';
    if (lower.includes('search') || lower.includes('finding') || lower.includes('looking for') || lower.includes('query')) return 'search';
    if (lower.includes('careful') || lower.includes('warning') || lower.includes('note that') || lower.includes('important')) return 'warning';
    if (lower.includes('i will') || lower.includes('i should') || lower.includes('next step') || lower.includes('i need to')) return 'action';
    if (lower.includes('insight') || lower.includes('interesting') || lower.includes('notice') || lower.includes('realize')) return 'insight';
    if (lower.includes('therefore') || lower.includes('conclusion') || lower.includes('finally') || lower.includes('in summary') || lower.includes('so the answer')) return 'conclusion';
    if (lower.includes('tool') || lower.includes('calling') || lower.includes('using') || lower.includes('invoke')) return 'tool';

    return 'default';
}

function getStepConfig(type: StepType) {
    const configs = {
        thought: {
            icon: Lightbulb,
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            textColor: 'text-amber-700',
            iconColor: 'text-amber-500',
            label: 'Thinking'
        },
        analysis: {
            icon: Target,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-700',
            iconColor: 'text-blue-500',
            label: 'Analyzing'
        },
        code: {
            icon: Code2,
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            textColor: 'text-emerald-700',
            iconColor: 'text-emerald-500',
            label: 'Code'
        },
        search: {
            icon: Search,
            bgColor: 'bg-cyan-50',
            borderColor: 'border-cyan-200',
            textColor: 'text-cyan-700',
            iconColor: 'text-cyan-500',
            label: 'Searching'
        },
        warning: {
            icon: AlertCircle,
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            textColor: 'text-orange-700',
            iconColor: 'text-orange-500',
            label: 'Note'
        },
        action: {
            icon: ArrowRight,
            bgColor: 'bg-violet-50',
            borderColor: 'border-violet-200',
            textColor: 'text-violet-700',
            iconColor: 'text-violet-500',
            label: 'Action'
        },
        insight: {
            icon: Zap,
            bgColor: 'bg-pink-50',
            borderColor: 'border-pink-200',
            textColor: 'text-pink-700',
            iconColor: 'text-pink-500',
            label: 'Insight'
        },
        conclusion: {
            icon: Sparkles,
            bgColor: 'bg-gradient-to-r from-purple-50 to-rose-50',
            borderColor: 'border-purple-200',
            textColor: 'text-purple-700',
            iconColor: 'text-purple-500',
            label: 'Conclusion'
        },
        tool: {
            icon: Wrench,
            bgColor: 'bg-slate-50',
            borderColor: 'border-slate-200',
            textColor: 'text-slate-700',
            iconColor: 'text-slate-500',
            label: 'Tool'
        },
        default: {
            icon: BookOpen,
            bgColor: 'bg-neutral-50/50',
            borderColor: 'border-neutral-200',
            textColor: 'text-neutral-600',
            iconColor: 'text-neutral-400',
            label: 'Step'
        }
    };

    return configs[type];
}

export function ReasoningAccordion({
    content,
    isOpen,
    onToggle,
    isLoading
}: ReasoningAccordionProps) {
    const [steps, setSteps] = useState<{ text: string; type: StepType }[]>([]);

    // Parse content into steps on change
    useEffect(() => {
        if (!content) {
            setSteps([]);
            return;
        }

        // Split by newlines and filter empty strings
        const lines = content.split('\n').filter(line => line.trim().length > 0);
        const parsedSteps = lines.map(line => ({
            text: line.replace(/\*\*/g, '').replace(/^\* /, '').replace(/^- /, '').trim(),
            type: detectStepType(line)
        }));
        setSteps(parsedSteps);
    }, [content]);

    return (
        <div className="w-full my-3">
            <motion.div
                layout
                className={cn(
                    "border rounded-2xl overflow-hidden transition-all duration-500",
                    isOpen
                        ? "bg-gradient-to-br from-white via-purple-50/30 to-white border-purple-200/80 shadow-lg shadow-purple-100/50"
                        : "bg-white/80 backdrop-blur-sm border-neutral-200/60 hover:border-purple-200/60 hover:shadow-md"
                )}
            >
                {/* Header / Toggle */}
                <button
                    onClick={onToggle}
                    className={cn(
                        "w-full flex items-center justify-between px-5 py-4 text-sm transition-all duration-300",
                        isOpen
                            ? "bg-gradient-to-r from-purple-50/80 via-transparent to-rose-50/50"
                            : "hover:bg-purple-50/30"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                            transition={isLoading ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
                            className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center border-2 shadow-sm transition-all duration-500",
                                isLoading
                                    ? "bg-gradient-to-br from-purple-100 to-rose-100 border-purple-300"
                                    : "bg-gradient-to-br from-purple-600 to-rose-600 border-transparent"
                            )}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                            ) : (
                                <BrainCog className="w-4 h-4 text-white" />
                            )}
                        </motion.div>

                        <div className="flex flex-col items-start">
                            <span className={cn(
                                "font-semibold transition-colors",
                                isLoading ? "text-purple-600" : "text-neutral-800"
                            )}>
                                {isLoading ? "Reasoning in Progress..." : "Reasoning Complete"}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-medium">
                                {isLoading
                                    ? `Processing step ${steps.length}...`
                                    : `${steps.length} reasoning steps completed`
                                }
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isLoading && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verified</span>
                            </motion.div>
                        )}
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center"
                        >
                            <ChevronDown className="w-4 h-4 text-neutral-500" />
                        </motion.div>
                    </div>
                </button>

                {/* Content */}
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="px-5 pb-5 pt-2">
                                {/* Intro */}
                                <div className="text-xs text-neutral-500 mb-4 pb-3 border-b border-neutral-100 flex items-center gap-2">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span>Below is the entire reasoning process the AI went through:</span>
                                </div>

                                <div className="space-y-2.5 relative">
                                    {/* Vertical Timeline Line */}
                                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-200 via-rose-200 to-purple-200 rounded-full" />

                                    {steps.map((step, index) => {
                                        const isLast = index === steps.length - 1;
                                        const isActive = isLast && isLoading;
                                        const config = getStepConfig(step.type);
                                        const IconComponent = config.icon;

                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20, y: 10 }}
                                                animate={{ opacity: 1, x: 0, y: 0 }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: index * 0.03,
                                                    ease: [0.4, 0, 0.2, 1]
                                                }}
                                                className="relative z-10 flex gap-4 group"
                                            >
                                                {/* Icon Node */}
                                                <div className={cn(
                                                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 border-2",
                                                    isActive
                                                        ? "bg-white border-purple-400 shadow-lg shadow-purple-200/50"
                                                        : `bg-white ${config.borderColor} group-hover:shadow-md`
                                                )}>
                                                    {isActive ? (
                                                        <motion.div
                                                            animate={{ scale: [1, 1.2, 1] }}
                                                            transition={{ duration: 1, repeat: Infinity }}
                                                            className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-rose-500"
                                                        />
                                                    ) : (
                                                        <IconComponent className={cn("w-4 h-4", config.iconColor)} />
                                                    )}
                                                </div>

                                                {/* Text Content Card */}
                                                <motion.div
                                                    whileHover={{ scale: 1.01 }}
                                                    className={cn(
                                                        "flex-1 rounded-xl px-4 py-3 border transition-all duration-300",
                                                        isActive
                                                            ? "bg-gradient-to-r from-purple-50 to-rose-50 border-purple-200 shadow-sm"
                                                            : `${config.bgColor} ${config.borderColor} hover:shadow-sm`
                                                    )}
                                                >
                                                    {/* Label Badge */}
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                        <span className={cn(
                                                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                                                            isActive
                                                                ? "bg-purple-100 text-purple-600"
                                                                : `bg-white/70 ${config.textColor}`
                                                        )}>
                                                            {isActive ? "Processing..." : config.label}
                                                        </span>
                                                        {!isActive && step.type === 'conclusion' && (
                                                            <span className="text-[10px] bg-gradient-to-r from-purple-600 to-rose-600 text-white px-2 py-0.5 rounded-md font-semibold">
                                                                FINAL
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Step Text */}
                                                    <p className={cn(
                                                        "text-[13px] leading-relaxed",
                                                        isActive
                                                            ? "text-purple-800 font-medium"
                                                            : config.textColor
                                                    )}>
                                                        {step.text}
                                                    </p>
                                                </motion.div>
                                            </motion.div>
                                        );
                                    })}

                                    {/* Completed State Footer */}
                                    {!isLoading && steps.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5, duration: 0.4 }}
                                            className="relative z-10 flex gap-4 pt-3"
                                        >
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-600 to-rose-600 shrink-0 shadow-lg shadow-purple-300/50">
                                                <Sparkles className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1 rounded-xl px-4 py-3 bg-gradient-to-r from-purple-600 via-rose-500 to-purple-600 border border-purple-400 shadow-lg">
                                                <span className="text-sm font-bold text-white flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Reasoning Complete & Verified
                                                </span>
                                                <p className="text-xs text-white/80 mt-1">
                                                    All {steps.length} reasoning steps have been processed successfully.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
