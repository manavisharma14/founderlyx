// app/api/generate-drafts/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@repo/db'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are a top 0.1% cold outreach copywriter who has booked 1000+ meetings for founders.

Rules (never break):
- Be human, direct, curious — never salesy
- Use the founder's exact voice and style
- One clear reason for reaching out (no fluff)
- Never say "just checking in" or "touching base"
- End with a specific CTA (call, reply, etc.)
- Max 4 sentences per email
- Use real curiosity triggers from their world

Generate exactly 4 emails:
1. Opener (first touch)
2. Follow-up 1 (Day 3) — add new value
3. Follow-up 2 (Day 7) — social proof or case study
4. Follow-up 3 (Day 14) — final nudge with scarcity

Format exactly:
OPENER:
[text]

FOLLOW-UP 1 (Day 3):
[text]

FOLLOW-UP 2 (Day 7):
[text]

FOLLOW-UP 3 (Day 14):
[text]`

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const contacts = await prisma.contact.findMany({
    where: {
      userId,
      status: 'new',
      draftOpener: null,
    },
    take: 30, // 30 at a time is sweet spot
  })

  if (contacts.length === 0) {
    return NextResponse.json({ message: 'No contacts to process' })
  }

  const results = { success: 0, failed: 0 }

  for (const contact of contacts) {
    try {
      // Try to get real context (LinkedIn, website, etc.) — future upgrade
      // For now, use what we have + smart assumptions
      const context = contact.company
        ? `They work at ${contact.company}. Assume they're busy but ambitious.`
        : `We don't know their company. Be extra curious.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.9,
        max_tokens: 800,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Name: ${contact.name || 'there'}
Company: ${contact.company || 'unknown'}
Context: ${context}

Write 4 hyper-personalized emails in the founder's voice.`,
          },
        ],
      })

      const text = completion.choices[0]?.message?.content || ''
      if (!text.includes('OPENER:')) {
        throw new Error('Invalid format from AI')
      }

      const opener = text.split('FOLLOW-UP 1')[0].replace('OPENER:', '').trim()
      const f1 = extractSection(text, 'FOLLOW-UP 1', 'FOLLOW-UP 2')
      const f2 = extractSection(text, 'FOLLOW-UP 2', 'FOLLOW-UP 3')
      const f3 = text.split('FOLLOW-UP 3')[1]?.trim() || ''

      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          status: 'ready',
          draftOpener: opener || '[Failed]',
          draftFollowup1: f1,
          draftFollowup2: f2,
          draftFollowup3: f3,
          sequenceStep: 0,
          nextSendAt: new Date(),
        },
      })

      results.success++
    } catch (error) {
      console.error(`Failed for ${contact.email}:`, error)
      results.failed++
    }

    // Be nice to OpenAI rate limits
    await new Promise(r => setTimeout(r, 200))
  }

  return NextResponse.json({
    message: 'Drafts generated',
    processed: contacts.length,
    ...results,
  })
}

function extractSection(text: string, start: string, end: string): string {
  try {
    return text.split(start)[1]?.split(end)[0]?.replace(/.*:\s*/, '').trim() || ''
  } catch {
    return ''
  }
}