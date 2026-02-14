import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const BRAVE_API_KEY = process.env.BRAVE_API_KEY || "BSAVfkeW2w3CEOGce_LxjMvy0FIEvdN";
const BRAVE_BASE_URL = "https://api.search.brave.com/res/v1";

export type SearchType = 'web' | 'news' | 'images' | 'videos' | 'summarizer';

interface BraveSearchRequest {
    query: string;
    searchType?: SearchType;
    count?: number;
    freshness?: string; // For news: 24h, 7d, 30d
    country?: string;
    search_lang?: string;
    summarizer?: boolean;
}

interface WebResult {
    title: string;
    url: string;
    description: string;
    age?: string;
    thumbnail?: string;
}

interface NewsResult {
    title: string;
    url: string;
    description: string;
    age: string;
    source: string;
    thumbnail?: string;
}

interface ImageResult {
    title: string;
    url: string;
    thumbnail: string;
    source: string;
    width?: number;
    height?: number;
}

interface VideoResult {
    title: string;
    url: string;
    description: string;
    thumbnail: string;
    duration?: string;
    publisher?: string;
    age?: string;
}

interface SummarizerResult {
    summary: string;
    title?: string;
    enrichments?: string[];
    followups?: string[];
}

interface SearchResponse {
    success: boolean;
    query: string;
    searchType: SearchType;
    results: WebResult[] | NewsResult[] | ImageResult[] | VideoResult[];
    summarizer?: SummarizerResult;
    totalFound?: number;
    error?: string;
}

/**
 * Web Search - Core search API
 */
async function searchWeb(query: string, count: number = 10): Promise<WebResult[]> {
    const url = new URL(`${BRAVE_BASE_URL}/web/search`);
    url.searchParams.set('q', query);
    url.searchParams.set('count', String(count));
    url.searchParams.set('search_lang', 'id');
    url.searchParams.set('text_decorations', 'false');

    const response = await fetch(url.toString(), {
        headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': BRAVE_API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`Brave Web Search failed: ${response.status}`);
    }

    const data = await response.json();

    return (data.web?.results || []).map((r: { title?: string; url?: string; description?: string; age?: string; thumbnail?: { src?: string } }) => ({
        title: r.title || 'No title',
        url: r.url || '',
        description: r.description || '',
        age: r.age,
        thumbnail: r.thumbnail?.src
    }));
}

/**
 * News Search - Real-time news articles
 */
async function searchNews(query: string, count: number = 10, freshness: string = '24h'): Promise<NewsResult[]> {
    const url = new URL(`${BRAVE_BASE_URL}/news/search`);
    url.searchParams.set('q', query);
    url.searchParams.set('count', String(count));
    url.searchParams.set('freshness', freshness);
    url.searchParams.set('search_lang', 'id');

    const response = await fetch(url.toString(), {
        headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': BRAVE_API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`Brave News Search failed: ${response.status}`);
    }

    const data = await response.json();

    return (data.results || []).map((r: { title?: string; url?: string; description?: string; age?: string; meta_url?: { hostname?: string }; thumbnail?: { src?: string } }) => ({
        title: r.title || 'No title',
        url: r.url || '',
        description: r.description || '',
        age: r.age || '',
        source: r.meta_url?.hostname || 'Unknown',
        thumbnail: r.thumbnail?.src
    }));
}

/**
 * Image Search - Billions of images
 */
async function searchImages(query: string, count: number = 10): Promise<ImageResult[]> {
    const url = new URL(`${BRAVE_BASE_URL}/images/search`);
    url.searchParams.set('q', query);
    url.searchParams.set('count', String(count));
    url.searchParams.set('safesearch', 'moderate');

    const response = await fetch(url.toString(), {
        headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': BRAVE_API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`Brave Image Search failed: ${response.status}`);
    }

    const data = await response.json();

    return (data.results || []).map((r: { title?: string; url?: string; thumbnail?: { src?: string }; source?: string; properties?: { width?: number; height?: number } }) => ({
        title: r.title || 'No title',
        url: r.url || '',
        thumbnail: r.thumbnail?.src || '',
        source: r.source || '',
        width: r.properties?.width,
        height: r.properties?.height
    }));
}

/**
 * Video Search - Video content with metadata
 */
async function searchVideos(query: string, count: number = 10): Promise<VideoResult[]> {
    const url = new URL(`${BRAVE_BASE_URL}/videos/search`);
    url.searchParams.set('q', query);
    url.searchParams.set('count', String(count));

    const response = await fetch(url.toString(), {
        headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': BRAVE_API_KEY
        }
    });

    if (!response.ok) {
        throw new Error(`Brave Video Search failed: ${response.status}`);
    }

    const data = await response.json();

    return (data.results || []).map((r: { title?: string; url?: string; description?: string; thumbnail?: { src?: string }; video?: { duration?: string; publisher?: string }; age?: string }) => ({
        title: r.title || 'No title',
        url: r.url || '',
        description: r.description || '',
        thumbnail: r.thumbnail?.src || '',
        duration: r.video?.duration,
        publisher: r.video?.publisher,
        age: r.age
    }));
}

/**
 * AI Summarizer - Get AI-generated summary
 */
async function getSummarizer(query: string): Promise<SummarizerResult | null> {
    // First get web search with summarizer key
    const url = new URL(`${BRAVE_BASE_URL}/web/search`);
    url.searchParams.set('q', query);
    url.searchParams.set('summary', '1');

    const response = await fetch(url.toString(), {
        headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip',
            'X-Subscription-Token': BRAVE_API_KEY
        }
    });

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    if (data.summarizer?.key) {
        // Fetch the actual summary
        const summaryUrl = new URL(`${BRAVE_BASE_URL}/summarizer/search`);
        summaryUrl.searchParams.set('key', data.summarizer.key);
        summaryUrl.searchParams.set('entity_info', '1');

        const summaryResponse = await fetch(summaryUrl.toString(), {
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'X-Subscription-Token': BRAVE_API_KEY
            }
        });

        if (summaryResponse.ok) {
            const summaryData = await summaryResponse.json();
            return {
                summary: summaryData.summary || '',
                title: summaryData.title,
                enrichments: summaryData.enrichments?.map((e: { title?: string }) => e.title) || [],
                followups: summaryData.followups || []
            };
        }
    }

    return null;
}

export async function POST(req: Request) {
    try {
        const { query, searchType = 'web', count = 10, freshness, summarizer }: BraveSearchRequest = await req.json();

        if (!query || query.trim().length === 0) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        console.log(`[Brave Search] Type: ${searchType}, Query: "${query}"`);

        let results: WebResult[] | NewsResult[] | ImageResult[] | VideoResult[] = [];
        let summarizerResult: SummarizerResult | null = null;

        switch (searchType) {
            case 'news':
                results = await searchNews(query, count, freshness || '24h');
                break;
            case 'images':
                results = await searchImages(query, count);
                break;
            case 'videos':
                results = await searchVideos(query, count);
                break;
            case 'web':
            default:
                results = await searchWeb(query, count);
                break;
        }

        // Get AI summary if requested
        if (summarizer) {
            summarizerResult = await getSummarizer(query);
        }

        const response: SearchResponse = {
            success: true,
            query: query.trim(),
            searchType,
            results,
            summarizer: summarizerResult || undefined,
            totalFound: results.length
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('[Brave Search] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Search failed',
                details: String(error)
            },
            { status: 500 }
        );
    }
}
