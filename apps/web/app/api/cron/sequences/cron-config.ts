// export const schedule = '*/1 * * * *';

export const GET = async() => {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/cron/sequences`, {
        method: 'GET',
    })
    console.log("✅ CRON HIT:", new Date().toISOString());
    return Response.json({ ok: true})
}
// cron route vercel 