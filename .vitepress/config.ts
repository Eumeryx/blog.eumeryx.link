import { defineConfig } from 'vitepress'
import { minify } from 'html-minifier-terser'
import { katex } from '@mdit/plugin-katex'
import 'katex/contrib/mhchem'

export const htmlMinify = (html: string) => minify(html, {
    //removeComments: true, // Vue 需要这两个注释：<!--[--> <!--]-->
    caseSensitive: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    collapseInlineTagWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
})

const themeConfig = {
    logo: '/favicon.ico',
    website: 'https://github.com/Eumeryx', //copyright link
    pageSize: 10, //每页的文章数量
    // 评论的仓库地址
    comment: {
        repo: 'airene/vitepress-blog-pure',
        themes: 'github-light',
        issueTerm: 'pathname'
    },
    nav: [
        { text: 'Home', link: '/' },
        { text: 'Archives', link: '/pages/archives' },
        { text: 'Category', link: '/pages/category' },
        { text: 'Tags', link: '/pages/tags' }
        //{ text: 'About', link: '/pages/about' }
        // { text: 'Airene', link: 'http://airene.net' }  -- External link test
    ],/*
    search: {
        provider: 'local'
    },*/
    //outline:[2,3],
    outline: {
        label: '文章摘要'
    }
    //socialLinks: [{ icon: 'github', link: 'https://github.com/Eumeryx' }]
}

export type ThemeConfig = typeof themeConfig

export default defineConfig({
    title: 'Eumeryx',
    base: '/',
    outDir: './dist',
    cacheDir: './node_modules/vitepress_cache',
    description: 'vitepress,blog,blog-theme',
    ignoreDeadLinks: true,
    themeConfig: themeConfig as any,
    srcExclude: ['README.md'], // exclude the README.md , needn't to compiler

    vite: {
        build: {
            minify: 'esbuild',
            cssCodeSplit: true,
            rollupOptions: {
                output: {
                    manualChunks: {
                        postsData: ['.vitepress/theme/posts.data.ts'],
                        theme: ['.vitepress/theme/index.ts']
                        // katex: ['katex/dist/katex.css']
                    }
                }
            }
        },
        server: { port: 5000 }
    },
    markdown: {
        config(md) {
            md.use(katex, { mhchem: true, output: 'html', throwOnError: false })
        }
    },
    transformHtml: htmlMinify
        
})
