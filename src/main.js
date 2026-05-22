import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ui from '@nuxt/ui/vue-plugin'
import {createPinia} from "pinia";
import './utils/echo.js';

const app = createApp(App)

app.use(router)
app.use(ui)
app.use(createPinia())
app.mount('#app')
