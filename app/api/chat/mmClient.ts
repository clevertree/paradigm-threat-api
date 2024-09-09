import {Client4} from "mattermost-redux/client";

// if(!process.env.NEXT_PUBLIC_CHAT_URL) throw new Error("Invalid NEXT_PUBLIC_CHAT_URL")
// if(!process.env.NEXT_PRIVATE_CHAT_BOT_TOKEN) throw new Error("Invalid NEXT_PRIVATE_CHAT_BOT_TOKEN")
Client4.setUrl(`${process.env.NEXT_PUBLIC_CHAT_URL}`);
Client4.setToken(`${process.env.NEXT_PRIVATE_CHAT_BOT_TOKEN}`);
const POSTS_PER_PAGE = 15

let defaultTeamID: any = null;

type Data = {
    channel: string,
    posts: object[],
    params: object,
    error?: object
}

async function getDefaultTeamID() {
    if (defaultTeamID === null) {
        const teams = await Client4.getTeams()
        // @ts-ignore
        defaultTeamID = teams[0].id;
    }
    return defaultTeamID;
}

let mmChannelList: any = null

export async function getMMChannelList() {
    if (mmChannelList === null) {
        const team_id = await getDefaultTeamID();
        mmChannelList = await Client4.getChannels(team_id);
    }
    return mmChannelList;
}


export async function getChannelID(channelName: string) {
    const channels = await getMMChannelList()
    return channels.find((channelInfo: any) => channelInfo.name === channelName).id;
}

export async function getMMChannelPosts(channelName: string, postsPerPage: number = POSTS_PER_PAGE) {
    const users = await getMMUserList();
    const channelID = await getChannelID(channelName);
    // const teamID = await getDefaultTeamID();
    const apiResponse = await Client4.getPosts(channelID, 0, postsPerPage)
    const postsAndUsers = [...apiResponse.order].reverse().map(postID => {
        // @ts-ignore
        const postInfo = apiResponse.posts[postID];
        const username = users.find((userInfo: any) => userInfo.id === postInfo.user_id).username;
        return {
            username,
            message: postInfo.message,
            create_at: postInfo.create_at,
            postInfo
        }
    })
    return postsAndUsers
}


let mmUserList: any = null;

export async function getMMUserList() {
    if (mmUserList === null) {
        mmUserList = await Client4.getProfiles();
    }
    return mmUserList;

}
