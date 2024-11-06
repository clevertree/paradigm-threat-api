import {z} from 'zod';
import {deletePost, getChannelInfo, getOrCreateUserInfo, getUserInfo, insertPost} from "@/app/api/chat/clientDB";
import getCORSHeaders from "@/app/api/cors";
import {NextRequest} from "next/server";

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
    content: z.string().min(1).max(1024),
    username: z.string().min(1).max(18),
    mode: z.string().optional(),
});

export async function POST(
    req: NextRequest,
    {params:{channelName}}: any
) {
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
            headers: getCORSHeaders(req)
        })

    } catch (error: any) {
        console.log(error)
        responseBody.error = error;
        return Response.json({
            ...responseBody,
            error,
        }, {
            status: 400,
            headers: getCORSHeaders(req)
        })
    }
}

export async function OPTIONS(req: Request) {
    return new Response('Preflight!', {
        status: 200,
        headers: getCORSHeaders(req)
    })
}
