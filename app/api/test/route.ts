import {NextResponse} from 'next/server';
// import {getMMChannelPosts, getMMChannelList, getMMUserList, getChannelID} from "@/app/api/chat/mmClient";
// import {Client4} from "mattermost-redux/client";
import Export from "./export.json"
import {ChannelInfo, insertChannel, insertPost, insertUser, PostInfo, UserInfo} from "@/app/api/chat/client";

export async function GET(request: Request) {
    // const { searchParams } = new URL(request.url);
    // const channelName = searchParams.get('channel') || 'general';

    //
    try {
        const channels: { [key: string]: ChannelInfo } = {};
        const users: { [key: string]: UserInfo } = {};
        const posts: Array<PostInfo> = [];
        for (let i = 0; i < Export.length; i++) {
            const entry = Export[i];
            if (entry.type === 'channel') {
                const mmChannel: MMChannel = entry.channel;
                const {name} = mmChannel;
                console.log('Inserting Channel ', name)
                const newChannel: ChannelInfo = {
                    id: -1,
                    name: mmChannel.name,
                    description: mmChannel.purpose,
                }
                channels[name] = await insertChannel(newChannel)
            }
        }
        for (let i = 0; i < Export.length; i++) {
            const entry = Export[i];
            if (entry.type === 'user') {
                const mmUser: MMUser = entry.user;
                const {username} = mmUser;
                const newUser: UserInfo = {
                    id: -1,
                    email: mmUser.email,
                    username: mmUser.username,
                    full_name: mmUser.nickname,
                }
                console.log('Inserting User ', username)
                users[username] = await insertUser(newUser)
            }
        }
        for (let i = 0; i < Export.length; i++) {
            // const entry = Export[i];
            // if (entry.type === 'post') {
            //     const mmPost: MMPost = entry.post;
            //     const newPost: PostInfo = {
            //         id: -1,
            //         created: new Date(mmPost.create_at).toISOString(),
            //         user_id: users[mmPost.user].id,
            //         channel_id: channels[mmPost.channel].id,
            //         content: mmPost.message
            //     }
            //     // const postInfo = await insertPost(newPost)
            //     // posts.push(postInfo)
            // }
            if (1 === i % 100)
                console.log('i ', i)
        }
        return NextResponse.json({channels, users, posts}, {status: 200});

    } catch (error) {
        console.error(error)
        return NextResponse.json({errorInfo: error, error: error + ''}, {status: 500});
    }
    //
    // const pets = await sql`SELECT * FROM Pets;`;
}

interface MMChannel {
    name: string
    purpose: string
}

interface MMUser {
    username: string
    email: string
    nickname: string
}

interface MMPost {
    "channel": string,
    "user": string,
    "message": string,
    "create_at": number
}


