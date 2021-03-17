/*
 * @Author: Li-HONGYAO
 * @Date: 2021-03-07 22:58:33
 * @LastEditTime: 2021-03-17 09:14:37
 * @LastEditors: Li-HONGYAO
 * @Description:
 * @FilePath: \Technician\src\main.ts
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// pxtorem
import "amfe-flexible/index.js";
// vant mobile components
import "vant/lib/index.css";
import { DatetimePicker  } from "vant";

// App配置/挂载相关
// 1. 创建App
const app = createApp(App);
// 2. 注入
app.use(store).use(router);
app.use(DatetimePicker);
// 3. 配置全局属性 -- 访问：在setup函数中通过ctx访问 eg-ctx.$sayHi
app.config.globalProperties.$sayHi = () => {
  console.log("hi");
};
// 4. 挂载
app.mount("#app");
