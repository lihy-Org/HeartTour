<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-07 23:13:57
 * @LastEditTime: 2021-03-08 20:09:18
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: /vue-mp-template/src/components/@lgs/TabBar/TabBar.vue
  
-->
<template>
  <div class="tab-bar">
    <template v-for="(item, index) in paths" :key="index">
      <router-link replace class="tab-bar-item" :to="item.path" >
        <img
          :src="item.path === $route.path ? item.selectedIconPath : item.iconPath"
          class="icon"
          alt="{{item.text}}"
        />
        <span class="text">{{ item.text }}</span>
      </router-link>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
export default defineComponent({
  setup() {
    // state
    const paths = reactive([
      {
        path: "/index",
        text: "首页",
        iconPath: require("./images/icon_index.png"),
        selectedIconPath: require("./images/icon_index_sel.png"),
      },
      {
        path: "/welfare",
        text: "日常福利",
        iconPath: require("./images/icon_welfare.png"),
        selectedIconPath: require("./images/icon_welfare_sel.png"),
      },
      {
        path: "/merchants",
        text: "附近商户",
        iconPath: require("./images/icon_merchants.png"),
        selectedIconPath: require("./images/icon_merchants_sel.png"),
      },
      {
        path: "/shopping",
        text: "购物赚豆",
        iconPath: require("./images/icon_shopping.png"),
        selectedIconPath: require("./images/icon_shopping_sel.png"),
      },
      {
        path: "/mine",
        text: "我的",
        iconPath: require("./images/icon_mine.png"),
        selectedIconPath: require("./images/icon_mine_sel.png"),
      },
    ]);

    return {
      paths,
    };
  },
});
</script>

<style lang="less" scoped>
.tab-bar {
		width: 100%;
		background-color: #ffffff;
		border-top: 1px solid #eeeeee;
		height: 50PX;
		display: flex;
	}

	.tab-bar-item {
		display: flex;
		flex-direction: column;
		flex: 1;
		justify-content: center;
		align-items: center;
		color: #B5B5B5;
		&.router-link-active {
			color: #FF7E26;
			text-decoration: none;
		}
	}
	.icon {
		width: 22px;
		height: 22px;
	}
	.text {
		margin-top: 1px;
		font-size: 10px;
		line-height: 14px;
	}
</style>
