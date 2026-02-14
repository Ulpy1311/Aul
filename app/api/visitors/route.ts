import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database', 'visitors.json');

// Ensure database exists
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '[]', 'utf8');
}

export async function GET() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        const visitors = JSON.parse(data);
        return NextResponse.json(visitors);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read database' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, message, gender } = body;

        if (!name || !message) {
            return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
        }

        const newVisitor = {
            id: Date.now().toString(),
            name,
            message,
            gender: gender || 'male', // Default to male if not specified
            createdAt: new Date().toISOString(),
        };

        const data = fs.readFileSync(DB_PATH, 'utf8');
        const visitors = JSON.parse(data);

        // Add new visitor at the beginning
        visitors.unshift(newVisitor);

        fs.writeFileSync(DB_PATH, JSON.stringify(visitors, null, 2), 'utf8');

        return NextResponse.json(newVisitor);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
    }
}
