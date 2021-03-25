<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-17 11:53:01
 * @LastEditTime: 2021-03-25 23:01:53
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Technician/src/views/Performance/Performance.vue
-->


<template>
  <div class="page p-10">
    <div class="wrap">
      <div>
        <!-- 拾取器唤醒按钮 -->
        <div class="picker-res" @click="pickerVisible = true">
          {{ dateStr }}
          <img
            class="icon-down"
            src="https://img.meituan.net/csc/0aaa3f21468c18e5199a0c362c77cad21001.png"
          />
        </div>
        <div class="all">
          <div class="label">本月总业绩</div>
          <div class="value">￥19754.00</div>
        </div>
      </div>
      <div class="infos">
        <div class="row-item">
          <div class="label">服务业绩</div>
          <div class="value">￥2338.00</div>
        </div>
        <div class="row-item">
          <div class="label">商品业绩</div>
          <div class="value">￥2338.00</div>
        </div>
        <div class="row-item">
          <div class="label">活体业绩</div>
          <div class="value">￥4354.00</div>
        </div>
      </div>
    </div>
    <!-- 拾取器 -->
    <div v-show="pickerVisible" class="picker-wrapper">
      <van-datetime-picker
        class="date-picker"
        v-model="curDate"
        type="year-month"
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="onPickerConfirm($event)"
        @cancel="pickerVisible = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  setup() {
    const curDate = ref(new Date());
    const pickerVisible = ref(false);
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
      pickerVisible.value = false;
      console.log($event);
    };
    // computed
    const dateStr = computed(() => {
      const year = curDate.value.getFullYear();
      const month = curDate.value.getMonth() + 1;
      return `${year}/${numformatter(month)}`;
    });
    return {
      curDate,
      pickerVisible,
      onPickerConfirm,
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(new Date()),
      dateStr,
      formatter,
    };
  },
});
</script>


<style lang="less" scoped>
.wrap {
  padding: 23px 20px;
  height: 239px;
  background: url("https://img.meituan.net/csc/7e95306794b965124bbc412bb9d6f82f139684.png");
  background-size: 100% 100%;
  color: #fff;
  display: flex;
  justify-content: space-between;
  position: relative;
}

.picker-res {
  display: inline-block;
  padding: 0 6px;
  background: #ffffff;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 500;
  line-height: 23px;
  color: #1946bb;
}
.icon-down {
  width: 7px;
  height: 5px;
  margin-left: 5px;
}
.all {
  padding-top: 50px;
  font-weight: 500;
  .label {
    font-size: 16px;
    line-height: 23px;
  }
  .value {
    font-size: 20px;
    line-height: 28px;
  }
}
.row-item {
  text-align: right;
  &:not(:last-child) {
    margin-bottom: 14px;
  }
  .label {
    font-size: 14px;
    font-weight: bold;
    line-height: 20px;
  }
  .value {
    font-size: 16px;
    font-weight: 500;
    line-height: 23px;
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