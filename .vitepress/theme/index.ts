import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import NewLayout from './components/NewLayout.vue'
import Archives from './components/Archives.vue'
import Category from './components/Category.vue'
import Games from './components/Games.vue'
import Tags from './components/Tags.vue'
import Home from './components/Home.vue'

import './custom.css'
import 'katex/dist/katex.css'

export default {
    ...DefaultTheme,
    Layout: NewLayout,
    enhanceApp({ app }) {
        // register global compoment
        app.component('Tags', Tags)
        app.component('Category', Category)
        app.component('Archives', Archives)
        app.component('Home', Home)
        app.component('Games', Games)
    }
} satisfies Theme
