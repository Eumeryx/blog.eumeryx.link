<template>
    <div class="site-footer">
        © 2021-{{ new Date().getFullYear() }} <a target="_blank" :href="website">{{ webTitle }}</a>
        , Powered by <a target="_blank" href="//vitepress.vuejs.org/">VitePress</a>
    </div>
</template>
<script lang="ts" setup>
import { useData } from 'vitepress'

const { site, theme } = useData()
const website = theme.value.website
const webTitle = site.value.title
</script>

<style>
.site-footer {
    color: #888;
    text-align: center;
    font-size: 0.75rem;
    width: 100%;
    padding: 15px 0 0 0;
    overflow: auto;
}
</style>
