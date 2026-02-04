import { createContentLoader } from 'vitepress'
import { htmlMinify } from '.vitepress/config'

interface Post {
    url: string
    date: number
    title: string
    category?: string
    tags?: string[]
    excerpt?: string
}

declare const data: Post[]
export { Post, data }

export default createContentLoader('posts/**/*.md', {
    excerpt: '<!--more-->',
    async transform(raw): Promise<Post[]> {
        const posts: Post[] = []
        for (const { url, excerpt, frontmatter } of raw) {
            posts.push({
                url,
                title: frontmatter.title,
                category: frontmatter.category,
                tags: frontmatter.tags,
                date: +new Date(frontmatter.date),
                excerpt: await htmlMinify(`<p>${frontmatter.excerpt ?? excerpt}</p>`)
            })
        }

        return posts.sort((a, b) => b.date - a.date)
    }
})
