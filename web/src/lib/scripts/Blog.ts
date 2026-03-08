import { writable, type Writable } from "svelte/store";
import { Logger } from "./Logger";

type PostType = {
    _id: string | null,

    createdAt: number,
    lastModified: null | number,
    author?: string,

    title: string,
    brief: string,
    content: string,
}

let NextPage: number = 1
const Posts: Writable<PostType[]> = writable<PostType[]>([]);

async function LoadNext(): Promise<{ok: boolean, error?: string, reachedEnd?: boolean}> {
    if (NextPage < 0) {
        console.warn("No more posts to load")
        return {ok: true, reachedEnd: true} //end of posts
    }

    const r = await fetch(`/api/v2/blog/posts?page=${NextPage}`)
    if (!r.ok) {
        console.error(`Unable to update posts: ${r.status} ${r.statusText}`)
        return {ok: false, error: `Unable to update posts: ${r.status} ${r.statusText}`}
    }

    //wah wah boring ass code
    let data = await r.json()
    let newPosts: PostType[] = data.posts

    if (newPosts.length == 0 || data.limit > newPosts.length) { NextPage = -1 }
    else { NextPage++ }

    //add new posts to Posts store
    Posts.update((value) => {
        value = value.concat(newPosts)
        return value
    })

    return {ok: true, reachedEnd: data.limit > newPosts.length}
}

export {
    type PostType,

    Posts,
    LoadNext
}