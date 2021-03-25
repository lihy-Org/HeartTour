<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-17 17:31:27
 * @LastEditTime: 2021-03-25 22:28:55
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /Technician/src/views/AptDetails/AptDetails.vue
-->

<template>
  <div class="page">
    <!-- 预约卡片 -->
    <div class="apt-card">
      <div class="avatar"></div>
      <div class="infos">
        <div class="i-name">郑日龙</div>
        <div class="i-title">中级美容师</div>
        <div class="apt-time">预约时间 2021-01-23 15:50:00</div>
      </div>
    </div>
    <!-- 宠物信息 -->
    <div class="pet-data">
      <div
        class="avatar"
        :style="{
          background: `url('https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180109%2F77e825e4b80743ba89c006aeb9095808.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619274334&t=dcc1d7d240024371566db404cdd9730e') no-repeat center center`,
        }"
      ></div>
      <div class="pt-6">
        <div class="varieties">雪纳瑞</div>
        <div class="name">旺仔</div>
      </div>
    </div>
    <!-- 预约信息 -->
    <div class="info-wrap">
      <div class="title">预约信息</div>
      <div class="item-row">
        <div class="label">美容套餐</div>
        <div class="value">￥232.00</div>
      </div>
      <div class="item-row">
        <div class="label">抗菌洗护</div>
        <div class="value">￥232.00</div>
      </div>
      <div class="item-row">
        <div class="label">眼睛护理</div>
        <div class="value">￥232.00</div>
      </div>
      <div class="item-row">
        <div class="label">订单总金额</div>
        <div class="value">￥232.00</div>
      </div>
    </div>
    <!-- 宠物信息 -->
    <div class="info-wrap bt">
      <div class="title">宠物信息</div>
      <div class="item-row">
        <div class="label">宠物品种</div>
        <div class="value">雪纳瑞</div>
      </div>
      <div class="item-row">
        <div class="label">性别</div>
        <div class="value">弟弟</div>
      </div>
      <div class="item-row">
        <div class="label">昵称</div>
        <div class="value">旺仔</div>
      </div>
      <div class="item-row">
        <div class="label">肩高</div>
        <div class="value">42cm</div>
      </div>
    </div>
    <!-- 其他 -->
    <div class="info-wrap bt">
      <div class="title">订单信息</div>
      <div class="item-row">
        <div class="label">联系人</div>
        <div class="value">李连杰 189****9566</div>
      </div>
      <div class="item-row">
        <div class="label">备注信息</div>
        <div class="value">未填写备注信息</div>
      </div>
      <div class="item-row">
        <div class="label">订单编号</div>
        <div class="value">202103117893430</div>
      </div>
      <div class="item-row">
        <div class="label">提交时间</div>
        <div class="value">2021-03-11 12:30</div>
      </div>
      <div class="item-row">
        <div class="label">到店时间</div>
        <div class="value">2021-03-11 12:30</div>
      </div>
      <div class="item-row">
        <div class="label">完成时间</div>
        <div class="value">2021-03-11 12:30</div>
      </div>
      <div class="item-row">
        <div class="label">原预约时间</div>
        <div class="value">202103117893430</div>
      </div>
      <div class="item-row">
        <div class="label">原预约美容师</div>
        <div class="value">张靓颖</div>
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
// 预约卡片
.apt-card {
  width: ~"calc(100% - 8px)";
  margin: 0 auto;
  padding: 27px;
  height: 141px;
  background: url("https://img.meituan.net/csc/37dc3dc1b24895c339d1f780445d7f8622432.png");
  background-size: 100% 100%;
  color: #fff;
  display: flex;
  .avatar {
    width: 57px;
    height: 57px;
    border-radius: 50%;
    background-color: #eee;
    flex-shrink: 0;
    margin-right: 10px;
  }
  .infos {
    padding-top: 12px;
  }
  .i-name {
    font-size: 16px;
    font-weight: bold;
    line-height: 23px;
  }
  .i-title {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    margin-top: 4px;
    margin-bottom: 3px;
  }
  .apt-time {
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
  }
}
// 宠物信息
.pet-data {
  display: flex;
  padding: 20px;
  border-top: 5px solid #f9f9f9;
  border-bottom: 4px solid #f9f9f9;
  color: #333333;
  .avatar {
    width: 57px;
    height: 57px;
    border-radius: 50%;
    background-color: cornflowerblue;
    background-size: cover !important;
    margin-right: 7px;
  }
  .varieties {
    font-size: 16px;
    font-weight: bold;
    line-height: 23px;
    margin-bottom: 3px;
  }
  .name {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }
}

// 描述信息
.info-wrap {
  padding-bottom: 15px;
  &.bt {
    border-top: 5px solid #f9f9f9;
  }
}
.title {
  font-size: 16px;
  font-weight: bold;
  line-height: 23px;
  color: #333333;
  padding: 15px 10px 0;
  &::before {
    content: "";
    display: inline-block;
    width: 7px;
    height: 24px;
    background: #ffbd5c;
    margin-right: 10px;
    position: relative;
    top: 7px;
  }
}

.item-row {
  display: flex;
  padding: 15px 30px 0;
}
.label {
  width: 99px;
  margin-right: 38px;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 23px;
  color: #999999;
}
.value {
  flex: 1;
  font-size: 16px;
  line-height: 23px;
  color: #333333;
  font-weight: 500;
}
.bar {
  height: 100px;
}
</style>