<template>
    <div v-for="{ url, title, date, tags, excerpt } in postsCurrent" :key="date" class="post-list">
        <div class="post-header">
            <div class="post-title">
                <a :href="url"> {{ title }}</a>
            </div>
        </div>
        <div class="post-info">
            {{ dayjs(date).format('YYYY-MM-DD') }}
            <span v-for="item in tags"
                ><a :href="withBase(`/pages/tags.html?tag=${item}`)"> {{ item }}</a></span
            >
        </div>
        <p class="describe" v-html="excerpt"></p>
    </div>

    <div class="pagination">
        <a v-for="i in pageTotal" class="link" :class="{ active: pageCurrent === i }" :key="i" @click="switchPage(i)">{{
            i
        }}</a>
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { ref, onMounted } from 'vue'
import { withBase, useData } from 'vitepress'

import type { ThemeConfig } from '../../config'
import { Post, data as posts } from '../posts.data'

const { pageSize }: ThemeConfig = useData().theme.value

const pageCurrent = ref(1)
const pageTotal = Math.ceil(posts.length / pageSize)
const postsCurrent = ref<Post[]>([])

const switchPage = (i: number) => {
    pageCurrent.value = i
    postsCurrent.value = posts.slice((i - 1) * pageSize, i * pageSize)
}

onMounted(async () => {
    switchPage(1)
})
</script>

<style scoped>
.post-list {
    border-bottom: 1px solid var(--vp-c-divider-light);
    padding: 1rem 0;
}
.post-list :last-child {
    border-bottom: unset;
}
.post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.post-title {
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0.1rem 0;
}

.post-info {
    margin: 10px 0 0;
}

.describe {
    font-size: 0.9375rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
    margin: 0;
    color: var(--vp-c-text-2);
    line-height: 1.5rem;
}

.describe :v-deep(p) {
    margin: 0;
}

.pagination {
    margin-top: 16px;
    display: flex;
    justify-content: center;
}
.link {
    display: inline-block;
    width: 24px;
    text-align: center;
    border: 1px var(--vp-c-divider-light) solid;
    border-right: none;
    font-weight: 400;
    user-select: none;
}
.link.active {
    background: var(--vp-c-text-1);
    color: var(--vp-c-neutral-inverse);
    border: 1px solid var(--vp-c-text-1) !important;
}
.link:first-child {
    border-bottom-left-radius: 2px;
    border-top-left-radius: 2px;
}
.link:last-child {
    border-bottom-right-radius: 2px;
    border-top-right-radius: 2px;
    border-right: 1px var(--vp-c-divider-light) solid;
}

@media screen and (max-width: 768px) {
    .post-list {
        padding: 14px 0 14px 0;
    }
    .post-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .post-title {
        font-size: 1.0625rem;
        font-weight: 400;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .post-info {
        margin: 0.5rem 0;
    }
    .describe {
        font-size: 0.9375rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        margin: 0;
    }
}
</style>
