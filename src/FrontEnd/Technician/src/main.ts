/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-07 22:58:33
 * @LastEditTime: 2021-03-08 00:35:43
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /vue-mp-template/src/main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// pxtorem
import 'amfe-flexible/index.js'

createApp(App).use(store).use(router).mount('#app')
