<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-07 22:58:33
 * @LastEditTime: 2021-03-09 17:37:41
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Technician/src/App.vue
-->
<template>
  <!-- 微信环境 -->
  <template v-if="env">
    <router-view />
  </template>
  <!-- 浏览器环境 -->
  <template v-else>
    <NotWeixin />
  </template>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Validator from "lg-validator";
import TabBar from "@/components/@lgs/TabBar/TabBar.vue";
import NotWeixin from "@/components/@lgs/NotWeixin/NotWeixin.vue";
export default defineComponent({
  setup() {
    console.log(process.env.VUE_APP_HOST);
    // state
    const env = ref(Validator.weixin());

    // data
    return {
      env,
    };
  },
  components: {
    TabBar,
    NotWeixin,
  },
});
</script>


<style lang="less">
// 导入全局样式
@import "./global.less";
</style>
