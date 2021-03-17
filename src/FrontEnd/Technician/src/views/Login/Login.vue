<!--
 * @Author: Li-HONGYAO
 * @Date: 2021-03-09 17:36:15
 * @LastEditTime: 2021-03-17 17:17:16
 * @LastEditors: Li-HONGYAO
 * @Description: 
 * @FilePath: \Technician\src\views\Login\Login.vue
-->

<template>
  <div class="page">
    <div class="bg-bar"></div>
    <div class="content">
      <!-- 头部 -->
      <header class="text-center">
        <img
          class="logo icon-90x90"
          src="https://img.meituan.net/csc/c562847d474aac0d1894b32345e2e17f20607.png"
        />
        <h1 class="title">美容师管理平台</h1>
      </header>
      <!-- 表单 -->
      <div class="form mt-20">
        <section class="form-item">
          <input placeholder="请输入手机号" v-model="account.phone" />
        </section>
        <section class="form-item">
          <input placeholder="请输入验证码" v-model="account.code" />
          <section
            v-if="time == TIME_MAX"
            class="code-button"
            @click="onGetCode"
          >
            获取验证码
          </section>
          <section v-else class="code-button">{{ time }}秒后重新获取</section>
        </section>
        <section class="login-button" @click="onLogin">登录</section>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Tools from "lg-tools";
import Cookie from "lg-cookie";
import Api from "@/api";

export default defineComponent({
  setup(props: any, context: any) {
    // state
    const TIME_MAX = 10;
    const time = ref(TIME_MAX);
    const account = reactive({
      phone: "17398888669",
      code: "1234",
    });
    const router = useRouter();
    // events
    const onLogin = (event: MouseEvent) => {
      Api.auth.login<LovePets.BaseResponse<string>>(account).then((res) => {
        if (res && res.status === 200) {
          // 登录成功
          Cookie.set("LOVEPETS_TOKEN", res.data);
          router.replace('/index');
        }
      });
    };
    const onGetCode = () => {
      Tools.timeDown({
        timeStamp: TIME_MAX * 1000,
        format: "ss",
        pending: (v: any) => {
          time.value = v;
        },
        complete: () => {
          time.value = TIME_MAX;
        },
      });
    };
    return {
      account,
      time,
      TIME_MAX,
      onLogin,
      onGetCode,
    };
  },
});
</script>


<style lang="less" scoped>
.bg-bar {
  height: 250px;
  background-color: #1946bb;
}
.content {
  width: 367.5px;
  height: 457.5px;
  padding: 33.25px 41.25px 0;
  margin: -150px auto 0;
  background: url("https://img.meituan.net/csc/2ebcac11675a76d6bb8d8cc93896749211205.png")
    no-repeat top left;
  background-size: 100% 100%;
  position: relative;
  z-index: 1;
}
.title {
  margin-top: 13px;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: #1946bb;
}
.form-item {
  height: 50px;
  border-bottom: 1px solid #d4d0d0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  input {
    flex: 1;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    color: #999999;
  }
  .code-button {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 17px;
    color: #1946bb;
  }
}
.login-button {
  width: 287px;
  height: 50px;
  background: linear-gradient(to right, #638af1, #1946bb);
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 46px;

  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
}
</style>
