"use client"

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUp, Paperclip, Square, X, StopCircle, Mic, Globe, BrainCog, FolderCode, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for className merging
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Embedded CSS for minimal custom styles - ADAPTED FOR LIGHT THEME
const styles = `
  *:focus-visible {
    outline-offset: 0 !important;
    --ring-offset: 0 !important;
  }
  textarea::-webkit-scrollbar {
    width: 6px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: #d1d5db; /* Light gray */
    border-radius: 3px;
  }
  textarea::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af; /* Darker gray */
  }
`;

// Inject styles into document (Client-side only check)
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

// Textarea Component - LIGHT THEME
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
    <textarea
        className={cn(
            "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400",
            className
        )}
        ref={ref}
        rows={1}
        {...props}
    />
));
Textarea.displayName = "Textarea";

// Tooltip Components - LIGHT THEME
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
    React.ElementRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
            "z-50 overflow-hidden rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-900 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
        )}
        {...props}
    />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Dialog Components - LIGHT THEME
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-neutral-200 bg-white p-0 shadow-xl duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-2xl",
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-neutral-100 p-2 hover:bg-neutral-200 transition-all">
                <X className="h-5 w-5 text-gray-500 hover:text-gray-900" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight text-gray-900", className)}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Button Component - LIGHT THEME
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        const variantClasses = {
            default: "bg-neutral-900 hover:bg-neutral-800 text-white", // Dark button on light theme
            outline: "border border-neutral-200 bg-transparent hover:bg-neutral-100 text-neutral-900",
            ghost: "bg-transparent hover:bg-neutral-100 text-neutral-900",
        };
        const sizeClasses = {
            default: "h-10 px-4 py-2",
            sm: "h-8 px-3 text-sm",
            lg: "h-12 px-6",
            icon: "h-8 w-8 rounded-full aspect-[1/1]",
        };
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                    variantClasses[variant],
                    sizeClasses[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

// VoiceRecorder Component - LIGHT THEME
interface VoiceRecorderProps {
    isRecording: boolean;
    onStartRecording: () => void;
    onStopRecording: (duration: number) => void;
    visualizerBars?: number;
}
const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
    isRecording,
    onStartRecording,
    onStopRecording,
    visualizerBars = 32,
}) => {
    const [time, setTime] = React.useState(0);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        if (isRecording) {
            onStartRecording();
            timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            onStopRecording(time);
            setTime(0);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRecording, time, onStartRecording, onStopRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center w-full transition-all duration-300 py-3",
                isRecording ? "opacity-100" : "opacity-0 h-0"
            )}
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-mono text-sm text-neutral-600">{formatTime(time)}</span>
            </div>
            <div className="w-full h-10 flex items-center justify-center gap-0.5 px-4">
                {[...Array(visualizerBars)].map((_, i) => (
                    <div
                        key={i}
                        className="w-0.5 rounded-full bg-rose-400 animate-pulse"
                        style={{
                            height: `${Math.max(15, Math.random() * 100)}%`,
                            animationDelay: `${i * 0.05}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// ImageViewDialog Component - LIGHT THEME
interface ImageViewDialogProps {
    imageUrl: string | null;
    onClose: () => void;
}
const ImageViewDialog: React.FC<ImageViewDialogProps> = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
    return (
        <Dialog open={!!imageUrl} onOpenChange={onClose}>
            <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-[90vw] md:max-w-[800px]">
                <DialogTitle className="sr-only">Image Preview</DialogTitle>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative bg-white rounded-2xl overflow-hidden shadow-2xl"
                >
                    <img
                        src={imageUrl}
                        alt="Full preview"
                        className="w-full max-h-[80vh] object-contain rounded-2xl"
                    />
                </motion.div>
            </DialogContent>
        </Dialog>
    );
};

// PromptInput Context and Components
interface PromptInputContextType {
    isLoading: boolean;
    value: string;
    setValue: (value: string) => void;
    maxHeight: number | string;
    onSubmit?: () => void;
    disabled?: boolean;
}
const PromptInputContext = React.createContext<PromptInputContextType>({
    isLoading: false,
    value: "",
    setValue: () => { },
    maxHeight: 240,
    onSubmit: undefined,
    disabled: false,
});
function usePromptInput() {
    const context = React.useContext(PromptInputContext);
    if (!context) throw new Error("usePromptInput must be used within a PromptInput");
    return context;
}

interface PromptInputProps {
    isLoading?: boolean;
    value?: string;
    onValueChange?: (value: string) => void;
    maxHeight?: number | string;
    onSubmit?: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onDragOver?: (e: React.DragEvent) => void;
    onDragLeave?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
}
const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
    (
        {
            className,
            isLoading = false,
            maxHeight = 240,
            value,
            onValueChange,
            onSubmit,
            children,
            disabled = false,
            onDragOver,
            onDragLeave,
            onDrop,
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = React.useState(value || "");
        const handleChange = (newValue: string) => {
            setInternalValue(newValue);
            onValueChange?.(newValue);
        };
        return (
            <TooltipProvider>
                <PromptInputContext.Provider
                    value={{
                        isLoading,
                        value: value ?? internalValue,
                        setValue: onValueChange ?? handleChange,
                        maxHeight,
                        onSubmit,
                        disabled,
                    }}
                >
                    <div
                        ref={ref}
                        className={cn(
                            "rounded-3xl border border-neutral-200 bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300",
                            isLoading && "border-rose-300 ring-1 ring-rose-100",
                            className
                        )}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        {children}
                    </div>
                </PromptInputContext.Provider>
            </TooltipProvider>
        );
    }
);
PromptInput.displayName = "PromptInput";

interface PromptInputTextareaProps {
    disableAutosize?: boolean;
    placeholder?: string;
}
const PromptInputTextarea: React.FC<PromptInputTextareaProps & React.ComponentProps<typeof Textarea>> = ({
    className,
    onKeyDown,
    disableAutosize = false,
    placeholder,
    ...props
}) => {
    const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (disableAutosize || !textareaRef.current) return;
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
            typeof maxHeight === "number"
                ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
                : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
    }, [value, maxHeight, disableAutosize]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit?.();
        }
        onKeyDown?.(e);
    };

    return (
        <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={cn("text-base text-neutral-800", className)}
            disabled={disabled}
            placeholder={placeholder}
            {...props}
        />
    );
};

interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> { }
const PromptInputActions: React.FC<PromptInputActionsProps> = ({ children, className, ...props }) => (
    <div className={cn("flex items-center gap-2", className)} {...props}>
        {children}
    </div>
);

interface PromptInputActionProps extends React.ComponentProps<typeof Tooltip> {
    tooltip: React.ReactNode;
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    className?: string;
}
const PromptInputAction: React.FC<PromptInputActionProps> = ({
    tooltip,
    children,
    className,
    side = "top",
    ...props
}) => {
    const { disabled } = usePromptInput();
    return (
        <Tooltip {...props}>
            <TooltipTrigger asChild disabled={disabled}>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} className={className}>
                {tooltip}
            </TooltipContent>
        </Tooltip>
    );
};

// Custom Divider Component
const CustomDivider: React.FC = () => (
    <div className="relative h-6 w-[1.5px] mx-1">
        <div
            className="absolute inset-0 bg-gradient-to-t from-transparent via-neutral-200 to-transparent rounded-full"
        />
    </div>
);

// Main PromptInputBox Component - LIGHT THEME
interface PromptInputBoxProps {
    onSend?: (message: string, files?: File[]) => void;
    onReset?: () => void;
    isLoading?: boolean;
    placeholder?: string;
    className?: string;
    showResetButton?: boolean;
}

// Session storage key for mode persistence
const MODE_STORAGE_KEY = 'aulia-ai-mode-state';

export const PromptInputBox = React.forwardRef((props: PromptInputBoxProps, ref: React.Ref<HTMLDivElement>) => {
    const { onSend = () => { }, onReset, isLoading = false, placeholder = "Type your message here...", className, showResetButton = false } = props;
    const [input, setInput] = React.useState("");
    const [files, setFiles] = React.useState<File[]>([]);
    const [filePreviews, setFilePreviews] = React.useState<{ [key: string]: string }>({});
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [isRecording, setIsRecording] = React.useState(false);

    // Initialize mode states as false (consistent between server and client)
    const [showSearch, setShowSearch] = React.useState(false);
    const [showThink, setShowThink] = React.useState(false);
    const [showCanvas, setShowCanvas] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);

    // Search category state
    type SearchCategory = 'web' | 'news' | 'images' | 'videos';
    const [searchCategories, setSearchCategories] = React.useState<SearchCategory[]>(['web']);

    const uploadInputRef = React.useRef<HTMLInputElement>(null);
    const promptBoxRef = React.useRef<HTMLDivElement>(null);

    // Load mode state from sessionStorage (client-side only)
    React.useEffect(() => {
        setIsMounted(true);
        const saved = sessionStorage.getItem(MODE_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setShowSearch(parsed.showSearch || false);
                setShowThink(parsed.showThink || false);
                setShowCanvas(parsed.showCanvas || false);
                setSearchCategories(parsed.searchCategories || ['web']);
            } catch { /* ignore parse errors */ }
        }
    }, []);

    // Save mode state to sessionStorage whenever it changes
    React.useEffect(() => {
        if (isMounted) {
            sessionStorage.setItem(MODE_STORAGE_KEY, JSON.stringify({ showSearch, showThink, showCanvas, searchCategories }));
        }
    }, [showSearch, showThink, showCanvas, searchCategories, isMounted]);

    const handleToggleChange = (value: string) => {
        if (value === "search") {
            setShowSearch((prev: boolean) => !prev);
            setShowThink(false);
        } else if (value === "think") {
            setShowThink((prev: boolean) => !prev);
            setShowSearch(false);
        }
    };

    const handleCanvasToggle = () => setShowCanvas((prev: boolean) => !prev);

    // Search category handlers
    const toggleSearchCategory = (category: SearchCategory) => {
        setSearchCategories(prev => {
            if (prev.includes(category)) {
                // Don't allow removing all categories
                if (prev.length === 1) return prev;
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const removeSearchCategory = (category: SearchCategory) => {
        setSearchCategories(prev => {
            if (prev.length === 1) return prev; // Keep at least one
            return prev.filter(c => c !== category);
        });
    };

    const isImageFile = (file: File) => file.type.startsWith("image/");

    const processFile = (file: File) => {
        if (!isImageFile(file)) {
            console.log("Only image files are allowed");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            console.log("File too large (max 10MB)");
            return;
        }
        setFiles([file]);
        const reader = new FileReader();
        reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string });
        reader.readAsDataURL(file);
    };

    const handleDragOver = React.useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragLeave = React.useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = React.useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter((file) => isImageFile(file));
        if (imageFiles.length > 0) processFile(imageFiles[0]);
    }, []);

    const handleRemoveFile = (index: number) => {
        const fileToRemove = files[index];
        if (fileToRemove && filePreviews[fileToRemove.name]) setFilePreviews({});
        setFiles([]);
    };

    const openImageModal = (imageUrl: string) => setSelectedImage(imageUrl);

    const handlePaste = React.useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                const file = items[i].getAsFile();
                if (file) {
                    e.preventDefault();
                    processFile(file);
                    break;
                }
            }
        }
    }, []);

    React.useEffect(() => {
        document.addEventListener("paste", handlePaste);
        return () => document.removeEventListener("paste", handlePaste);
    }, [handlePaste]);

    const handleSubmit = () => {
        if (input.trim() || files.length > 0) {
            let messagePrefix = "";
            if (showSearch) {
                // Include search categories in the prefix
                const categoriesStr = searchCategories.join(',');
                messagePrefix = `[Search:${categoriesStr}: `;
            } else if (showThink) {
                messagePrefix = "[Think: ";
            } else if (showCanvas) {
                messagePrefix = "[Canvas: ";
            }
            const formattedInput = messagePrefix ? `${messagePrefix}${input}]` : input;
            onSend(formattedInput, files);
            setInput("");
            setFiles([]);
            setFilePreviews({});
        }
    };

    const handleStartRecording = () => console.log("Started recording");

    const handleStopRecording = (duration: number) => {
        console.log(`Stopped recording after ${duration} seconds`);
        setIsRecording(false);
        onSend(`[Voice message - ${duration} seconds]`, []);
    };

    const hasContent = input.trim() !== "" || files.length > 0;

    return (
        <>
            <PromptInput
                value={input}
                onValueChange={setInput}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                className={cn(
                    "w-full bg-white border-neutral-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 ease-in-out",
                    isRecording && "border-rose-400/70 shadow-rose-100",
                    className
                )}
                disabled={isLoading || isRecording}
                ref={ref || promptBoxRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {files.length > 0 && !isRecording && (
                    <div className="flex flex-wrap gap-2 p-0 pb-1 transition-all duration-300">
                        {files.map((file, index) => (
                            <div key={index} className="relative group">
                                {file.type.startsWith("image/") && filePreviews[file.name] && (
                                    <div
                                        className="w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-sm border border-neutral-100"
                                        onClick={() => openImageModal(filePreviews[file.name])}
                                    >
                                        <img
                                            src={filePreviews[file.name]}
                                            alt={file.name}
                                            className="h-full w-full object-cover"
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFile(index);
                                            }}
                                            className="absolute top-1 right-1 rounded-full bg-white/90 p-0.5 opacity-100 transition-opacity shadow-sm hover:bg-white"
                                        >
                                            <X className="h-3 w-3 text-neutral-600" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Search Category Selector - appears when Search mode is active */}
                {showSearch && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs text-neutral-500 mr-1 self-center">Search:</span>
                        {(['web', 'news', 'images', 'videos'] as const).map((category) => {
                            const isSelected = searchCategories.includes(category);
                            const icons: Record<string, string> = {
                                web: '🌐',
                                news: '📰',
                                images: '🖼️',
                                videos: '🎬'
                            };
                            const labels: Record<string, string> = {
                                web: 'Web',
                                news: 'News',
                                images: 'Images',
                                videos: 'Videos'
                            };
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => toggleSearchCategory(category)}
                                    className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                                        isSelected
                                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm"
                                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                    )}
                                >
                                    <span>{icons[category]}</span>
                                    <span>{labels[category]}</span>
                                    {isSelected && searchCategories.length > 1 && (
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSearchCategory(category);
                                            }}
                                            className="ml-1 hover:bg-white/20 rounded-full p-0.5 cursor-pointer"
                                        >
                                            <X className="h-3 w-3" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div
                    className={cn(
                        "transition-all duration-300",
                        isRecording ? "h-0 overflow-hidden opacity-0" : "opacity-100"
                    )}
                >
                    {/* Active Mode Indicators */}
                    <AnimatePresence>
                        {(showSearch || showThink) && !isRecording && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 pb-2"
                            >
                                {showSearch && (
                                    <motion.span
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-pink-50 text-pink-600 border border-pink-200 rounded-full"
                                    >
                                        <Globe className="w-3 h-3" />
                                        Search Mode
                                    </motion.span>
                                )}
                                {showThink && (
                                    <motion.span
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.8, opacity: 0 }}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-violet-50 text-violet-600 border border-violet-200 rounded-full"
                                    >
                                        <BrainCog className="w-3 h-3" />
                                        Think Mode
                                    </motion.span>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <PromptInputTextarea
                        placeholder={
                            showSearch
                                ? "Search the web..."
                                : showThink
                                    ? "Think deeply..."
                                    : showCanvas
                                        ? "Create on canvas..."
                                        : placeholder
                        }
                        className="text-base text-neutral-800 placeholder:text-neutral-400"
                    />
                </div>

                {isRecording && (
                    <VoiceRecorder
                        isRecording={isRecording}
                        onStartRecording={handleStartRecording}
                        onStopRecording={handleStopRecording}
                    />
                )}

                <PromptInputActions className="flex items-center justify-between gap-2 p-0 pt-2">
                    <div className="flex items-center gap-2">
                        {/* Reset Button (Left) */}
                        {showResetButton && onReset && (
                            <PromptInputAction tooltip="Reset chat">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg border border-neutral-200 text-neutral-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all"
                                    onClick={onReset}
                                    type="button"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </PromptInputAction>
                        )}

                        <div
                            className={cn(
                                "flex items-center gap-1 transition-opacity duration-300",
                                isRecording ? "opacity-0 invisible h-0" : "opacity-100 visible"
                            )}
                        >
                            <PromptInputAction tooltip="Upload dokumen (PDF, Word, code, txt, csv, dll.)">
                                <button
                                    onClick={() => uploadInputRef.current?.click()}
                                    className="flex h-8 w-8 text-neutral-400 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                                    disabled={isRecording}
                                >
                                    <Paperclip className="h-5 w-5 transition-colors" />
                                    <input
                                        ref={uploadInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) processFile(e.target.files[0]);
                                            if (e.target) e.target.value = "";
                                        }}
                                        accept=".pdf,.docx,.doc,.txt,.text,.md,.markdown,.js,.ts,.jsx,.tsx,.py,.java,.c,.cpp,.h,.hpp,.cs,.go,.rs,.rb,.php,.swift,.kt,.scala,.html,.css,.scss,.sass,.less,.json,.xml,.yaml,.yml,.toml,.sql,.sh,.bash,.zsh,.bat,.ps1,.csv,.tsv,.env,.ini,.cfg,.conf,.rst,.tex,.log"
                                        multiple
                                    />
                                </button>
                            </PromptInputAction>

                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => handleToggleChange("search")}
                                    className={cn(
                                        "rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                                        showSearch
                                            ? "bg-blue-50 border-blue-200 text-blue-500"
                                            : "bg-transparent border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
                                    )}
                                >
                                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                        <motion.div
                                            animate={{ rotate: showSearch ? 360 : 0, scale: showSearch ? 1.1 : 1 }}
                                            whileHover={{ rotate: showSearch ? 360 : 15, scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 10 } }}
                                            transition={{ type: "spring", stiffness: 260, damping: 25 }}
                                        >
                                            <Globe className={cn("w-4 h-4", showSearch ? "text-blue-500" : "text-inherit")} />
                                        </motion.div>
                                    </div>
                                    <AnimatePresence>
                                        {showSearch && (
                                            <motion.span
                                                initial={{ width: 0, opacity: 0 }}
                                                animate={{ width: "auto", opacity: 1 }}
                                                exit={{ width: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-xs overflow-hidden whitespace-nowrap text-blue-500 flex-shrink-0 font-medium"
                                            >
                                                Search
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>

                                <CustomDivider />

                                <button
                                    type="button"
                                    onClick={() => handleToggleChange("think")}
                                    className={cn(
                                        "rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                                        showThink
                                            ? "bg-purple-50 border-purple-200 text-purple-500"
                                            : "bg-transparent border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
                                    )}
                                >
                                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                        <motion.div
                                            animate={{ rotate: showThink ? 360 : 0, scale: showThink ? 1.1 : 1 }}
                                            whileHover={{ rotate: showThink ? 360 : 15, scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 10 } }}
                                            transition={{ type: "spring", stiffness: 260, damping: 25 }}
                                        >
                                            <BrainCog className={cn("w-4 h-4", showThink ? "text-purple-500" : "text-inherit")} />
                                        </motion.div>
                                    </div>
                                    <AnimatePresence>
                                        {showThink && (
                                            <motion.span
                                                initial={{ width: 0, opacity: 0 }}
                                                animate={{ width: "auto", opacity: 1 }}
                                                exit={{ width: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-xs overflow-hidden whitespace-nowrap text-purple-500 flex-shrink-0 font-medium"
                                            >
                                                Think
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>

                                <CustomDivider />

                                <button
                                    type="button"
                                    onClick={handleCanvasToggle}
                                    className={cn(
                                        "rounded-full transition-all flex items-center gap-1 px-2 py-1 border h-8",
                                        showCanvas
                                            ? "bg-orange-50 border-orange-200 text-orange-500"
                                            : "bg-transparent border-transparent text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50"
                                    )}
                                >
                                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                        <motion.div
                                            animate={{ rotate: showCanvas ? 360 : 0, scale: showCanvas ? 1.1 : 1 }}
                                            whileHover={{ rotate: showCanvas ? 360 : 15, scale: 1.1, transition: { type: "spring", stiffness: 300, damping: 10 } }}
                                            transition={{ type: "spring", stiffness: 260, damping: 25 }}
                                        >
                                            <FolderCode className={cn("w-4 h-4", showCanvas ? "text-orange-500" : "text-inherit")} />
                                        </motion.div>
                                    </div>
                                    <AnimatePresence>
                                        {showCanvas && (
                                            <motion.span
                                                initial={{ width: 0, opacity: 0 }}
                                                animate={{ width: "auto", opacity: 1 }}
                                                exit={{ width: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-xs overflow-hidden whitespace-nowrap text-orange-500 flex-shrink-0 font-medium"
                                            >
                                                Canvas
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>
                        </div>
                    </div>

                    <PromptInputAction
                        tooltip={
                            isLoading
                                ? "Stop generation"
                                : isRecording
                                    ? "Stop recording"
                                    : hasContent
                                        ? "Send message"
                                        : "Voice message"
                        }
                    >
                        <Button
                            variant="default"
                            size="icon"
                            className={cn(
                                "h-8 w-8 rounded-full transition-all duration-200",
                                isRecording
                                    ? "bg-transparent hover:bg-rose-50 text-rose-500 hover:text-rose-600"
                                    : hasContent
                                        ? "bg-rose-500 hover:bg-rose-600 text-white"
                                        : "bg-transparent hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600"
                            )}
                            onClick={() => {
                                if (isRecording) setIsRecording(false);
                                else if (hasContent) handleSubmit();
                                else setIsRecording(true);
                            }}
                            disabled={isLoading && !hasContent}
                        >
                            {isLoading ? (
                                <Square className="h-4 w-4 fill-white animate-pulse" />
                            ) : isRecording ? (
                                <StopCircle className="h-5 w-5 text-rose-500" />
                            ) : hasContent ? (
                                <ArrowUp className="h-4 w-4 text-white" />
                            ) : (
                                <Mic className="h-5 w-5 text-inherit transition-colors" />
                            )}
                        </Button>
                    </PromptInputAction>
                </PromptInputActions>
            </PromptInput>

            <ImageViewDialog imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
        </>
    );
});
PromptInputBox.displayName = "PromptInputBox";
