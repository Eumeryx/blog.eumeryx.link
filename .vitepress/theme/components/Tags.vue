<template>
    <div class="tags">
        <span @click="toggleTag(String(key))" v-for="(_, key) in data" class="tag">
            {{ key }} <strong>{{ data[key].length }}</strong>
        </span>
    </div>
    <div class="tag-header">{{ selectTag }}</div>
    <a
        v-for="({url, title, date}, index) in selectTag ? data[selectTag] : []"
        :href="withBase(url)"
        :key="index"
        class="posts"
    >
        <div class="post-container">
            <div class="post-dot"></div>
            {{ title }}
        </div>
        <div class="date">{{ dayjs(date).format('YYYY-MM-DD') }}</div>
    </a>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import { initTags } from '../utils'
import { data as posts } from '../posts.data'

let selectTag = ref<string>()
const data = initTags(posts)

const toggleTag = (tag: string) => {
    selectTag.value = tag
}

onMounted(() => {
    const tag = new URLSearchParams(location.search).get('tag')
    tag && toggleTag(tag)
})
</script>

<style scoped>
.tags {
    margin-top: 14px;
    display: flex;
    flex-wrap: wrap;
}

.tag {
    display: inline-block;
    padding: 4px 16px;
    margin: 6px 8px;
    font-size: 0.875rem;
    line-height: 25px;
    background-color: var(--vp-c-bg-alt);
    transition: 0.4s;
    border-radius: 2px;
    color: var(--vp-c-text-1);
    cursor: pointer;
}

.tag strong {
    color: var(--vp-c-brand);
}

.tag-header {
    font-size: 1.5rem;
    font-weight: 500;
    margin: 1rem 0;
    text-align: left;
}

@media screen and (max-width: 768px) {
    .tag-header {
        font-size: 1.5rem;
    }

    .date {
        font-size: 0.75rem;
    }
}
</style>
