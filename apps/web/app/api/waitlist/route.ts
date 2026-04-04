import { NextRequest , NextResponse} from 'next/server'
import { prisma } from '@repo/db'
import { headers } from 'next/headers'
import { z } from 'zod'

const schema = z.object({
    email: z.string().email(),
});
export async function POST(req: NextRequest){
    try{
        const { email } = schema.parse(await req.json());

        // email already exists

        const existing = await prisma.waitlist.findFirst({
            where: {email: email}
        })

        if(existing){
            return NextResponse.json({ message: "You are already on the waitlist"}, { status: 400})
        }
        await prisma.waitlist.create({
            data: { email }
        })
        return NextResponse.json({ message : "You're on the waitlist"}, {status: 200})
    } catch(error){
        console.log("error : ", error);
        return NextResponse.json({message: `error encountered ${error}`}, {status: 500})
    }
}