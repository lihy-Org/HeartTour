<template>
  <el-form-item
    :prop="
      item.prop
        ? item.prop
        : item.slot
          ? item.slot
          : item.type
            ? item.value
            : ''
    "
    :label="item.label"
    :rules="item.rules"
    :class="item.class"
  >
    <!-- slot -->
    <slot v-if="item.slot" />
    <!-- 详情项 -->
    <span v-if="!item.type" v-html="form[item.value]" />
    <!-- 普通输入框 -->
    <el-input
      v-if="item.type === 'input' || item.type === 'password'"
      v-model.trim="form[item.value]"
      :show-password="item.type === 'password' ? true : false"
      v-bind="item"
      :readonly="item.readonly"
      :placeholder="item.placeholder"
      :style="item.style"
      @focus="typeof item.focus === 'function' ? item.focus($event) : () => {}"
    >
      <template v-if="item.prepend" #prepend>
        <i :class="item.prepend" />
      </template>
      <template #[item.innerSlotName]>
        <slot :name="item.subSlotName" />
      </template>
    </el-input>
    <!-- 文本输入框 -->
    <el-input
      v-if="item.type === 'textarea'"
      v-model.trim="form[item.value]"
      v-bind="item"
      :placeholder="item.placeholder"
      :style="item.style"
    />
    <!-- 计数器 -->
    <el-input-number
      v-if="item.type === 'inputNumber'"
      v-model="form[item.value]"
      v-bind="item"
      :placeholder="item.placeholder"
      :style="item.style"
    />
    <!-- 选择框 -->
    <el-select
      v-if="item.type === 'select'"
      v-model="form[item.value]"
      v-bind="item"
      :placeholder="item.placeholder"
      :style="item.style"
      :disabled="
        typeof item.disabled === 'function' ? item.disabled() : item.disabled
      "
      @change="
        typeof item.change === 'function' ? item.change($event) : () => {}
      "
    >
      <el-option
        v-for="childItem in typeof item.list === 'function'
          ? item.list()
          : item.list"
        :key="childItem.value"
        :label="childItem.label"
        :value="childItem.value"
      />
      <slot :name="item.subSlotName" />
    </el-select>
    <!-- 单选框 -->
    <el-radio-group
      v-if="item.type === 'radio'"
      v-model="form[item.value]"
      v-bind="item"
      :style="item.style"
      @change="
        typeof item.change === 'function' ? item.change($event) : () => {}
      "
    >
      <el-radio
        v-for="childItem in item.list"
        :key="childItem.value"
        :label="childItem.value"
        :disabled="childItem.disabled"
        :style="childItem.style"
        :border="childItem.border"
      >{{ childItem.label }}</el-radio>
    </el-radio-group>
    <!-- 日期选择框 -->
    <el-date-picker
      v-if="[ 'datetime', 'date', 'month', 'week', 'year' ].includes(item.type)"
      v-model="form[item.value]"
      :style="item.style"
      v-bind="item"
      :placeholder="item.placeholder"
      :value-format="item.valueFormat || 'timestamp'"
      :range-separator="item.separator"
      :start-placeholder="item.startPlaceholder"
      :end-placeholder="item.endPlaceholder"
      :picker-options="item.pickerOptions"
      @change="
        typeof item.change === 'function' ? item.change($event) : () => {}
      "
    />
    <el-date-picker
      v-if="[ 'daterange' ].includes(item.type)"
      v-model="form[item.value]"
      :style="item.style"
      v-bind="item"
      :placeholder="item.placeholder"
      :value-format="item.valueFormat || 'timestamp'"
      :range-separator="item.separator"
      :start-placeholder="item.startPlaceholder"
      :end-placeholder="item.endPlaceholder"
      :picker-options="item.pickerOptions"
      :default-time="item.defaultTime||['00:00:00', '23:59:59']"
      @change="
        typeof item.change === 'function' ? item.change($event) : () => {}
      "
    />
    <!-- 日期时间范围选择框 -->
    <el-date-picker
      v-if="item.type === 'datetimerange'"
      v-model="form[item.value]"
      :style="item.style"
      :range-separator="item.separator"
      :start-placeholder="item.startPlaceholder"
      :end-placeholder="item.endPlaceholder"
      v-bind="item"
      :picker-options="item.pickerOptions"
      :value-format="item.valueFormat || 'timestamp'"
      :default-time="item.defaultTime||['00:00:00', '23:59:59']"
    />
    <!-- 级联选择框 -->
    <el-cascader
      v-if="item.type === 'cascader'"
      v-model="form[item.value]"
      v-bind="item"
      :style="item.style"
    />
    <el-switch
      v-if="item.type === 'switch'"
      v-model="form[item.value]"
      v-bind="item"
      :style="item.style"
    />
    <!-- 文字链接 -->
    <el-link
      v-if="item.type === 'link'"
      type="primary"
      :underline="false"
      v-bind="item"
      :style="item.style"
      :href="form[item.value]"
    >{{ form[item.value] }}</el-link>
    <!-- 图片 -->
    <el-image
      v-if="item.type === 'image'"
      lazy
      v-bind="item"
      :src="form[item.value]"
      :preview-src-list="[form[item.value]]"
      :style="item.style"
    />
    <el-button-group v-if="item.type === 'buttonGroup'">
      <el-button
        v-for="button in item.buttons.filter(
          button =>
            button.notRender !== true ||
            (button.render && button.render(button))
        )"
        :key="button.value"
        v-bind="button"
        :type="
          (typeof button.type === 'function' && button.type()) || button.type
        "
        :size="button.size"
        :icon="button.icon"
        :disabled="button.disabled"
        :loading="button.loading"
        @click="button.click"
      >{{ button.label }}</el-button>
    </el-button-group>
  </el-form-item>
</template>

<script>
export default {
  name: 'FormItemCompontent',
  props: {
    form: {
      type: Object,
      default: () => { }
    },
    item: {
      type: Object,
      required: true
    }
  },
  created() {
    console.log(this.item)
    // 根据dataMap处理数据
    if (this.item.dataMap) {
      this.form[this.item.value] = this.item.dataMap[this.form[this.item.value]]
    }
    if (this.item.dataJoin) {
      this.form[this.item.value] = this.form[this.item.value] + this.item.dataJoin
    }
    if (!this.form[this.item.value] && !this.item.type) {
      this.form[this.item.value] = '-'
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-image {
  width: 100px;
  height: 100px;
}
::v-deep .el-input__inner {
  font-family: Microsoft YaHei;
  vertical-align: middle;
}
.el-form-item {
  margin-bottom: 0;
  margin-right: 16px;
  width: 100%;
}
::v-deep .el-form-item__label {
  font-weight: normal;
  padding: 0 8px 0 0;
}
::v-deep .el-form-item__content {
  vertical-align: middle;
}
</style>
