<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-25 14:17:45
 * @LastEditTime: 2021-03-25 14:29:08
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: \Technician\src\views\AptList\AptList.vue
-->


<template>
  <div class="page bg-F9F9F9">
    <van-tabs
      v-model:active="active"
      color="#FFBD5C"
      title-active-color="#FFBD5C"
      title-inactive-color="#595959"
    >
      <van-tab title="当日预约量">
        <list-item :status="1" />
        <list-item :status="1" />
      </van-tab>
      <van-tab title="已服务量">
        <list-item :status="2" />
        <list-item :status="2" />
      </van-tab>
      <van-tab title="待服务量">
        <list-item :status="3" />
        <list-item :status="3" />
      </van-tab>
      <van-tab title="已取消改约量">
        <list-item :status="2" />
        <list-item :status="3" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ListItem from "../../components/ListItem/ListItem.vue";
export default defineComponent({
  setup() {
    // state
    const active = ref(0);

    return {
      active,
    };
  },
  components: {
    ListItem,
  },
});
</script>


<style lang="less" scoped>
</style>