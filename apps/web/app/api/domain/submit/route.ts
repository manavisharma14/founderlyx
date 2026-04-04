import { NextRequest, NextResponse } from 'next/server'
import { SESClient, VerifyDomainIdentityCommand, VerifyDomainDkimCommand } from '@aws-sdk/client-ses'

const ses = new SESClient({ region: "us-east-1"})

export async function POST(req: NextRequest){
    console.log("post api hit");
    const { domain } = await req.json();

    const identityResult = await ses.send(new VerifyDomainIdentityCommand({Domain : domain}));

    const dkimResult = await ses.send(new VerifyDomainDkimCommand({ Domain: domain}))

    return NextResponse.json({
        txtToken: identityResult.VerificationToken,
        cnameTokens: dkimResult.DkimTokens
    })
}

