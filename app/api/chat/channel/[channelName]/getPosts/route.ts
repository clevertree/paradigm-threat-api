// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {getChannelPosts} from "@/app/api/chat/client";

export const revalidate = 60 // revalidate every minute

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
            // headers: {
            //     'Cache-Control': 's-maxage=60, stale-while-revalidate',
            // }
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
