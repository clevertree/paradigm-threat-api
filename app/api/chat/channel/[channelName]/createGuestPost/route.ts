import {z} from 'zod';
import {deletePost, getChannelInfo, getOrCreateUserInfo, getUserInfo, insertPost} from "@/app/api/chat/clientDB";

export const dynamic = 'force-dynamic';

type responseBody = {
    channel: string,
    content: string,
    // ipAddress: string,
    postInfo: object | null,
    error?: string
}

type RequestData = {
    content: string,
    username: string,
    mode: string | undefined
}
const RequestDataValidation = z.object({
    content: z.string().min(1).max(256),
    username: z.string().min(1).max(18),
    mode: z.string().optional(),
});

export async function POST(
    req: Request,
    {params}: { params: { channelName: string } }
) {
    const {channelName} = params;
    const requestBody = await req.json();
    const responseBody: responseBody = {
        content: "",
        channel: channelName,
        // ipAddress: "",
        postInfo: null
    }
    try {
        const {content, username, mode} = RequestDataValidation.parse(requestBody) as RequestData;
        // const forwarded = `${req.headers["x-forwarded-for"]}`
        // const ipAddress: string = forwarded ? forwarded.split(/, /)[0] : `${req.socket.remoteAddress}`

        // const messageWithUsername = `*${username} says*: ${message}`
        const {id: channel_id} = await getChannelInfo(channelName);
        const {id: user_id} = await getOrCreateUserInfo(username);
        const postInfo = await insertPost({
            id: -1,
            channel_id,
            user_id,
            content,
            created: new Date().toISOString()
        })


        if (mode === 'test') {
            await deletePost(postInfo.id);
        }
        return Response.json({
            ...responseBody,
            ...postInfo,
        }, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': req.headers.get('origin') || '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        })

    } catch (error: any) {
        console.log(error)
        responseBody.error = error;
        return Response.json({
            ...responseBody,
            error,
        }, {
            status: 400,
        })
    }
}
