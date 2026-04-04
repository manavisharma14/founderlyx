import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest){
    const url = new URL(req.url)

    const contactId = url.searchParams.get('id');

    console.log('opened email : ', contactId);

    // return a tiny invisible image
    const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')

    return new Response(pixel, {
        headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'no-store'
        }
    })
}