import {sql} from "@vercel/postgres";
import {Post} from "mattermost-redux/types/posts";

export interface ChannelInfo {
    id: number,
    name: string,
    description: string,
    // posts?: any[]
}

export interface UserInfo {
    id: number,
    username: string,
    email?: string,
    full_name?: string,
}

export interface PostInfo {
    id: number,
    user_id: number,
    channel_id: number,
    created: string,
    content: string,
}

export async function getChannelPosts(channelName: string, limit: number = 25) {
    const {rows} = await sql`SELECT p.*, u.username, u.email as user_email
                             FROM posts p
                                      JOIN channels c ON p.channel_id = c.id
                                      JOIN users u ON p.user_id = u.id
                             WHERE c.name = ${channelName}
                             ORDER BY p.created DESC
                                 LIMIT ${limit};`

    return rows as Array<PostInfo>
}

export async function getChannelInfo(channelName: string) {
    const {rows} = await sql`SELECT *
                             FROM channels c
                             WHERE c.name = ${channelName};`

    return rows[0] as ChannelInfo
}

export async function getChannelList() {
    const {rows} = await sql`SELECT *
                             FROM channels c;`

    return rows as Array<ChannelInfo>
}


export async function insertChannel({
                                        name,
                                        description,
                                    }: ChannelInfo) {
    await sql`INSERT
              INTO channels (name, description)
              VALUES (${name}, ${description}) ON CONFLICT (name) DO
    UPDATE SET description = ${description};`;

    const {rows, fields} = await sql`SELECT *
                                     FROM channels
                                     WHERE name = ${name} LIMIT 1;`;
    return rows[0] as ChannelInfo
}

export async function insertUser({username, full_name, email}: UserInfo) {

    await sql`INSERT
              INTO users (username, full_name, email)
              VALUES (${username}, ${full_name}, ${email}) ON CONFLICT (username) DO
    UPDATE SET full_name = ${full_name}, email = ${email};`;

    const {rows, fields} = await sql`SELECT *
                                     FROM users
                                     WHERE username = ${username} LIMIT 1;`;
    return rows[0] as UserInfo
}

export async function getUserInfo(username: string) {
    const {rows} = await sql`SELECT *
                             FROM users u
                             WHERE u.username = ${username};`

    return rows[0] as UserInfo
}

export async function getOrCreateUserInfo(username: string) {
    let userInfo = await getUserInfo(username);
    if (!userInfo) {
        await insertUser({id: -1, username})
        userInfo = await getUserInfo(username);
    }
    return userInfo
}


export async function insertPost({user_id, channel_id, content, created}: PostInfo) {

    const res = await sql`INSERT
                          INTO posts (user_id, channel_id, content, created)
                          VALUES (${user_id}, ${channel_id}, ${content}, ${created}) RETURNING id;`;
    const {id} = res.rows[0];

    const {rows, fields} = await sql`SELECT p.*, u.username, c.name as channel_name
                                     FROM posts p
                                              JOIN channels c ON p.channel_id = c.id
                                              JOIN users u ON p.user_id = u.id
                                     WHERE p.id = ${id} LIMIT 1;`;
    const postInfo = rows[0] as PostInfo;
    if (!postInfo)
        throw new Error("Unable to insert post: " + id);
    return postInfo;
}

export async function deletePost(id: number) {
    const {rowCount} = await sql`DELETE
                                 FROM posts
                                 WHERE id = ${id};`;
    if (rowCount === 0)
        throw new Error("Failed to delete post id " + id);
}