<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-25 22:55:35
 * @LastEditTime: 2021-03-25 23:08:36
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Technician/src/components/@lgs/DatePicker/DatePicker.vue
-->
<template>
  <div class="picker-res" @click="visible = true">
    {{ dateStr }}
    <img
      class="icon"
      src="https://img.meituan.net/csc/0aaa3f21468c18e5199a0c362c77cad21001.png"
    />
  </div>
  <!-- 拾取器 -->
  <div v-show="visible" class="picker-wrapper">
    <van-datetime-picker
      class="date-picker"
      v-model="curDate"
      type="year-month"
      title="选择年月"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
      @confirm="onPickerConfirm($event)"
      @cancel="visible = false"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    minDate: {
      type: Date,
      default: new Date(1970, 0, 1),
    },
    maxDate: {
      type: Date,
      default: new Date(new Date()),
    },
  },
  setup() {
    // state
    const curDate = ref(new Date());
    const visible = ref(false);
    // methods
    const formatter = (type: string, val: string) => {
      if (type === "year") {
        return `${val}年`;
      }
      if (type === "month") {
        return `${val}月`;
      }
      if (type === "day") {
        return `${val}日`;
      }
      return val;
    };
    const numformatter = (val: number) => (val < 10 ? `0${val}` : val);
    // events
    const onPickerConfirm = ($event: Date) => {
      curDate.value = $event;
      visible.value = false;
      console.log($event);
    };
    // computed
    const dateStr = computed(() => {
      const year = curDate.value.getFullYear();
      const month = curDate.value.getMonth() + 1;
      return `${year}/${numformatter(month)}`;
    });
    // responsive data
    return {
      visible,
      formatter,
      curDate,
      dateStr,
      onPickerConfirm,
    };
  },
});
</script>


<style lang="less" scoped>
.picker-res {
  display: flex;
  align-items: center;
  padding: 0 6px;
  background: #ffffff;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 500;
  line-height: 23px;
  color: #1946bb;
  .icon {
    width: 7px;
    height: 5px;
    margin-left: 5px;
  }
}

// 拾取器
.picker-wrapper {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  .date-picker {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
</style>