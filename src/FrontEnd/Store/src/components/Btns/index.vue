<template>
  <div class="btns">
    <el-button
      v-for="(button, index) in buttons"
      :key="index"
      :type="button.type"
      :size="button.size"
      :icon="button.icon"
      :disabled="
        typeof button.disabled === 'function'
          ? button.disabled()
          : button.disabled
      "
      :loading="button.loading"
      @click="button.click"
    >{{ button.value }}</el-button>
  </div>
</template>

<script>
export default {
  name: 'BtnsCompontent',
  inheritAttrs: false,
  props: {
    buttons: {
      type: Array,
      required: true
    }
  },
  data() {
    return {}
  },
  created() { console.log(this.buttons) },
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
