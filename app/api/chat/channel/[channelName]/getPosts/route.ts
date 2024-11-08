// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {getChannelPosts} from "@/app/api/chat/clientDB";
import getCORSHeaders from "@/app/api/cors";

export const dynamic = 'force-dynamic';
export const revalidate = 0 // don't revalidate
// TODO: import { unstable_cache } from 'next/cache'
export async function GET(
    req: Request,
    {params:{channelName}}: any
) {
    try {
        const postsAndUsers = await getChannelPosts(channelName)
        return Response.json({
            channel: channelName,
            posts: postsAndUsers,
            url: req.url
        }, {
            status: 200,
            headers: getCORSHeaders(req)
        })

    } catch (error: any) {
        console.log(error)
        return Response.json({
            channel: "", posts: [],
            error,
            url: req.url
        }, {
            status: 400,
            headers: getCORSHeaders(req)
        })
    }
}
