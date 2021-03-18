<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-07 22:59:19
 * @LastEditTime: 2021-03-18 09:42:58
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: \Technician\src\views\Index\Index.vue
-->
<template>
  <div class="page bg-F9F9F9">
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
            @click="$router.push('/performance')"
          />
        </section>
      </div>
    </div>
    <!-- 统计数据 -->
    <div class="statistics">
      <!-- 月目标 -->
      <div class="wrapper">
        <!-- 拾取器唤醒按钮 -->
        <div class="picker-res" @click="pickerForTarVisible = true">
          {{ dateStrForTar }}
          <img
            class="icon-down"
            src="https://img.meituan.net/csc/3f819a1472f3360208aab38098e4f3a0790.png"
          />
        </div>
        <!-- 模块 -->
        <div class="sta-list tar">
          <div class="item">
            <div class="label">当月目标</div>
            <div class="value">13232</div>
          </div>
          <div class="item">
            <div class="label">已完成</div>
            <div class="value">13232</div>
          </div>
          <div class="item">
            <div class="label">差额</div>
            <div class="value">32132</div>
          </div>
          <div class="item">
            <div class="label">需每日完成</div>
            <div class="value">321321</div>
          </div>
        </div>
      </div>
      <!-- 当日预约量 -->
      <div>
        <!-- 拾取器唤醒按钮 -->
        <div class="picker-res" @click="pickerForAptVisible = true">
          {{ dateStrForApt }}
          <img
            class="icon-down"
            src="https://img.meituan.net/csc/3f819a1472f3360208aab38098e4f3a0790.png"
          />
        </div>
        <!-- 模块 -->
        <div class="sta-list">
          <div class="item">
            <div class="label">当日预约</div>
            <div class="value">10</div>
          </div>
          <div class="item">
            <div class="label">已服务</div>
            <div class="value">3</div>
          </div>
          <div class="item">
            <div class="label">待服务</div>
            <div class="value" style="color: #ffbd5c">8</div>
          </div>
          <div class="item">
            <div class="label">已取消/改约</div>
            <div class="value" style="color: #ffbd5c">6</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 列表数据 -->
    <view class="list">
      <list-item :status="1" @tap="onAptItemTap" @startService="onStartService" @complete="onComplete" />
      <list-item :status="2" />
      <list-item :status="3" />
      <div class="no-more">没有更多啦~</div>
    </view>
    <!-- 拾取器 -->
    <div
      v-show="pickerForTarVisible || pickerForAptVisible"
      class="picker-wrapper"
    >
      <van-datetime-picker
        class="date-picker"
        v-show="pickerForTarVisible"
        v-model="curDateForTar"
        type="year-month"
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="onPickerConfirm($event, 'tar')"
        @cancel="pickerForTarVisible = false"
      />
      <van-datetime-picker
        class="date-picker"
        v-show="pickerForAptVisible"
        v-model="curDateForApt"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="onPickerConfirm($event, 'tar')"
        @cancel="pickerForAptVisible = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { computed, defineComponent, reactive, ref } from "vue";
import ListItem from "../../components/ListItem/ListItem.vue";
export default defineComponent({
  name: "index",
  setup() {
    // state
    const curDateForTar = ref(new Date());
    const curDateForApt = ref(new Date());
    const pickerForTarVisible = ref(false);
    const pickerForAptVisible = ref(false);

    // hooks
    const router = useRouter();
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
    const onPickerConfirm = ($event: Date, flag: string) => {
      if (flag === "tar") {
        curDateForTar.value = $event;
      } else {
        curDateForApt.value = $event;
      }
    };
    const onAptItemTap = () => {
      console.log('onAptItemTap');
      router.push('/apt-details')
    }
    const onStartService = () => {
      console.log('onStartService')
    }
    const onComplete = () => {
      console.log('onComplete')
    }
    // computed
    const dateStrForTar = computed(() => {
      const year = curDateForTar.value.getFullYear();
      const month = curDateForTar.value.getMonth() + 1;
      return `${year}/${numformatter(month)}`;
    });
    const dateStrForApt = computed(() => {
      const year = curDateForApt.value.getFullYear();
      const month = curDateForApt.value.getMonth() + 1;
      const day = curDateForApt.value.getDay();
      return `${year}/${numformatter(month)}/${numformatter(day)}`;
    });
    // data
    return {
      curDateForTar,
      curDateForApt,
      pickerForTarVisible,
      pickerForAptVisible,
      dateStrForTar,
      dateStrForApt,
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(new Date()),
      formatter,
      onPickerConfirm,
      onAptItemTap,
      onStartService,
      onComplete,
    };
  },
  components: {
    ListItem,
  },
});
</script>


<style lang="less" scoped>
// 顶栏
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
  .wrapper {
    padding-bottom: 14px;
    margin-bottom: 14px;
    border-bottom: 1px solid #ebebeb;
  }
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

  // 列表数据
  .sta-list {
    margin-top: 16px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    &.tar .value {
      font-weight: normal;
      font-size: 14px;
    }
    &.tar .value::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 11px;
      background-image: url("https://img.meituan.net/csc/b36d024c3f198a0532d8c84300b923353219.png");
      background-size: 100% 100%;
      margin-right: 2px;
    }
  }
  .title {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #333333;
    margin-bottom: 5px;
  }
  .value {
    font-size: 18px;
    font-weight: bold;
    line-height: 25px;
    color: #1946bb;
  }
}

// 没有更多提示
.no-more {
  line-height: 80px;
  text-align: center;
  font-size: 12px;
  color: #868686;
  letter-spacing: 2px;
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
