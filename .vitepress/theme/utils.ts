import dayjs from 'dayjs'
import type { Post } from './posts.data'

export function initTags(posts: Post[]) {
    const data = {} as { [key: string]: Post[] }
    for (const post of posts) {
        post.tags?.forEach((tag) => {
            data[tag] ??= []
            data[tag].push(post)
        })
    }

    const sorted = Object.entries(data).sort(([a], [b]) => a > b ? 1 : -1)
    return Object.fromEntries(sorted)
}

export function initCategory(posts: Post[]) {
    const data = {} as { [key: string]: Post[] }
    for (const post of posts) {
        const category = post.category
        if (category) {
            data[category] ??= []
            data[category].push(post)
        }
    }
    return data
}

export function useYearSort(posts: Post[]) {
    const data: Post[][] = []
    let year: number | null = null

    for (const post of posts) {
        const y = dayjs(post.date).year()
        if (y !== year) {
            year = y
            data.push([post])
        } else {
            data.at(-1)?.push(post)
        }
    }

    return data
}
