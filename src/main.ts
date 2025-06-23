import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // ✅ 新增這行

const app = createApp(App)

app.use(router) // ✅ 新增這行
app.mount('#app')
