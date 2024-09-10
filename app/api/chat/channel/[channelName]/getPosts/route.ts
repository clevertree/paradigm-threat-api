// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {getChannelPosts} from "@/app/api/chat/client";

export const dynamic = 'force-dynamic';
export const revalidate = 0 // don't revalidate
// TODO: import { unstable_cache } from 'next/cache'
export async function GET(
    req: Request,
    {params}: { params: { channelName: string } }
) {
    try {
        const channelName = `${params.channelName}`;

        const postsAndUsers = await getChannelPosts(channelName)
        return Response.json({
            channel: channelName,
            posts: postsAndUsers,
            params,
            url: req.url
        }, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store',
            }
        })

    } catch (error: any) {
        console.log(error)
        return Response.json({
            channel: "", posts: [],
            error,
            params,
            url: req.url
        }, {
            status: 400,
        })
    }
}
