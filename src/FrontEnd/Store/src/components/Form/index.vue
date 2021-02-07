<template>
  <el-form ref="form" v-bind="$attrs" :model="form" :rules="formRules" :inline="inline" :label-width="labelWidth">
    <slot />
    <el-row>
      <el-col
        v-for="(item, index) in formItems"
        :key="index"
        style="width: auto"
      >
        <FormItem :form="form" :item="item">
          <template #[item.subSlotName]>
            <slot :name="item.topSlotName" />
          </template>
        </FormItem>
      </el-col>
    </el-row>
    <div v-if="buttons.length" :class="btnsAlign">
      <el-button
        v-for="(item, index) in buttons"
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
      >{{ button.label }}</el-button>
    </div>
  </el-form>
</template>

<script>
import FormItem from './FormItem'

export default {
  name: 'FormCompontent',
  components: {
    FormItem
  },
  inheritAttrs: false,
  props: {
    form: {
      type: Object,
      required: true
    },
    formRules: {
      type: Object,
      default: null
    },
    inline: {
      type: Boolean
    },
    labelWidth: {
      type: String,
      default: ''
    },
    formSpan: {
      type: Number,
      default: 24
    },
    formItems: {
      type: Array,
      required: true
    },
    buttons: {
      type: Array,
      default: () => []
    },
    btnsAlign: {
      type: String,
      default: 'btns-right'
    },
    defaultTime: {
      type: Array,
      default: () => [
        '00:00:00',
        '23:59:59'
      ]
    }
  },
  methods: {
    validate(valid) {
      return this.$refs.form.validate(valid)
    },
    resetFields() {
      return this.$refs.form.resetFields()
    },
    clearValidate(props) {
      return this.$refs.form.clearValidate(props)
    }
  }
}
</script>

<style lang="scss" scoped>
.btns-right {
  text-align: right;
}
.btns-center {
  text-align: center;
}
.btns-left {
  text-align: left;
}
</style>
