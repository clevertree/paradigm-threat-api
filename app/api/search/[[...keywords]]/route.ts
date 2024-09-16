import {searchPathsByKeywords} from "@/app/api/search/searchDB";
import getCORSHeaders from "@/app/api/cors";

export const revalidate = 60 // revalidate every minute

export async function GET(
    req: Request,
    {params: {keywords}}: { params: { keywords: string[] } }
) {
    try {
        const {searchParams} = new URL(req.url);
        const limit = searchParams.get('limit')
        const foundPathResults = await searchPathsByKeywords(keywords, limit ? parseInt(limit) : undefined)
        return Response.json(foundPathResults.map(p => p.path), {
            status: 200,
            headers: getCORSHeaders(req)
        })

    } catch (error: any) {
        console.log(error)
        return Response.json({
            error: error + '',
        }, {
            status: 400,
            statusText: error + '',
            headers: getCORSHeaders(req)
        })
    }
}
