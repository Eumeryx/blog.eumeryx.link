<script lang="ts" setup>
import '@waline/client/waline.css'
import type { WalineProps } from '@waline/client'
//@ts-ignore
import { Waline } from '@waline/client/component'
import { ref, onMounted} from 'vue'

const walineConfig = defineProps<Omit<WalineProps, 'path'>>()

const mounted = ref(false)
onMounted(() => mounted.value = false)
</script>

<template>
    <Waline v-bind="walineConfig" v-if="mounted" />
</template>
