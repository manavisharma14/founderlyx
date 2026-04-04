import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth';
import Papa from "papaparse"
import { prisma } from '@repo/db'

export async function POST(req: NextRequest){
    const session = await getSession();
    
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized — no user ID" }, { status: 401 })
    }

    const userId = session.user.id  
    const formData = await req.formData();
    const file = formData.get("file") as File | null

    if (!file) {
        return NextResponse.json({ message: "No file uploaded" }, { status: 400 })
    }

    const csvText = await file.text();
    
    const parsed = Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase()
    });

    if (parsed.errors.length > 0) {
        return NextResponse.json({ message: "Invalid CSV format" }, { status: 400 })
    }

    for (const row of parsed.data) {
        const email = row.email?.trim()
        if (!email) continue;

        await prisma.contact.upsert({
            where: {
                userId_email: {
                    userId: userId,      
                    email: email.toLowerCase(),
                }
            },
            update: {
                name: row.name?.trim() || "Unknown",
                company: row.company?.trim() || null,
            },
            create: {
                userId: userId,      
                email: email.toLowerCase(),
                 name: row.name?.trim() || "Unknown",
                company: row.company?.trim() || null,
            }
        })
    }

    return NextResponse.json({ success: true })
}