import {sql} from "@vercel/postgres";

export interface SearchKeyword {
    id: number,
    keyword: string,
}

export interface SearchPathKeywords {
    path_id: number,
    keyword_id: number,
    count_id: number,
}

export interface SearchPaths {
    id: number,
    path: string,
    crc32: number,
    updated: Date,
}

export interface KeywordSearchResult {
    path: string,
    count: number,
}

export async function searchPathsByKeywords(keywords: string[], limit: number = 25) {
    const {rows} = await sql`SELECT *
                             from search_path_by_keywords(${keywords.join(',')}, ${limit});`

    return rows as Array<KeywordSearchResult>
}
