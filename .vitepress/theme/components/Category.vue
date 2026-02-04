<template>
    <div v-for="(posts, key) in data">
        <div class="category">
            {{ key }}
        </div>
        <a :href="withBase(post.url)" v-for="(post, index) in posts" :key="index" class="posts">
            <div class="post-container">
                <div class="post-dot"></div>
                {{ post.title }}
            </div>
            <div class="date">{{ dayjs(post.date).format('YYYY-MM-DD') }}</div>
        </a>
    </div>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs'
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'
import { initCategory } from '../utils'
import { data as posts } from '../posts.data'

const { theme } = useData()
const data = computed(() => initCategory(posts))
</script>

<style scoped>
.category {
    padding: 14px 0 8px 0;
    font-size: 1.25rem;
    font-weight: 500;
    font-family: var(--date-font-family),serif;
}
</style>
