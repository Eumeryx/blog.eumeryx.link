<template>
    <div v-for="yearList in data">
        <div class="year">
            {{ dayjs(yearList[0].date).year() }}
        </div>
        <a :href="withBase(post.url)" v-for="(post, index) in yearList" :key="index" class="posts">
            <div class="post-container">
                <div class="post-dot"></div>
                {{ post.title }}
            </div>
            <div class="date">{{ dayjs(post.date).format('MM-DD') }}</div>
        </a>
    </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { withBase } from 'vitepress'
import { computed } from 'vue'
import { useYearSort } from '../utils'
import { data as posts } from '../posts.data'

const data = computed(() => useYearSort(posts))
</script>

<style scoped>
.year {
    padding: 14px 0 8px 0;
    font-size: 1.25rem;
    font-weight: 500;
    font-family: var(--date-font-family), serif;
}
</style>
