<template>
  <div v-loading="loading" class="table">
    <el-table
      ref="table"
      v-bind="$attrs"
      :data="tableData"
      border
      height="auto"
      align="left"
      tooltip-effect="dark"
      :row-class-name="tableRowClassName"
      :header-row-class-name="tableHeaderClassName"
      :header-cell-style="getRowClass"
      :cell-style="getCellClass"
      @selection-change="selectedChange"
    >
      <template v-for="column in columns">
        <template
          v-if="
            !(typeof column.hidden === 'function'
              ? column.hidden()
              : column.hidden)
          "
        >
          <slot v-if="column.slot" :name="column.slot" />
          <el-table-column
            v-else-if="column.type"
            :key="column.type"
            v-bind="column"
            :width="column.width || '45'"
          />
          <el-table-column
            v-else-if="column.buttons"
            :key="column.value"
            v-bind="column"
            :label="column.label"
          >
            <template #default="{row}">
              <el-button
                v-for="button in column.buttons.filter(button =>
                  typeof button.hidden === 'function'
                    ? !button.hidden(row)
                    : !button.hidden
                )"
                :key="button.value"
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
          <el-table-column
            v-else-if="
              !(typeof column.hidden === 'function'
                ? column.hidden()
                : column.hidden)
            "
            :key="column.value"
            v-bind="column"
            :label="column.label"
            :formatter="column.formatter"
            :show-overflow-tooltip="showTip"
          />
        </template>
      </template>
    </el-table>
    <el-pagination
      v-if="pagination"
      :page-sizes="pageSizes"
      :page-size="pagination.pageSize"
      :page-count="pageCount"
      :current-page="pagination.page"
      :total="total"
      :layout="layout"
      @current-change="currentChange"
      @size-change="sizeChange"
    />
  </div>
</template>

<script>
export default {
  name: 'TableCompontent',
  inheritAttrs: false,
  props: {
    loading: {
      type: Boolean
    },
    tableData: {
      type: Array,
      required: true
    },
    selectedRow: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      required: true
    },
    showTip: {
      type: Boolean,
      /* eslint-disable-next-line */
      default: true,
    },
    selectedChange: {
      type: Function,
      /* eslint-disable-next-line */
      default: () => { },
    },
    singleSelect: {
      type: Boolean
    },
    pagination: {
      type: Object,
      default: null
    },
    pageCount: {
      type: Number,
      default: 5
    },
    pageSizes: {
      type: Array,
      default: () => [
        20,
        30,
        40
      ]
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
    return {}
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
        return 'border-bottom:1px solid #DBDCE2;padding:7px 5px;background:#F0F3F6;font-size:14px;color:#737981;'
      }
      return 'padding:7px 5px;'
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
.table {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
::v-deep .el-table th > .cell {
  word-break: keep-all;
}
::v-deep .el-pagination {
  margin: 10px;
  text-align: right;
}
</style>
