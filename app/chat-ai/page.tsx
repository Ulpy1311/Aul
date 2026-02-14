"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Sparkles, User, Loader2, BrainCog, Zap, MessageCircle, Clock, Gauge, Timer, Copy, Check, Code2, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Pencil, X as XIcon, Send, ArrowDown } from "lucide-react"
import { PromptInputBox } from "@/components/ui/ai-prompt-box"
import { SearchProgress, SearchResultsGrid, type SearchResult } from "@/components/ui/visual-search"
import { ReasoningAccordion } from "@/components/chat/reasoning-accordion"
import { cn } from "@/lib/utils"

interface PerformanceStats {
    totalTime: string
    timeToFirstToken: string
    tokensPerSecond: string
}

interface MessageVersion {
    content: string
    timestamp: number
}

interface Message {
    role: 'user' | 'assistant'
    content: string
    isThinking?: boolean
    reasoningContent?: string
    searchStatus?: string
    searchStep?: 'searching' | 'complete' | 'thinking'
    searchProgress?: { current: number; total: number }
    searchResults?: { category: string; results: SearchResult[] }[]
    stats?: PerformanceStats
    versions?: MessageVersion[]
    currentVersion?: number
}

// Session storage key
const STORAGE_KEY = 'aulia-ai-chat-session'

// Code block component with line numbers and copy functionality
function CodeBlock({ code, language }: { code: string; language: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const lines = code.split('\n')
    const lineCount = lines.length

    return (
        <div className="my-4 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-800 border-b border-neutral-700">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-medium text-neutral-300 uppercase tracking-wide">{language || 'code'}</span>
                    </div>
                    <span className="text-xs text-neutral-500 bg-neutral-700/50 px-2 py-0.5 rounded">{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-neutral-700"
                >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy code'}
                </button>
            </div>
            {/* Code Content with Line Numbers */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <tbody>
                        {lines.map((line, index) => (
                            <tr key={index} className="hover:bg-neutral-800/50 transition-colors">
                                <td className="select-none text-right pr-4 pl-4 py-0.5 text-xs text-neutral-500 font-mono border-r border-neutral-700/50 bg-neutral-800/30 w-12">
                                    {index + 1}
                                </td>
                                <td className="pl-4 pr-4 py-0.5">
                                    <pre className="text-sm font-mono text-neutral-100 whitespace-pre">
                                        <code>{line || ' '}</code>
                                    </pre>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Footer Stats */}
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-800/50 border-t border-neutral-700/50 text-xs text-neutral-500">
                <span>Lines: {lineCount}</span>
                <span>Characters: {code.length}</span>
            </div>
        </div>
    )
}

// Table component for professional markdown table rendering
function TableBlock({ rows }: { rows: string[][] }) {
    if (rows.length === 0) return null

    const headers = rows[0]
    const bodyRows = rows.slice(2) // Skip header and separator row

    return (
        <div className="my-4 rounded-xl overflow-hidden border border-neutral-200 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-neutral-100 to-neutral-50">
                        <tr>
                            {headers.map((cell, i) => (
                                <th key={i} className="px-4 py-3 text-left font-semibold text-neutral-800 border-b border-neutral-200">
                                    {formatInlineText(cell.trim())}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bodyRows.map((row, rowIndex) => (
                            <tr key={rowIndex} className={cn(
                                "transition-colors hover:bg-neutral-50",
                                rowIndex % 2 === 0 ? "bg-white" : "bg-neutral-50/50"
                            )}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-4 py-3 text-neutral-700 border-b border-neutral-100">
                                        {formatInlineText(cell.trim())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-400">
                {bodyRows.length} {bodyRows.length === 1 ? 'row' : 'rows'} × {headers.length} {headers.length === 1 ? 'column' : 'columns'}
            </div>
        </div>
    )
}

// Parse markdown table
function parseTable(text: string): string[][] | null {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return null

    // Check if this looks like a markdown table
    const hasHeader = lines[0].includes('|')
    const hasSeparator = lines.length > 1 && /^\|?[\s-:|]+\|?$/.test(lines[1])

    if (!hasHeader || !hasSeparator) return null

    return lines.map(line =>
        line.split('|').map(cell => cell.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1 || !line.startsWith('|'))
    ).filter(row => row.length > 0)
}

// Markdown-like renderer
function RenderContent({ content }: { content: string }) {
    // Parse and render content with code blocks, bold, etc.
    const parts: React.ReactNode[] = []
    let remaining = content
    let key = 0

    // Match code blocks first
    const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g
    let lastIndex = 0
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
        // Text before code block
        if (match.index > lastIndex) {
            const textBefore = content.slice(lastIndex, match.index)
            parts.push(<TextContent key={key++} text={textBefore} />)
        }

        // Code block
        const language = match[1] || 'code'
        const code = match[2].trim()
        parts.push(<CodeBlock key={key++} code={code} language={language} />)

        lastIndex = match.index + match[0].length
    }

    // Remaining text after last code block
    if (lastIndex < content.length) {
        parts.push(<TextContent key={key++} text={content.slice(lastIndex)} />)
    }

    if (parts.length === 0) {
        parts.push(<TextContent key={0} text={content} />)
    }

    return <>{parts}</>
}

// Text content with inline formatting
function TextContent({ text }: { text: string }) {
    // Check if this text contains a markdown table
    const tableData = parseTable(text)
    if (tableData && tableData.length >= 2) {
        return <TableBlock rows={tableData} />
    }

    // Process inline formatting: **bold**, *italic*, `code`
    const processInline = (str: string): React.ReactNode[] => {
        const result: React.ReactNode[] = []
        let remaining = str
        let key = 0

        // Simple regex-based parsing for bold, italic, inline code
        const patterns = [
            { regex: /\*\*(.+?)\*\*/g, render: (m: string) => <strong key={key++} className="font-semibold text-neutral-900">{m}</strong> },
            { regex: /\*(.+?)\*/g, render: (m: string) => <em key={key++} className="italic">{m}</em> },
            { regex: /`([^`]+)`/g, render: (m: string) => <code key={key++} className="px-1.5 py-0.5 bg-neutral-100 text-rose-600 rounded text-sm font-mono">{m}</code> },
        ]

        // For simplicity, render with basic formatting
        // Split by newlines and handle lists
        const lines = str.split('\n')

        return lines.map((line, i) => {
            // Check for list items
            const bulletMatch = line.match(/^(\s*)([-*•])\s+(.*)/)
            const numberMatch = line.match(/^(\s*)(\d+\.)\s+(.*)/)

            if (bulletMatch) {
                const indent = bulletMatch[1].length
                return (
                    <div key={i} className="flex gap-2" style={{ paddingLeft: indent * 8 }}>
                        <span className="text-rose-400">•</span>
                        <span>{formatInlineText(bulletMatch[3])}</span>
                    </div>
                )
            }

            if (numberMatch) {
                const indent = numberMatch[1].length
                return (
                    <div key={i} className="flex gap-2" style={{ paddingLeft: indent * 8 }}>
                        <span className="text-neutral-500 font-medium">{numberMatch[2]}</span>
                        <span>{formatInlineText(numberMatch[3])}</span>
                    </div>
                )
            }

            // Headers
            const h1Match = line.match(/^#\s+(.*)/)
            const h2Match = line.match(/^##\s+(.*)/)
            const h3Match = line.match(/^###\s+(.*)/)

            if (h1Match) return <h2 key={i} className="text-xl font-bold text-neutral-900 mt-4 mb-2">{h1Match[1]}</h2>
            if (h2Match) return <h3 key={i} className="text-lg font-semibold text-neutral-800 mt-3 mb-1.5">{h2Match[1]}</h3>
            if (h3Match) return <h4 key={i} className="text-base font-semibold text-neutral-700 mt-2 mb-1">{h3Match[1]}</h4>

            // Empty line = paragraph break
            if (line.trim() === '') return <div key={i} className="h-2" />

            // Normal line
            return <div key={i}>{formatInlineText(line)}</div>
        })
    }

    return <div className="space-y-1">{processInline(text)}</div>
}

// Format inline text (bold, italic, code)
function formatInlineText(text: string): React.ReactNode {
    const parts: React.ReactNode[] = []
    let remaining = text
    let key = 0

    // Process **bold**
    const boldRegex = /\*\*(.+?)\*\*/g
    let lastIndex = 0
    let match

    while ((match = boldRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(formatItalicAndCode(text.slice(lastIndex, match.index), key++))
        }
        parts.push(<strong key={`bold-${key++}`} className="font-bold text-neutral-900">{match[1]}</strong>)
        lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
        parts.push(formatItalicAndCode(text.slice(lastIndex), key++))
    }

    if (parts.length === 0) {
        return formatItalicAndCode(text, 0)
    }

    return <>{parts}</>
}

function formatItalicAndCode(text: string, key: number): React.ReactNode {
    const parts: React.ReactNode[] = []
    let remaining = text
    let subKey = 0

    // Combined regex for code and italic (code first to avoid conflicts)
    // Match `code` or *italic* (single asterisk, but not double)
    const regex = /`([^`]+)`|(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
            parts.push(<span key={`text-${key}-${subKey++}`}>{text.slice(lastIndex, match.index)}</span>)
        }

        if (match[1]) {
            // Code match (backticks)
            parts.push(
                <code key={`code-${key}-${subKey++}`} className="px-1.5 py-0.5 bg-neutral-100 text-rose-600 rounded text-sm font-mono">
                    {match[1]}
                </code>
            )
        } else if (match[2]) {
            // Italic match (single asterisks)
            parts.push(
                <em key={`italic-${key}-${subKey++}`} className="italic text-neutral-700">
                    {match[2]}
                </em>
            )
        }

        lastIndex = match.index + match[0].length
    }

    if (lastIndex < text.length) {
        parts.push(<span key={`text-${key}-${subKey++}`}>{text.slice(lastIndex)}</span>)
    }

    if (parts.length === 0) {
        return <span key={`plain-${key}`}>{text}</span>
    }

    return <span key={`formatted-${key}`}>{parts}</span>
}

export default function ChatAiPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showThinkingPanel, setShowThinkingPanel] = useState<number | null>(null)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [editText, setEditText] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const isAutoScrolling = useRef(true)

    const hasStarted = messages.length > 0

    // Clear chat history when leaving the page
    useEffect(() => {
        // Clear any previous session on mount (fresh start)
        sessionStorage.removeItem(STORAGE_KEY)

        // Cleanup function - clear when unmounting (navigating away)
        return () => {
            sessionStorage.removeItem(STORAGE_KEY)
        }
    }, [])

    // Save messages to sessionStorage during active session (for page refresh only)
    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages }))
        }
    }, [messages])

    // Show scroll-to-bottom button state
    const [showScrollButton, setShowScrollButton] = useState(false)

    // Improved auto-scroll during streaming
    const scrollToBottom = useCallback((smooth: boolean = false) => {
        if (!chatContainerRef.current) return
        const container = chatContainerRef.current
        container.scrollTo({
            top: container.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto'
        })
    }, [])

    // Handle scroll events - show button when not near bottom
    const handleScroll = useCallback(() => {
        if (!chatContainerRef.current) return
        const container = chatContainerRef.current
        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
        const isNearBottom = distanceFromBottom < 100

        isAutoScrolling.current = isNearBottom
        setShowScrollButton(!isNearBottom && messages.length > 0)
    }, [messages.length])

    // Auto-scroll during streaming
    useEffect(() => {
        if (isAutoScrolling.current) {
            scrollToBottom(false)
        }
    }, [messages, scrollToBottom])

    // Edit message handler
    const startEditMessage = (index: number) => {
        const msg = messages[index]
        if (msg.role !== 'user') return
        setEditingIndex(index)
        setEditText(msg.content)
    }

    const cancelEdit = () => {
        setEditingIndex(null)
        setEditText("")
    }

    const saveEditAndResend = async () => {
        if (editingIndex === null || !editText.trim()) return

        const oldMessage = messages[editingIndex]
        const newVersion: MessageVersion = { content: editText, timestamp: Date.now() }

        // Create updated message with version history
        const updatedMessage: Message = {
            ...oldMessage,
            content: editText,
            versions: [...(oldMessage.versions || [{ content: oldMessage.content, timestamp: Date.now() - 1000 }]), newVersion],
            currentVersion: (oldMessage.versions?.length || 0) + 1
        }

        // Remove messages after edited one and update
        const newMessages = [...messages.slice(0, editingIndex), updatedMessage]
        setMessages(newMessages)
        setEditingIndex(null)
        setEditText("")

        // Re-send to AI
        await handleSendMessageInternal(newMessages, false)
    }

    const navigateVersion = (index: number, direction: 'prev' | 'next') => {
        const msg = messages[index]
        if (!msg.versions || msg.versions.length === 0) return

        const currentVer = msg.currentVersion ?? msg.versions.length - 1
        const newVer = direction === 'prev' ? Math.max(0, currentVer - 1) : Math.min(msg.versions.length - 1, currentVer + 1)

        const updated = [...messages]
        updated[index] = {
            ...msg,
            content: msg.versions[newVer].content,
            currentVersion: newVer
        }
        setMessages(updated)
    }

    const handleSendMessageInternal = async (
        existingMessages: Message[],
        isThinking: boolean = false,
        isSearching: boolean = false,
        searchCategories: string[] = ['web'],
        documents?: { name: string; type: string; content: string }[]
    ) => {
        setIsLoading(true)
        isAutoScrolling.current = true

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: existingMessages.map((m: Message) => ({ role: m.role, content: m.content })),
                    useThinking: isThinking,
                    useSearch: isSearching,
                    searchCategories: isSearching ? searchCategories : undefined,
                    documents: documents
                })
            })

            if (!response.ok) throw new Error('API Error')
            if (!response.body) return

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let assistantMessage = ""
            let reasoningContent = ""

            setMessages(prev => [...prev, { role: 'assistant', content: '', isThinking: isThinking, reasoningContent: '' }])

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6)
                        if (data === '[DONE]') break

                        try {
                            const parsed = JSON.parse(data)

                            if (parsed.type === 'status') {
                                setMessages(prev => {
                                    const updated = [...prev]
                                    updated[updated.length - 1] = {
                                        ...updated[updated.length - 1],
                                        searchStatus: parsed.message,
                                        searchStep: parsed.step,
                                        searchProgress: parsed.progress
                                    }
                                    return updated
                                })
                                continue
                            }

                            if (parsed.type === 'search_results') {
                                setMessages(prev => {
                                    const updated = [...prev]
                                    const currentResults = updated[updated.length - 1].searchResults || []
                                    // Accumulate partial results
                                    updated[updated.length - 1] = {
                                        ...updated[updated.length - 1],
                                        searchResults: [...currentResults, ...parsed.data]
                                    }
                                    return updated
                                })
                                continue
                            }

                            if (parsed.type === 'search_complete') {
                                setMessages(prev => {
                                    const updated = [...prev]
                                    updated[updated.length - 1] = {
                                        ...updated[updated.length - 1],
                                        searchStatus: parsed.message,
                                        searchStep: 'complete'
                                    }
                                    return updated
                                })
                                continue
                            }

                            if (parsed.type === 'stats') {
                                setMessages(prev => {
                                    const updated = [...prev]
                                    updated[updated.length - 1] = {
                                        ...updated[updated.length - 1],
                                        stats: {
                                            totalTime: parsed.totalTime,
                                            timeToFirstToken: parsed.timeToFirstToken,
                                            tokensPerSecond: parsed.tokensPerSecond
                                        }
                                    }
                                    return updated
                                })
                                continue
                            }

                            const reasoning = parsed.choices?.[0]?.delta?.reasoning_content
                            if (reasoning) {
                                reasoningContent += reasoning
                            }

                            const content = parsed.choices?.[0]?.delta?.content || ""
                            assistantMessage += content

                            setMessages(prev => {
                                const updated = [...prev]
                                const currentMsg = updated[updated.length - 1]
                                updated[updated.length - 1] = {
                                    role: 'assistant',
                                    content: assistantMessage,
                                    isThinking: isThinking,
                                    reasoningContent: reasoningContent,
                                    // Clear status once content starts, preserve results
                                    searchStatus: assistantMessage.length > 10 ? undefined : currentMsg.searchStatus,
                                    searchStep: assistantMessage.length > 10 ? undefined : currentMsg.searchStep,
                                    searchResults: currentMsg.searchResults
                                }
                                return updated
                            })
                        } catch (e) {
                            // Ignore parse errors
                        }
                    }
                }
            }

        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }])
        } finally {
            setIsLoading(false)
        }
    }

    // Supported document extensions for reading
    const SUPPORTED_EXTENSIONS = [
        '.txt', '.text', '.md', '.markdown',
        '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp', '.h', '.hpp',
        '.cs', '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.scala',
        '.html', '.css', '.scss', '.sass', '.less',
        '.json', '.xml', '.yaml', '.yml', '.toml',
        '.sql', '.sh', '.bash', '.zsh', '.bat', '.ps1',
        '.csv', '.tsv', '.env', '.ini', '.cfg', '.conf', '.rst', '.tex', '.log',
        // Office & PDF (NOW SUPPORTED!)
        '.pdf', '.docx', '.doc'
    ]

    // Binary file extensions that need base64 encoding
    const BINARY_EXTENSIONS = ['.pdf', '.docx', '.doc']

    // Rejected file types
    const REJECTED_PATTERNS = {
        image: /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff|heic)$/i,
        video: /\.(mp4|avi|mov|wmv|flv|mkv|webm|m4v)$/i,
        audio: /\.(mp3|wav|ogg|flac|aac|m4a)$/i,
        binary: /\.(exe|dll|so|bin|dmg|iso|zip|rar|7z|tar|gz)$/i,
        unsupportedOffice: /\.(xls|xlsx|ppt|pptx)$/i // Only Excel and PowerPoint not supported
    }

    const getFileExtension = (filename: string): string => {
        const lastDot = filename.lastIndexOf('.')
        return lastDot !== -1 ? filename.slice(lastDot).toLowerCase() : ''
    }

    const validateFile = (file: File): { valid: boolean; reason?: string } => {
        const name = file.name.toLowerCase()

        if (REJECTED_PATTERNS.image.test(name)) {
            return { valid: false, reason: `❌ Image file "${file.name}" tidak bisa diproses oleh AI ini` }
        }
        if (REJECTED_PATTERNS.video.test(name)) {
            return { valid: false, reason: `❌ Video file "${file.name}" tidak bisa diproses oleh AI ini` }
        }
        if (REJECTED_PATTERNS.audio.test(name)) {
            return { valid: false, reason: `❌ Audio file "${file.name}" tidak bisa diproses oleh AI ini` }
        }
        if (REJECTED_PATTERNS.binary.test(name)) {
            return { valid: false, reason: `❌ Binary file "${file.name}" tidak bisa dibaca` }
        }
        if (REJECTED_PATTERNS.unsupportedOffice.test(name)) {
            return { valid: false, reason: `❌ File Excel/PowerPoint "${file.name}" belum didukung. Gunakan PDF atau DOCX.` }
        }

        return { valid: true }
    }

    // Convert file to base64 data URL
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                resolve(reader.result as string)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const handleSendMessage = async (message: string, files?: File[]) => {
        if (!message.trim() && (!files || files.length === 0)) return

        // Detect active modes and parse search categories from message prefix
        const isThinkingMode = message.includes("[Think: ") || message.includes("Think]")

        // Check for search mode with categories: [Search:web,news: query]
        const searchMatch = message.match(/\[Search:([^:]+): /)
        const isSearchMode = !!searchMatch || message.includes("[Search: ")
        let searchCategories: string[] = ['web'] // Default

        if (searchMatch && searchMatch[1]) {
            searchCategories = searchMatch[1].split(',').map(c => c.trim()).filter(c =>
                ['web', 'news', 'images', 'videos'].includes(c)
            )
            if (searchCategories.length === 0) searchCategories = ['web']
        }

        // Clean the message - remove mode prefixes
        const cleanMessage = message
            .replace(/^\[Search:[^:]+: /, "") // Remove [Search:categories: 
            .replace(/^\[(Search|Think|Canvas): /, "")
            .replace(/\]$/, "")
            .replace(/\[(Search|Think)\]/g, "")

        // Process and validate files
        const documentFiles: { name: string; type: string; content: string; isBase64?: boolean }[] = []
        const rejectedFiles: string[] = []

        if (files && files.length > 0) {
            for (const file of files) {
                // Validate file
                const validation = validateFile(file)
                if (!validation.valid) {
                    rejectedFiles.push(validation.reason || `File "${file.name}" tidak didukung`)
                    continue
                }

                try {
                    const ext = getFileExtension(file.name)

                    // Check if it's a binary file that needs base64
                    if (BINARY_EXTENSIONS.includes(ext)) {
                        const base64Content = await fileToBase64(file)
                        documentFiles.push({
                            name: file.name,
                            type: file.type || 'application/octet-stream',
                            content: base64Content,
                            isBase64: true
                        })
                    } else {
                        // Read as text for text-based files
                        const textContent = await file.text()
                        documentFiles.push({
                            name: file.name,
                            type: file.type || 'text/plain',
                            content: textContent,
                            isBase64: false
                        })
                    }
                } catch (err) {
                    console.error('Failed to read file:', file.name, err)
                    rejectedFiles.push(`❌ Gagal membaca file "${file.name}"`)
                }
            }
        }

        // Show alert for rejected files
        if (rejectedFiles.length > 0) {
            alert(rejectedFiles.join('\n\n'))
            // If all files were rejected and no message, don't proceed
            if (documentFiles.length === 0 && !message.trim()) {
                return
            }
        }

        // Build message with file info
        let displayContent = cleanMessage
        if (documentFiles.length > 0) {
            displayContent += ` 📄 [${documentFiles.length} dokumen: ${documentFiles.map(d => d.name).join(', ')}]`
        }

        const newMessages: Message[] = [
            ...messages,
            { role: 'user', content: displayContent }
        ]
        setMessages(newMessages)

        await handleSendMessageInternal(
            // Send clean message without display info to AI
            [...messages, { role: 'user', content: cleanMessage }],
            isThinkingMode,
            isSearchMode,
            searchCategories,
            documentFiles.length > 0 ? documentFiles : undefined
        )
    }

    const clearChat = () => {
        setMessages([])
        sessionStorage.removeItem(STORAGE_KEY)
    }

    return (
        <LayoutGroup>
            <main className="min-h-screen bg-white flex flex-col relative overflow-hidden">

                {/* Empty State - Centered Layout */}
                <AnimatePresence>
                    {!hasStarted && (
                        <motion.div
                            className="flex-1 flex flex-col items-center justify-center px-4 pt-20"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -50 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-center mb-8"
                            >
                                <div className="relative inline-block mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center border border-neutral-100 shadow-lg shadow-rose-100/50">
                                        <Sparkles className="w-10 h-10 text-neutral-400" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-neutral-100 flex items-center justify-center shadow-md">
                                        <MessageCircle className="w-4 h-4 text-neutral-400" />
                                    </div>
                                </div>

                                <h1 className="text-3xl font-serif text-neutral-800 mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                                    Aulia AI
                                </h1>
                                <p className="text-neutral-400 text-lg font-light max-w-md mx-auto">
                                    What can I help you with today?
                                </p>
                            </motion.div>

                            {/* Mode Hints */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-wrap justify-center gap-3 mb-8"
                            >
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-50 border border-neutral-100 text-sm text-neutral-500">
                                    <Zap className="w-4 h-4 text-rose-400" />
                                    <span>Standard: Quick & Fast</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50/50 border border-purple-100 text-sm text-purple-500">
                                    <BrainCog className="w-4 h-4 text-purple-400" />
                                    <span>Think: Deep Analysis</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50/50 border border-orange-100 text-sm text-orange-500">
                                    <Code2 className="w-4 h-4 text-orange-400" />
                                    <span>Canvas: Code Output</span>
                                </div>
                            </motion.div>

                            {/* Input Box - Centered */}
                            <motion.div
                                layout
                                layoutId="prompt-input-container"
                                className="w-full max-w-2xl"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <PromptInputBox
                                    onSend={handleSendMessage}
                                    onReset={clearChat}
                                    showResetButton={true}
                                    isLoading={isLoading}
                                    placeholder="Ask me anything..."
                                    className="bg-white border-2 border-neutral-200/80 shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:border-neutral-300/80 hover:shadow-[0_25px_70px_rgba(0,0,0,0.14)] transition-all duration-300"
                                />
                                <p className="text-center text-[11px] text-neutral-500 mt-3 font-medium">
                                    Aulia may provide inaccurate information, please cross-check the answers given
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat Area */}
                {hasStarted && (
                    <motion.div
                        ref={chatContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto pt-24 pb-44 px-4 scrollbar-thin scrollbar-thumb-neutral-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="max-w-3xl mx-auto space-y-5">
                            <AnimatePresence initial={false}>
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                        className={cn(
                                            "flex gap-4 p-5 rounded-2xl transition-colors",
                                            msg.role === 'assistant' ? "bg-neutral-50/80" : "bg-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm",
                                            msg.role === 'assistant'
                                                ? msg.isThinking
                                                    ? "bg-gradient-to-br from-purple-100 to-rose-100 text-purple-600"
                                                    : "bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600"
                                                : "bg-neutral-100 text-neutral-600"
                                        )}>
                                            {msg.role === 'assistant' ? <Sparkles className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                        </div>

                                        <div className="flex-1 space-y-3 overflow-hidden">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-sm text-neutral-800">
                                                    {msg.role === 'assistant' ? 'Aulia AI' : 'You'}
                                                </span>

                                                {/* Edit button for user messages */}
                                                {msg.role === 'user' && editingIndex !== index && (
                                                    <button
                                                        onClick={() => startEditMessage(index)}
                                                        className="text-xs text-neutral-400 hover:text-neutral-600 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-neutral-100 transition-colors"
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                        Edit
                                                    </button>
                                                )}

                                                {/* Version navigation for user messages */}
                                                {msg.role === 'user' && msg.versions && msg.versions.length > 1 && (
                                                    <div className="flex items-center gap-1 text-xs text-neutral-400">
                                                        <button
                                                            onClick={() => navigateVersion(index, 'prev')}
                                                            disabled={(msg.currentVersion ?? msg.versions.length - 1) === 0}
                                                            className="p-0.5 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <ChevronLeft className="w-3 h-3" />
                                                        </button>
                                                        <span className="px-1">
                                                            {(msg.currentVersion ?? msg.versions.length - 1) + 1}/{msg.versions.length}
                                                        </span>
                                                        <button
                                                            onClick={() => navigateVersion(index, 'next')}
                                                            disabled={(msg.currentVersion ?? msg.versions.length - 1) === msg.versions.length - 1}
                                                            className="p-0.5 rounded hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <ChevronRight className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                {/* Visual Search UI */}
                                                {msg.role === 'assistant' && (
                                                    <div className="w-full max-w-none">
                                                        {msg.searchStatus && msg.searchStep !== 'thinking' && (
                                                            <SearchProgress
                                                                status={msg.searchStatus}
                                                                step={msg.searchStep}
                                                                progress={msg.searchProgress}
                                                            />
                                                        )}
                                                        {msg.searchResults && msg.searchResults.length > 0 && (
                                                            <SearchResultsGrid results={msg.searchResults} />
                                                        )}
                                                    </div>
                                                )}


                                            </div>

                                            {/* Reasoning Accordion - Replaces old panel */}
                                            {msg.reasoningContent && (
                                                <div className="mb-4">
                                                    <ReasoningAccordion
                                                        content={msg.reasoningContent}
                                                        isOpen={showThinkingPanel === index}
                                                        onToggle={() => setShowThinkingPanel(showThinkingPanel === index ? null : index)}
                                                        isLoading={isLoading && index === messages.length - 1}
                                                    />
                                                </div>
                                            )}

                                            {/* Content with Markdown Rendering */}
                                            {editingIndex === index && msg.role === 'user' ? (
                                                <div className="space-y-2">
                                                    <textarea
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        className="w-full p-3 text-sm border border-neutral-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                                                        rows={3}
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={saveEditAndResend}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                                                        >
                                                            <Send className="w-3 h-3" />
                                                            Save & Resend
                                                        </button>
                                                        <button
                                                            onClick={cancelEdit}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors"
                                                        >
                                                            <XIcon className="w-3 h-3" />
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-neutral-700 leading-relaxed text-[15px]">
                                                    <RenderContent content={msg.content} />
                                                </div>
                                            )}

                                            {/* Performance Stats */}
                                            {msg.stats && msg.role === 'assistant' && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex flex-wrap gap-3 pt-3 border-t border-neutral-100 mt-2"
                                                >
                                                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>Total: <span className="text-neutral-600 font-medium">{msg.stats.totalTime}s</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                                        <Timer className="w-3.5 h-3.5" />
                                                        <span>TTFT: <span className="text-neutral-600 font-medium">{msg.stats.timeToFirstToken}s</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                                                        <Gauge className="w-3.5 h-3.5" />
                                                        <span>Speed: <span className="text-neutral-600 font-medium">{msg.stats.tokensPerSecond} tok/s</span></span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>
                    </motion.div>
                )}

                {/* Scroll to Bottom Button */}
                <AnimatePresence>
                    {showScrollButton && hasStarted && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => {
                                isAutoScrolling.current = true
                                scrollToBottom(true)
                                setShowScrollButton(false)
                            }}
                            className="fixed bottom-36 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-sm border border-neutral-200 rounded-full shadow-lg hover:shadow-xl hover:border-neutral-300 transition-all group"
                        >
                            <ArrowDown className="w-4 h-4 text-neutral-500 group-hover:text-rose-500 transition-colors" />
                            <span className="text-sm font-medium text-neutral-600 group-hover:text-neutral-800">Scroll to bottom</span>
                            {isLoading && (
                                <span className="flex items-center gap-1.5 text-xs text-rose-500">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Generating...
                                </span>
                            )}
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Input Area - Fixed Bottom */}
                {hasStarted && (
                    <motion.div
                        layout
                        layoutId="prompt-input-container"
                        className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-white/0 z-40"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="max-w-2xl mx-auto">
                            <PromptInputBox
                                onSend={handleSendMessage}
                                onReset={clearChat}
                                showResetButton={true}
                                isLoading={isLoading}
                                placeholder="Continue the conversation..."
                                className="bg-white border-2 border-neutral-200/80 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] hover:border-neutral-300/80 transition-all duration-300"
                            />
                            <p className="text-center text-[10px] text-neutral-300 mt-2 font-light">
                                Powered by GLM-4.7
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                    <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-rose-50/40 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-purple-50/30 rounded-full blur-[100px]" />
                </div>

            </main>
        </LayoutGroup>
    )
}
