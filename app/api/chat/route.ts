import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// Using Node.js runtime for better fetch compatibility and file processing
export const runtime = 'nodejs';

const API_KEY = process.env.NVIDIA_API_KEY || "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";
const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const BRAVE_API_KEY = process.env.BRAVE_API_KEY || "BSAVfkeW2w3CEOGce_LxjMvy0FIEvdN";
const BRAVE_BASE_URL = "https://api.search.brave.com/res/v1";

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface DocumentInput {
    name: string;
    type: string;
    content: string;
    isBase64?: boolean;
}

type SearchCategory = 'web' | 'news' | 'images' | 'videos';

interface ChatRequest {
    messages: ChatMessage[];
    useThinking?: boolean;
    useSearch?: boolean;
    searchCategories?: SearchCategory[];
    documents?: DocumentInput[];
}

interface SearchResult {
    title: string;
    url: string;
    description: string;
    source?: string;
    age?: string;
    thumbnail?: string;
}

/**
 * Perform web search using Brave Search API
 */
async function performBraveSearch(
    query: string,
    categories: SearchCategory[] = ['web'],
    maxResults: number = 5
): Promise<{ category: string; results: SearchResult[] }[]> {
    const allResults: { category: string; results: SearchResult[] }[] = [];

    for (const category of categories) {
        // Add a delay to respect rate limits (1 request per second for free tier)
        if (categories.indexOf(category) > 0) {
            await new Promise(resolve => setTimeout(resolve, 1100));
        }

        try {
            let endpoint = '';
            switch (category) {
                case 'news':
                    endpoint = `${BRAVE_BASE_URL}/news/search`;
                    break;
                case 'images':
                    endpoint = `${BRAVE_BASE_URL}/images/search`;
                    break;
                case 'videos':
                    endpoint = `${BRAVE_BASE_URL}/videos/search`;
                    break;
                case 'web':
                default:
                    endpoint = `${BRAVE_BASE_URL}/web/search`;
                    break;
            }

            const url = new URL(endpoint);
            url.searchParams.set('q', query);
            url.searchParams.set('count', String(maxResults));

            console.log(`[Chat API] Brave Search (${category}): "${query}"`);

            const response = await fetch(url.toString(), {
                headers: {
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip',
                    'X-Subscription-Token': BRAVE_API_KEY
                }
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.warn(`[Chat API] Brave Rate Limit Hit (429) for ${category}. Skipping.`);
                    // Optionally could add a Retry-After logic here, but for now we skip to avoid hanging
                    continue;
                }
                console.error(`[Chat API] Brave ${category} search failed: ${response.status}`);
                continue;
            }

            const data = await response.json();
            let results: SearchResult[] = [];

            if (category === 'web') {
                results = (data.web?.results || []).slice(0, maxResults).map((r: { title?: string; url?: string; description?: string; age?: string }) => ({
                    title: r.title || 'No title',
                    url: r.url || '',
                    description: r.description || '',
                    age: r.age
                }));
            } else if (category === 'news') {
                results = (data.results || []).slice(0, maxResults).map((r: { title?: string; url?: string; description?: string; age?: string; meta_url?: { hostname?: string } }) => ({
                    title: r.title || 'No title',
                    url: r.url || '',
                    description: r.description || '',
                    source: r.meta_url?.hostname || '',
                    age: r.age
                }));
            } else if (category === 'images') {
                results = (data.results || []).slice(0, maxResults).map((r: { title?: string; url?: string; source?: string; thumbnail?: { src?: string } }) => ({
                    title: r.title || 'No title',
                    url: r.url || '',
                    description: '',
                    source: r.source || '',
                    thumbnail: r.thumbnail?.src
                }));
            } else if (category === 'videos') {
                results = (data.results || []).slice(0, maxResults).map((r: { title?: string; url?: string; description?: string; age?: string; video?: { publisher?: string }; thumbnail?: { src?: string } }) => ({
                    title: r.title || 'No title',
                    url: r.url || '',
                    description: r.description || '',
                    source: r.video?.publisher || '',
                    age: r.age,
                    thumbnail: r.thumbnail?.src
                }));
            }

            allResults.push({ category, results });
        } catch (error) {
            console.error(`[Chat API] Brave ${category} search error:`, error);
        }
    }

    return allResults;
}

/**
 * Extract search query from user message
 */
function extractSearchQuery(messages: ChatMessage[]): string {
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return '';

    let query = lastUserMessage.content;
    // Remove document attachments from query
    query = query.replace(/━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━[\s\S]*━━━━━━━━━━ End of [^━]+ ━━━━━━━━━━/g, '');
    return query.trim().slice(0, 200);
}

/**
 * Format search results for AI context
 */
function formatSearchResultsForAI(allResults: { category: string; results: SearchResult[] }[], query: string): string {
    if (allResults.length === 0 || allResults.every(r => r.results.length === 0)) {
        return `[Pencarian untuk "${query}": Tidak ditemukan hasil.]`;
    }

    let formatted = `\n\n🔍 **Hasil Pencarian Brave untuk "${query}":**\n`;

    for (const { category, results } of allResults) {
        if (results.length === 0) continue;

        const categoryEmoji = category === 'news' ? '📰' : category === 'images' ? '🖼️' : category === 'videos' ? '🎬' : '🌐';
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

        formatted += `\n${categoryEmoji} **${categoryName}:**\n`;
        formatted += `───────────────────────────────\n`;

        results.forEach((r, i) => {
            formatted += `**${i + 1}. ${r.title}**\n`;
            formatted += `   📎 ${r.url}\n`;
            if (r.description) formatted += `   ${r.description}\n`;
            if (r.source) formatted += `   📍 Source: ${r.source}\n`;
            if (r.age) formatted += `   🕐 ${r.age}\n`;
            formatted += '\n';
        });
    }

    formatted += `───────────────────────────────\n`;
    formatted += `📌 Gunakan informasi di atas untuk menjawab pertanyaan user dengan akurat dan lengkap.\n`;

    return formatted;
}

export async function POST(req: Request) {
    const startTime = Date.now();
    let firstTokenTime: number | null = null;
    let tokenCount = 0;

    // Load system prompt fresh for every request
    let systemPromptContent = 'Kamu adalah Aulia, AI assistant yang ramah dan helpful.';
    try {
        const promptPath = join(process.cwd(), 'ChatAI', 'SystemPrompt.json');
        const promptData = JSON.parse(readFileSync(promptPath, 'utf-8'));
        systemPromptContent = promptData.systemPrompt || systemPromptContent;
    } catch (error) {
        console.error('Failed to load system prompt:', error);
    }

    try {
        const { messages, useThinking, useSearch, searchCategories, documents }: ChatRequest = await req.json();

        // Create a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                // Helper to send events (defined outside try to be available in catch)
                const sendEvent = (data: any) => {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                }

                try {
                    // Process messages with documents
                    let processedMessages = await processMessagesWithDocuments(messages, documents);

                    // Perform Search if requested
                    if (useSearch) {
                        const searchQuery = extractSearchQuery(processedMessages);
                        if (searchQuery) {
                            const categories: SearchCategory[] = searchCategories && searchCategories.length > 0 ? searchCategories : ['web'];

                            // Send initial searching status
                            sendEvent({ type: 'status', message: `Aulia is Searching...`, step: 'searching' });

                            const allSearchResults: { category: string; results: SearchResult[] }[] = [];

                            // Search each category with real-time updates
                            for (let i = 0; i < categories.length; i++) {
                                const category = categories[i];
                                const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

                                // Send category-specific status
                                sendEvent({
                                    type: 'status',
                                    message: `Searching ${categoryName}...`,
                                    step: 'searching',
                                    progress: { current: i + 1, total: categories.length }
                                });

                                // Add delay for rate limiting (except first)
                                if (i > 0) {
                                    await new Promise(resolve => setTimeout(resolve, 1100));
                                }

                                // Category-specific result limits
                                const maxResults = (category === 'web' || category === 'news') ? 10 : 5;

                                // Perform search for this category
                                const categoryResults = await performBraveSearch(searchQuery, [category], maxResults);

                                if (categoryResults.length > 0 && categoryResults[0].results.length > 0) {
                                    allSearchResults.push(...categoryResults);
                                    // Send partial results as they come
                                    sendEvent({
                                        type: 'search_results',
                                        data: categoryResults,
                                        partial: true
                                    });
                                }
                            }

                            // Send search complete event
                            const totalResults = allSearchResults.reduce((acc, cat) => acc + cat.results.length, 0);
                            sendEvent({
                                type: 'search_complete',
                                message: `Found ${totalResults} sources`,
                                totalResults
                            });

                            // Format for AI Context
                            const searchContext = formatSearchResultsForAI(allSearchResults, searchQuery);

                            // Inject into context
                            const lastUserIdx = processedMessages.length - 1;
                            if (lastUserIdx >= 0) {
                                processedMessages[lastUserIdx] = {
                                    ...processedMessages[lastUserIdx],
                                    content: processedMessages[lastUserIdx].content + searchContext
                                };
                            }
                        }
                    }

                    // Prepare AI Request
                    const messagesWithSystem: ChatMessage[] = [
                        { role: 'system', content: systemPromptContent },
                        ...processedMessages
                    ];

                    const payload = {
                        model: "z-ai/glm4.7",
                        messages: messagesWithSystem,
                        max_tokens: 16384,
                        temperature: 1,
                        top_p: 1,
                        stream: true,
                        chat_template_kwargs: useThinking
                            ? { enable_thinking: true, clear_thinking: false }
                            : { enable_thinking: false, clear_thinking: true }
                    };

                    // Send thinking status if Think mode is active
                    if (useThinking) {
                        sendEvent({
                            type: 'status',
                            message: 'Aulia is Thinking Deeply...',
                            step: 'thinking'
                        });
                    }

                    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${API_KEY}`,
                            "Content-Type": "application/json",
                            "Accept": "text/event-stream"
                        },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        throw new Error(`NVIDIA API Error: ${await response.text()}`);
                    }

                    if (!response.body) {
                        throw new Error("No response body from NVIDIA API");
                    }

                    // Pipe the AI stream
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value);
                        // Forward the raw chunk (it's already in data: format from NVIDIA)
                        // But we want to intercept it to count tokens

                        // Parse for stats
                        if (firstTokenTime === null && chunk.includes('"content"')) {
                            firstTokenTime = Date.now();
                        }
                        const contentMatches = chunk.match(/"content"\s*:\s*"[^"]*"/g);
                        if (contentMatches) {
                            tokenCount += contentMatches.length;
                        }

                        // Simply forward the chunk text to the client
                        // Note: NVIDIA sends "data: {...}\n\n", which matches our format
                        controller.enqueue(encoder.encode(chunk));
                    }

                    // Send final stats
                    const totalTime = (Date.now() - startTime) / 1000;
                    const ttft = firstTokenTime ? (firstTokenTime - startTime) / 1000 : 0;
                    const tokensPerSecond = totalTime > 0 ? (tokenCount / totalTime).toFixed(1) : "0";

                    sendEvent({
                        type: "stats",
                        totalTime: totalTime.toFixed(2),
                        timeToFirstToken: ttft.toFixed(2),
                        tokensPerSecond: tokensPerSecond
                    });

                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();

                } catch (error) {
                    console.error("Stream Error:", error);
                    sendEvent({ type: 'error', message: String(error) });
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error("Request Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

/**
 * Process messages to include document content inline
 */
async function processMessagesWithDocuments(
    messages: ChatMessage[],
    documents?: DocumentInput[]
): Promise<ChatMessage[]> {
    // If no documents, return messages as-is
    if (!documents || documents.length === 0) {
        return messages;
    }

    const processedMessages = [...messages];
    const lastMessageIndex = processedMessages.length - 1;
    const lastMessage = processedMessages[lastMessageIndex];

    if (lastMessage && lastMessage.role === 'user') {
        let enhancedContent = lastMessage.content;

        // Add each document's content
        for (const doc of documents) {
            try {
                let textContent = '';
                const ext = getFileExtension(doc.name).toLowerCase();

                // Parse based on file type
                if (ext === '.pdf') {
                    textContent = await parsePDF(doc.content, doc.isBase64);
                } else if (ext === '.docx') {
                    textContent = await parseDOCX(doc.content, doc.isBase64);
                } else if (ext === '.doc') {
                    textContent = '[Format .doc (Word 97-2003) tidak sepenuhnya didukung. Harap simpan sebagai .docx untuk hasil terbaik.]';
                } else {
                    // Plain text content
                    textContent = doc.content;
                }

                if (textContent && textContent.trim()) {
                    enhancedContent += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📄 Document: ${doc.name}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${textContent}\n━━━━━━━━━━ End of ${doc.name} ━━━━━━━━━━`;
                }
            } catch (error) {
                console.error(`Error parsing document ${doc.name}:`, error);
                enhancedContent += `\n\n[Error: Gagal membaca dokumen "${doc.name}"]`;
            }
        }

        processedMessages[lastMessageIndex] = {
            role: 'user',
            content: enhancedContent
        };
    }

    return processedMessages;
}

/**
 * Parse PDF file and extract text (basic extraction without canvas dependency)
 */
async function parsePDF(content: string, isBase64?: boolean): Promise<string> {
    try {
        let buffer: Buffer;

        if (isBase64 || content.startsWith('data:')) {
            // Remove data URL prefix if present
            const base64Data = content.replace(/^data:application\/pdf;base64,/, '').replace(/^data:[^;]+;base64,/, '');
            buffer = Buffer.from(base64Data, 'base64');
        } else {
            buffer = Buffer.from(content, 'utf-8');
        }

        // Basic PDF text extraction - look for text streams
        const pdfString = buffer.toString('latin1');

        // Extract text between stream and endstream markers
        const textParts: string[] = [];

        // Method 1: Look for BT...ET text blocks
        const textBlockRegex = /BT\s*([\s\S]*?)\s*ET/g;
        let match;

        while ((match = textBlockRegex.exec(pdfString)) !== null) {
            const block = match[1];
            // Extract text from Tj and TJ operators
            const tjRegex = /\(([^)]*)\)\s*Tj/g;
            const tjArrayRegex = /\[(.*?)\]\s*TJ/g;

            let tjMatch;
            while ((tjMatch = tjRegex.exec(block)) !== null) {
                const text = decodePDFText(tjMatch[1]);
                if (text.trim()) textParts.push(text);
            }

            while ((tjMatch = tjArrayRegex.exec(block)) !== null) {
                const arrayContent = tjMatch[1];
                const textItems = arrayContent.match(/\(([^)]*)\)/g);
                if (textItems) {
                    const text = textItems.map(t => decodePDFText(t.slice(1, -1))).join('');
                    if (text.trim()) textParts.push(text);
                }
            }
        }

        // Method 2: Look for plain text patterns (for simpler PDFs)
        if (textParts.length === 0) {
            // Try to find readable text sections
            const readableText = pdfString
                .replace(/[\x00-\x1f\x7f-\x9f]/g, ' ')
                .match(/[A-Za-z0-9\s.,!?;:'"()-]{20,}/g);

            if (readableText) {
                textParts.push(...readableText.filter(t => {
                    // Filter out PDF internal keywords
                    return !t.includes('endobj') &&
                        !t.includes('endstream') &&
                        !t.includes('xref') &&
                        !t.includes('/Type') &&
                        !t.includes('/Filter');
                }));
            }
        }

        if (textParts.length === 0) {
            return '⚠️ PDF ini mungkin berisi gambar atau format yang tidak bisa diekstrak teksnya secara langsung. Untuk hasil terbaik, coba copy-paste teks dari PDF secara manual.';
        }

        // Clean and join text
        const text = textParts
            .join(' ')
            .replace(/\s+/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        return `📄 Konten PDF (ekstraksi dasar):\n\n${text}`;

    } catch (error) {
        console.error('PDF parsing error:', error);
        return '⚠️ Gagal mengekstrak teks dari PDF. Coba copy-paste teks secara manual untuk hasil terbaik.';
    }
}

/**
 * Decode PDF text encoding
 */
function decodePDFText(text: string): string {
    // Handle common PDF escape sequences
    return text
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '\r')
        .replace(/\\t/g, '\t')
        .replace(/\\\(/g, '(')
        .replace(/\\\)/g, ')')
        .replace(/\\\\/g, '\\')
        .replace(/\\(\d{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
}

/**
 * Parse DOCX file and extract text
 */
async function parseDOCX(content: string, isBase64?: boolean): Promise<string> {
    try {
        let buffer: Buffer;

        if (isBase64 || content.startsWith('data:')) {
            // Remove data URL prefix if present
            const base64Data = content
                .replace(/^data:application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document;base64,/, '')
                .replace(/^data:[^;]+;base64,/, '');
            buffer = Buffer.from(base64Data, 'base64');
        } else {
            buffer = Buffer.from(content, 'utf-8');
        }

        // Dynamic import mammoth to avoid static loading issues
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });

        if (!result.value || result.value.trim().length === 0) {
            return '[Dokumen DOCX ini kosong atau tidak mengandung teks.]';
        }

        // Clean up extracted text
        const text = result.value
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        // Report any warnings
        if (result.messages && result.messages.length > 0) {
            const warnings = result.messages
                .filter((m: { type: string }) => m.type === 'warning')
                .map((m: { message: string }) => m.message)
                .slice(0, 3);

            if (warnings.length > 0) {
                return `⚠️ Catatan: ${warnings.join('; ')}\n\n${text}`;
            }
        }

        return text;
    } catch (error) {
        console.error('DOCX parsing error:', error);
        return '[Error: Gagal mengekstrak teks dari DOCX. File mungkin rusak.]';
    }
}

function getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.slice(lastDot) : '';
}
