<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-17 11:53:01
 * @LastEditTime: 2021-03-17 13:29:42
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: \Technician\src\views\Performance\Performance.vue
-->


<template>
  <div class="page p-10">
    <!-- 个人金额统计 -->
    <div class="item">
      <div class="title">个人金额统计</div>
      <div class="value">￥19754.00</div>
      <div class="rank" style="color: #1946bb">排名：6</div>
      <div class="date">2021.02.29</div>
    </div>
    <!-- 个人数量统计 -->
    <div class="item">
      <div class="title">个人数量统计</div>
      <div class="value">232</div>
      <div class="rank" style="color: #ff6600">排名：6</div>
      <div class="date">2021.02.29</div>
    </div>
    <!-- 个人提成统计 -->
    <div class="item">
      <div class="title">个人提成统计</div>
      <div class="value">￥19754.00</div>
      <div class="rank" style="color: #ff003b">排名：6</div>
      <div class="date">2021.02.29</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
});
</script>


<style lang="less" scoped>
.item {
  height: 129px;
  background-size: 100% 100% !important;
  margin-bottom: 15px;
  padding: 26px;
  padding-left: 15px;
  position: relative;
  &:nth-child(1) {
    background-image: url("https://img.meituan.net/csc/83a8fa43cedb0701d002c6ab4738267377549.png");
  }
  &:nth-child(2) {
    background-image: url("https://img.meituan.net/csc/8b134cd65578a9c13059decbbfb77af275968.png");
  }
  &:nth-child(3) {
    background-image: url("https://img.meituan.net/csc/de50ec8905fc053015d2c7cc8018d3e576205.png");
  }
}
.title {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #ffffff;
}
.value {
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  color: #ffffff;
  margin-top: 3px;
  margin-bottom: 7px;
}
.rank {
  width: 76px;
  height: 23px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background-color: #fff;
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
}

.date {
  font-size: 12px;
  font-weight: 300;
  line-height: 17px;
  color: #ffffff;
  position: absolute;
  right: 16px;
  bottom: 10px;
}
</style>