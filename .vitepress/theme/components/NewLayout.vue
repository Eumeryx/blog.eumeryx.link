<template>
    <Layout class="kkkkkkkkkkkkkkk">
        <template #doc-before>
            <h1 v-if="!frontmatter.page">{{ frontmatter.title }}</h1>
            <div style="padding-top:20px;" class='post-info' v-if="!frontmatter.page">
                {{ frontmatter.date?.substring(0,10) }} &nbsp;&nbsp; <span v-for="item in frontmatter.tags"><a :href="withBase(`/pages/tags.html?tag=${item}`)"> {{ item }}</a></span>
            </div>
        </template>
        <template #doc-after v-if="frontmatter.waline">
            <Waline serverURL="https://waline.eumeryx.link" />
        </template>
    </Layout>
    <Copyright />
</template>
<script setup lang="ts">
import { defineAsyncComponent, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import Copyright from './Copyright.vue'
import { withBase, useData } from "vitepress";
const { Layout } = DefaultTheme
const { frontmatter } = useData()
const Waline = defineAsyncComponent(() => import('./Waline.vue'))

onMounted(() => {
    
})
</script>
