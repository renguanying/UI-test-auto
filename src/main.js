import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
//引入element plus组件库，以及样式表
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//重置样式库
import 'normalize.css'
//应用公共样式
import '@/assets/styles/common.less'
//引入图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store).use(router).use(ElementPlus).mount('#app')
