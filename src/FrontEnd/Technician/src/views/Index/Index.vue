<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-07 22:59:19
 * @LastEditTime: 2021-03-16 17:05:17
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: \Technician\src\views\Index\Index.vue
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
        <section class="d-flex ">
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
          <img class="performan" src="https://img.meituan.net/csc/1c46c7f9b58d8388679429b2db1233222814.png" />
        </section>
      </div>
    </div>
    <!-- 内容 -->
    <div class="statistics">
      
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Child from "./components/Child.vue";
export default defineComponent({
  name: "index",
  setup() {
    // state
    const idCard = ref("");
    // hooks
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
</style>
