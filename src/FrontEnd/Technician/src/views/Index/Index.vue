<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-07 22:59:19
 * @LastEditTime: 2021-03-16 23:39:11
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Technician/src/views/Index/Index.vue
-->
<template>
  <div class="page">
    <!-- 顶部 -->
    <div class="top-bar position-relative">
      <img
        class="w-100"
        src="https://img.meituan.net/csc/0cece3f4892f3aec874e1fe3381c49b459588.png"
      />
      <div class="w-100 h-100 absolute-tr wrapper">
        <!-- 左侧数据 -->
        <section class="d-flex">
          <div class="avatar"></div>
          <div>
            <div class="d-flex align-items-center">
              <div class="name">李鸿耀</div>
              <div class="title">爱猫达人</div>
            </div>
            <div class="post">高级美容师</div>
          </div>
        </section>
        <!-- 右侧数据 -->
        <section class="text-right">
          <div class="ranks">当月排名：1</div>
          <img
            class="performan"
            src="https://img.meituan.net/csc/1c46c7f9b58d8388679429b2db1233222814.png"
          />
        </section>
      </div>
    </div>
    <!-- 内容 -->
    <div class="statistics">
      <div class="picker-res" @click="aDatePickerVisible = true">
        {{ aSelDateStr || "请选择" }}
        <img
          class="icon-down"
          src="https://img.meituan.net/csc/3f819a1472f3360208aab38098e4f3a0790.png"
        />
      </div>
      <p />
      <div class="picker-res" @click="bDatePickerVisible = true">
        {{ bSelDateStr || "请选择" }}
        <img
          class="icon-down"
          src="https://img.meituan.net/csc/3f819a1472f3360208aab38098e4f3a0790.png"
        />
      </div>
    </div>
    <!-- 拾取器 -->
    <div
      v-show="aDatePickerVisible || bDatePickerVisible"
      class="picker-wrapper"
    >
      <van-picker
        v-show="aDatePickerVisible"
        class="date-picker"
        :columns="aColumns"
        @confirm="onDatePickerConfirm($event, 1)"
        @cancel="aDatePickerVisible = false"
      />
      <van-picker
        v-show="bDatePickerVisible"
        class="date-picker"
        :columns="bColumns"
        @confirm="onDatePickerConfirm"
        @cancel="bDatePickerVisible = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Tools from "lg-tools";
import Child from "./components/Child.vue";
export default defineComponent({
  name: "index",
  setup() {
    // constants
    const years: Array<string> = Tools.getYears();
    const months: Array<string> = Tools.getMonths();
    const days: Array<string> = Tools.getDays();
    const aColumns = [
      { values: years, defaultIndex: 0 },
      { values: months, defaultIndex: 0 },
    ];
    const bColumns = [
      { values: years, defaultIndex: 0 },
      { values: months, defaultIndex: 0 },
      { values: days, defaultIndex: 0 },
    ];
    // state
    const aSelDate = ref<string[]>([]);
    const aDatePickerVisible = ref(false);
    const bSelDate = ref<string[]>([]);
    const bDatePickerVisible = ref(false);

    // hooks
    // methods
    // events
    const onDatePickerConfirm = (values: string[], flag: number) => {
      if (flag === 1) {
        aSelDate.value = values;
        aDatePickerVisible.value = false;
      } else {
        bSelDate.value = values;
        bDatePickerVisible.value = false;
      }
    };
    // computed
    const aSelDateStr = computed(() => {
      const s = aSelDate.value.join("").replace(/[\u4e00-\u9fa5]/g, "/");
      return s.slice(0, s.length - 1);
    });
    const bSelDateStr = computed(() => {
      const s = bSelDate.value.join("").replace(/[\u4e00-\u9fa5]/g, "/");
      return s.slice(0, s.length - 1);
    });
    // data
    return {
      aColumns,
      bColumns,
      aDatePickerVisible,
      bDatePickerVisible,
      aSelDateStr,
      bSelDateStr,
      onDatePickerConfirm,
    };
  },
  components: {
    Child,
  },
});
</script>


<style lang="less" scoped>
.top-bar {
  color: #fff;
  .wrapper {
    padding: 40px 22px 0;
    display: flex;
    justify-content: space-between;
  }
  .avatar {
    flex-shrink: 0;
    width: 63px;
    height: 63px;
    border-radius: 50%;
    background-color: #fff;
    background-size: cover !important;
    margin-right: 10px;
  }
  .name {
    font-size: 18px;
    font-weight: bold;
    line-height: 25px;
    margin-right: 10px;
  }
  .title {
    height: 18px;
    background-color: #fff;
    color: #1946bb;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    font-size: 10px;
    padding: 0 6px;
  }
  .post {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    margin-top: 5px;
  }
  .ranks {
    font-size: 18px;
    font-weight: 500;
    line-height: 25px;
  }
  .performan {
    width: 81px;
    height: 21px;
    margin-top: 9px;
  }
  .icon-arrow {
    width: 5px;
    height: 10px;
    margin-left: 6px;
  }
}
// 统计数据
.statistics {
  width: 370px;
  height: 241px;
  background: url("https://img.meituan.net/csc/7813480ab61aadfbc8400ce42541954a14132.png");
  background-size: 100% 100%;
  margin: -110px auto 0;
  position: relative;
  padding: 17px 22.5px;
  z-index: 1;
  .picker-res {
    display: inline-block;
    padding: 0 6px;
    background: #1946bb;
    border-radius: 3px;
    font-size: 16px;
    font-weight: 500;
    line-height: 23px;
    color: #ffffff;
  }
  .icon-down {
    width: 7px;
    height: 5px;
    margin-left: 5px;
  }
}

.picker-wrapper {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  .date-picker {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
}
</style>
