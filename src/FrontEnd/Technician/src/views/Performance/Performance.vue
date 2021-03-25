<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-17 11:53:01
 * @LastEditTime: 2021-03-25 15:01:42
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: \Technician\src\views\Performance\Performance.vue
-->


<template>
  <div class="page p-10">
    <div class="wrap">
      <div class="all">
        <div class="label">本月总业绩</div>
        <div class="value">￥19754.00</div>
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
      <div class="date">2021.03</div>
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
.wrap {
  padding: 23px 20px;
  height: 278px;
  background: url("https://img.meituan.net/csc/6a8bd9eb77c604bb43786d8bc04b8747138822.png");
  background-size: 100% 100%;
  color: #fff;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.date {
  position: absolute;
  top: 13px;
  left: 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}
.all {
  padding-top: 88px;
  font-weight: 500;
  text-align: center;
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
  font-weight: 500;
  text-align: right;
  &:not(:last-child) {
    margin-bottom: 18px;
  }
  .label {
    line-height: 20px;
    letter-spacing: 7px;
    margin-bottom: 8px;
  }
  .value {
    font-size: 16px;
    line-height: 23px;
  }
}
</style>