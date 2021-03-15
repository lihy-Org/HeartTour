<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-07 22:59:19
 * @LastEditTime: 2021-03-08 21:36:33
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /vue-mp-template/src/views/Index/Index.vue
-->
<template>
  <div class="tab-page index px-20 pt-8 ">
    <input placeholder="请输入18位身份证号" v-model="idCard" />
    <p class="birth">{{ getBirth }}</p>
    <Child buttonText="increment button" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import {
  useTitle
} from '@/hooks'
import Child from './components/Child.vue';
export default defineComponent({
  name: "index",
  setup() {
    // state
    const idCard = ref("");
    // hooks
    useTitle('首页');
    // computed
    const getBirth = computed(() => {
      if (idCard.value.length === 18) {
        const year = idCard.value.slice(6, 10);
        const month = idCard.value.slice(10, 12);
        const day = idCard.value.slice(12, 14);
        return `出生年月：${year}年${month}月${day}日`;
      } else {
        return "";
      }
    });
    // data
    return {
      idCard,
      getBirth,
    };
  },
  components: {
    Child
  },
});
</script>


<style lang="less" scoped>
input {
  width: 100%;
  height: 40px;
  font-size: 16px;
  padding: 0 8px;
}
.birth {
  line-height: 30px;
  text-align: center;
}
</style>
