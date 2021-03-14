<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-08 21:08:53
 * @LastEditTime: 2021-03-08 21:24:09
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /vue-mp-template/src/views/Index/components/Child.vue
-->


<template>
  <button type="button" @click="onIncrement">{{ buttonText }}</button>
  <p>You click the button {{count}} times.</p>
  <p>{{count}} * 2 = {{res}}</p>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  props: {
    buttonText: String,
  },
  setup() {
    // state
    const count = ref(0);
    const res = ref(0);
    // watch
    watch(count, (v: number, o: number) => {
      res.value = v * 2;
    });
    // methods
    const onIncrement = () => {
      count.value++
    }

    // data
    return {
      count,
      res,
      onIncrement
    }
  },
});
</script>


<style lang="less" scoped>
button {
  margin-top: 12px;
  font-size: 16px;
  color: cornflowerblue;
}
</style>
