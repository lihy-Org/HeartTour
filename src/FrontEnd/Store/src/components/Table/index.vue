<template>
  <div class="content-wrap" :style="tableHeight">
    <div ref="table-wrap" class="table-wrap">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="tableData"
        :max-height="mHeight"
        fit
        border
        tooltip-effect="dark"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        :header-cell-style="getRowClass"
        :header-row-class-name="tableHeaderClassName"
        :cell-style="getCellClass"
        @selection-change="selectedChange"
      >
        <el-table-column v-if="hasSelect" type="selection" width="45px" align="left" :fixed="selectFixed" />
        <el-table-column v-if="hasIndex" label="序号" type="index" width="50px" align="left" :fixed="indexFixed" />
        <template v-for="(item, key) in columns">
          <template v-if="item.type !='tag'">
            <el-table-column
              v-if="!item.contentType"
              :key="key"
              :prop="item.prop"
              :label="item.label"
              :type="item.type"
              :width="item.width"
              :min-width="item.minWidth"
              :formatter="item.formatter"
              show-overflow-tooltip
              :fixed="item.fixed"
              :align="item.align"
            >
              <!-- 是否有可选择的下拉框 -->
              <template v-if="isSelect && item.canEdit" v-slot="{row}">
                <el-select
                  v-model="row[item.value]"
                  popper-class="role-option"
                  :placeholder="item.rotaName"
                  size="small"
                  :disabled="item.isDisabled"
                  :clearable="item.clearable"
                  @change="
                    typeof item.change === 'function' ? item.change($event) : () => {}
                  "
                >
                  <el-option
                    v-for="(ele, index) in typeof item.optionData === 'function'
                      ? item.optionData()
                      : item.optionData"
                    :key="index"
                    :label="ele.label"
                    :value="ele.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.contentType==='img'"
              :key="key"
              :prop="item.prop"
              :label="item.name"
              :type="item.type"
              :width="item.width"
              :formatter="item.formatter"
              :fixed="item.fixed"
            >
              <template v-slot="{row}">
                <img :src="row[item.prop]" width="85" height="96">
              </template>
            </el-table-column>

            <el-table-column
              v-else-if="item.contentType==='button'"
              :key="item.prop"
              v-bind="item"
              :label="item.label"
              :fixed="item.fixed"
            >
              <template #default="{row}">
                <el-button
                  v-for="(button, index) in item.buttons.filter(button =>
                    typeof button.hidden === 'function'
                      ? !button.hidden(row)
                      : !button.hidden
                  )"
                  :key="index"
                  :class="
                    typeof button.class === 'function'
                      ? button.class(row)
                      : button.class
                  "
                  :loading="button.loading"
                  :type="button.type"
                  :size="button.size"
                  :icon="button.icon"
                  :disabled="
                    typeof button.disabled === 'function'
                      ? button.disabled(row)
                      : button.disabled
                  "
                  @click="button.click(row)"
                >
                  {{
                    typeof button.label === 'function'
                      ? button.label(row)
                      : button.label
                  }}
                </el-button>
              </template>
            </el-table-column>
          </template>
          <el-table-column v-else :key="key">
            <template>
              <el-popover
                placement="top-start"
                :title="showTitle"
                width="100"
                trigger="click"
                :content="showInfo"
              >
                <el-button slot="reference">{{ item.name }}</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <el-pagination
      style="display: flex; justify-content: flex-end;background: white; align-items: center; height: 50px"
      :page-sizes="[20, 30, 40]"
      :page-size="20"
      :current-page="refreshCurrentPage || 1"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'TableCompontent',
  inheritAttrs: false,
  props: {
    tableHeight: {
      type: String,
      default: 'height: calc(100vh - 184px)'
    },
    hasSelect: {
      type: Boolean
    },
    hasIndex: {
      type: Boolean
    },
    selectFixed: {
      type: Boolean
    },
    indexFixed: {
      type: Boolean
    },
    refreshCurrentPage: {
      type: Number,
      default: 1
    },
    loading: {
      type: Boolean
    },
    tableData: {
      type: Array,
      required: true
    },
    isSelect: {
      type: Boolean
    },
    columns: {
      type: Array,
      required: true
    },
    selectedChange: {
      type: Function,
      /* eslint-disable-next-line */
      default: () => { },
    },
    pagination: {
      type: Object,
      default: null
    },
    total: {
      type: Number,
      default: 0
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    currentChange: {
      type: Function,
      /* eslint-disable-next-line */
      default: () => { },
    },
    sizeChange: {
      type: Function,
      /* eslint-disable-next-line */
      default: () => { },
    }
  },
  data() {
    return {
      mHeight: 0
    }
  },
  watch: {
    isSelect: {
      handler(n, o) {
        console.log('子组件中的isSelect值： ' + this.isSelect)
      },
      deep: true // 深度监听父组件传过来对象变化
    }
  },
  mounted() {
    const mHeight = this.$refs['table-wrap'].offsetHeight
    this.$nextTick(() => {
      this.$set(this, 'mHeight', mHeight)
    })
  },
  methods: {

    // 所有行设置一个固定的 className
    tableRowClassName({ row, rowIndex }) {
      return ''
    },

    // 所有表头行设置一个固定的 className
    tableHeaderClassName({ row, rowIndex }) {
      return ''
    },

    // 所有表头单元格设置一样的 Style
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'border-bottom:1px solid #DBDCE2;padding:7px 0px;background:#F0F3F6;font-size:14px;color:#737981;'
      }
      return 'padding:7px 0px;'
    },

    // 所有单元格设置一样的 Style
    getCellClass() {
      return 'padding:7px 0;'
    },

    // 清空用户的选择
    clearSelection() {
      this.$refs.table.clearSelection()
    },

    // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数（for循环中的函数的参数），则是设置这一行选中与否（selected 为 true 则选中）
    toggleRowSelection(rows, prop, selected) {
      const tableDataRows = []
      for (let i = 0; i < rows.length; i++) {
        const { tableData } = this
        for (let j = 0; j < tableData.length; j++) {
          if (rows[i][prop] === tableData[j][prop]) {
            tableDataRows.push(tableData[j])
            break
          }
        }
      }
      for (let k = 0; k < tableDataRows.length; k++) {
        this.$refs.table.toggleRowSelection(tableDataRows[k], selected)
      }
    },

    // 用于多选表格，切换所有行的选中状态
    toggleAllSelection() {
      this.$refs.table.toggleAllSelection()
    },

    // 用于可展开表格与树形表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）
    toggleRowExpansion(row, expanded) {
      this.$refs.table.toggleRowExpansion(row, expanded)
    },

    // 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
    setCurrentRow(row) {
      this.$refs.table.setCurrentRow(row)
    },

    // 用于清空排序条件，数据会恢复成未排序的状态
    clearSort() {
      this.$refs.table.clearSort()
    },

    // 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件
    clearFilter() {
      this.$refs.table.clearFilter()
    },

    // 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    doLayout() {
      this.$refs.table.doLayout()
    },

    // 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。
    sort(prop, order) {
      this.$refs.table.sort(prop, order)
    }
  }
}
</script>

<style lang="scss" scoped>
.content-wrap{
  .table-wrap {
    height: calc(100% - 60px) !important;
  }
}
::v-deep .el-table th > .cell {
  word-break: keep-all;
}
::v-deep .el-pagination {
  margin: 10px 10px 0 10px;
  text-align: right;
}
</style>
