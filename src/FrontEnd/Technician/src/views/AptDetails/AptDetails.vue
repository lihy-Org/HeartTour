<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-17 17:31:27
 * @LastEditTime: 2021-03-18 10:13:32
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: \Technician\src\views\AptDetails\AptDetails.vue
-->

<template>
  <div class="page">
    <!-- 轮播图 -->
    <van-swipe class="swipe" :autoplay="4000" indicator-color="white">
      <van-swipe-item v-for="(imgUrl, index) in banners" :key="index">
        <img :src="imgUrl" alt="" class="w-100" />
      </van-swipe-item>
    </van-swipe>
    <!-- 套餐信息 -->
    <div class="info-wrap combo">
      <div class="title">套餐：西湖套餐A1</div>
      <div class="item-row">
        <section class="label">订单状态</section>
        <section class="value">已完成</section>
      </div>
      <div class="item-row">
        <section class="label">订单编号</section>
        <section class="value">284738434374332</section>
      </div>
      <div class="item-row">
        <section class="label">订单备注</section>
        <section class="value">修毛、剪短、留1厘米</section>
      </div>
      <div class="item-row">
        <section class="label">店长备注</section>
        <section class="value">预检有皮肤病，需药浴</section>
      </div>
      <div class="item-row">
        <section class="label">技师备注</section>
        <section class="value">
          已经药浴，可卖皮肤保健品；福莱希纤绳1根，冠能粮1袋；
        </section>
      </div>
    </div>
    <!-- 宠物信息 -->
    <div class="info-wrap">
      <div class="title">宠物信息</div>
      <div class="item-row">
        <div class="label">名称</div>
        <div class="value">旺仔</div>
      </div>
      <div class="item-row">
        <div class="label">品种</div>
        <div class="value">雪拉瑞</div>
      </div>
      <div class="item-row">
        <div class="label">年龄</div>
        <div class="value">1岁半</div>
      </div>
      <div class="item-row">
        <div class="label">性别</div>
        <div class="value">GG</div>
      </div>
      <div class="item-row">
        <div class="label">生日</div>
        <div class="value">2020.04.03</div>
      </div>
      <div class="item-row">
        <div class="label">毛色</div>
        <div class="value">黑色</div>
      </div>
      <div class="item-row">
        <div class="label">疫苗</div>
        <div class="value">已打疫苗</div>
      </div>
      <div class="item-row">
        <div class="label">是否绝育</div>
        <div class="value">已绝育</div>
      </div>
    </div>
    <!-- 主人信息 -->
    <div class="info-wrap">
      <div class="title">主人信息</div>
      <div class="item-row">
        <div class="label">姓名</div>
        <div class="value">李鸿耀</div>
      </div>
      <div class="item-row">
        <div class="label">手机号</div>
        <div class="value">1739****669</div>
      </div>
    </div>
    <!-- 其他 -->
    <div class="info-wrap other">
      <div class="title">其他</div>
      <div class="item-row">
        <div class="label">上次消费日期</div>
        <div class="value">2020-01-29 12:23:23</div>
      </div>
      <div class="item-row">
        <div class="label">上次消费内容</div>
        <div class="value">洗护套餐A1</div>
      </div>
      <div class="item-row">
        <div class="label">上次消费金额</div>
        <div class="value">￥247</div>
      </div>
    </div>
    <!-- bar -->
    <div class="bar"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    // constants
    const banners = new Array(3).fill(
      "https://img.meituan.net/csc/78d151cbe9a08759fc67ee84d1024a2b765754.png"
    );
    return {
      banners,
    };
  },
});
</script>

<style lang="less" scoped>
.title {
  font-size: 16px;
  font-weight: bold;
  line-height: 23px;
  color: #333333;
  padding: 15px 10px;
  &::before {
    content: "";
    display: inline-block;
    width: 7px;
    height: 24px;
    background: #1946bb;
    margin-right: 10px;
    position: relative;
    top: 7px;
  }
}
.combo .title {
  border-bottom: 1px solid #e3e3e3;
}
.combo .title::before {
  display: none;
}
.combo .item-row {
  padding: 15px 10px 0;
}
.item-row {
  display: flex;
  padding: 15px 26px 0;
}
.label {
  width: 66px;
  margin-right: 21px;
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 500;
  line-height: 23px;
  color: #999999;
}
.value {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  line-height: 23px;
  color: #333333;
}
.other .label {
  width: 99px;
  margin-right: 38px;
}
.bar {
  height: 100px;
}
</style>