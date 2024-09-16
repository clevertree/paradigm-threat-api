import {getChannelList} from "@/app/api/chat/clientDB";
import getCORSHeaders from "@/app/api/cors";

export const dynamic = 'force-dynamic';
export const revalidate = 60 // revalidate every minute

export async function GET(
    req: Request,
    {params}: { params: {} }
) {
    try {

        const channels = await getChannelList()
        return Response.json(channels, {
            status: 200,
            headers: getCORSHeaders(req)
        })

    } catch (error: any) {
        console.log(error)
        return Response.json(error, {
            status: 400,
            headers: getCORSHeaders(req)
        })
    }
}
