<!-- 人员管理-排班 -->
<template>
  <div class="staffShift-container">
    <!-- 搜索区域 -->
    <div class="search-wrap">
      <Form class="search-form" :inline="true" :form="searchForm" :form-items="searchFormItems" />
      <Btns class="search-btn" :buttons="operationBtns" />
    </div>

    <!-- 表格区域 -->
    <Table
      :loading="tableLoading"
      :table-data="tableData"
      :table-height="tableHeight"
      :has-select="false"
      :has-index="true"
      :select-fixed="false"
      :index-fixed="true"
      :columns="columns"
      :pagination="pagination"
      :total="total"
      :current-change="currentChange"
      :size-change="sizeChange"
      :is-select="isSelect"
    />
  </div>
</template>

<script>
import Form from '@/components/Form/index'
import Btns from '@/components/Btns/index'
import Table from '@/components/Table/index'
import { getStatsWorktime, getUsersList } from '@/api/personManage'
import moment from 'moment'
import 'moment/locale/zh-cn'

// 日期选择的快捷选项
const pickerOptions = {
  shortcuts: [{
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toLocaleDateString())
      const start = new Date(new Date().toLocaleDateString())
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      end.setTime(end.getTime() - 1000)
      picker.$emit('pick', [start, end])
      console.log(start, end)
    }
  }, {
    text: '最近30天',
    onClick(picker) {
      const end = new Date(new Date().toLocaleDateString())
      const start = new Date(new Date().toLocaleDateString())
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      end.setTime(end.getTime() - 1000)
      picker.$emit('pick', [start, end])
    }
  }]
}

export default {
  name: 'StaffShift',
  components: {
    Form,
    Btns,
    Table
  },
  data() {
    return {
      /**
       * 顶部搜索区域form
       * @param searchForm 搜索内容字段
       * @param searchFormItems 搜索内容组
       */
      searchForm: {
        workDay: [],
        userId: ''
      },
      searchFormItems: [
        {
          type: 'daterange',
          size: 'mini',
          label: '时间 :',
          style: 'width: 360px',
          separator: '至',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          value: 'workDay',
          pickerOptions: pickerOptions,
          change: val => this.changeDate(val)
        },
        {
          type: 'select',
          size: 'mini',
          placeholder: '请选择人员',
          label: '人员 :',
          value: 'userId',
          clearable: true,
          list: () => this.usersList,
          change: () => this.currentChange(1),
          filterable: true,
          style: 'width: 120px'
        }
      ],

      usersList: [],

      // 是否table展示下拉框
      isSelect: false,

      // 是否首次进入该页面，控制查询按钮的触发
      isFirstIn: true,

      /**
       * 顶部按钮组
       * @param operationBtns 按钮组
       */
      operationBtns: [
        {
          type: 'success',
          size: 'small',
          value: '查询',
          click: () => this.seachList(),
          icon: 'el-icon-search'
        },
        {
          type: 'success',
          size: 'small',
          value: '编辑人员班表',
          click: () => this.setRota(),
          icon: 'el-icon-search'
        }
      ],

      /**
       * table属性
       * @param tableLoading 动画
       * @param tableData 列表数据
       * @param columns 列表展示项
       * @param pagination 分页
       * @param total 数据总量
       * @param tableHeight 表格高度
       */
      tableHeight: 'height: calc(100vh - 184px)',
      tableLoading: false,
      tableData: [],
      columns: [
        {
          label: '姓名',
          prop: 'uname',
          fixed: true
        },
        {
          label: '职位',
          prop: 'position'
        }
      ],
      pagination: {
        page: 1,
        pageSize: 20
      },
      total: 0
    }
  },
  computed: {},
  created() {
    console.log('排班')
    this.setTimeFn()
    this.getUsersList()
  },
  methods: {
    /**
     * 默认展示一周班表，从今日起
     * 从当日0点起，至结束日期23.59.59
     */
    setTimeFn() {
      this.searchForm.workDay[0] = new Date(new Date().toLocaleDateString()).getTime()
      this.searchForm.workDay[1] = new Date(new Date().toLocaleDateString()).getTime() + 7 * 24 * 60 * 60 * 1000 - 1000
      console.log(this.searchForm.workDay)
      this.changeDate(this.searchForm.workDay)
    },

    // 获取人员列表
    getUsersList() {
      const data = {}
      getUsersList(data).then(res => {
        console.log(res.data)
        this.usersList = res.data.map(item => ({
          value: item.id,
          label: item.name
        }))
        console.log(this.usersList)
      })
    },

    // 时间修改触发
    changeDate(val) {
      this.getRota(val)
    },
    // 获取班表
    getRota(val) {
      if (!val) { return }
      const timeDifference = (val[1] + 1000 - val[0]) / (24 * 60 * 60 * 1000)
      console.log(val)
      console.log(timeDifference)
      if (timeDifference > 31) {
        this.$message.error('最多只能查询一个月数据')
      } else {
        if (this.isFirstIn) {
          this.tableLoading = true
          const data = {
            startDate: moment(this.searchForm.workDay[0]).format('YYYY-MM-DD'),
            endDate: moment(this.searchForm.workDay[1]).format('YYYY-MM-DD')
          }
          if (this.searchForm.userId) {
            data.userId = this.searchForm.userId
          }
          getStatsWorktime(data).then(res => {
            // 每次切换时间，数据重置
            this.columns = this.$options.data().columns

            this.tableLoading = false
            this.tableData = res.data

            const dateArr = []
            for (let i = 0; i < timeDifference; i++) {
              const dateStamp = moment(val[0] + i * 1000 * 60 * 60 * 24)
              const obj = {
                label: `${dateStamp.format('MM-DD')} / ${this.getWeek(dateStamp.day())}`,
                prop: 'staffShift',
                canEdit: true
              }
              dateArr.push(obj)
            }
            console.log(dateArr)
            this.columns.splice(2, 0, ...dateArr)
            this.isFirstIn = false
          }).catch(err => {
            console.log(err)
            this.isFirstIn = false
            this.tableLoading = false
          })
        }
      }
    },

    // 编辑人员班表
    setRota() {
      this.isSelect = true
    },

    // 时间戳转汉字的星期
    getWeek(week) {
      switch (week) {
        case 1:
          return '周一'
        case 2:
          return '周二'
        case 3:
          return '周三'
        case 4:
          return '周四'
        case 5:
          return '周五'
        case 6:
          return '周六'
        case 0:
          return '周日'
      }
    },
    /**
     * 分页
     * @param currentChange 页码改变
     * @param sizeChange 每页数量改变
     */
    currentChange(val) {
      this.pagination.page = val
      this.getRota(this.searchForm.workDay)
    },
    sizeChange(val) {
      this.pagination.pageSize = val
      this.getRota(this.searchForm.workDay)
    },
    seachList() {
      console.log('seachList')
      this.isFirstIn = true
      this.getRota(this.searchForm.workDay)
    }
  }
}
</script>

<style lang="scss" scoped>
.staffShift-container {
  padding: 20px;
  .search-wrap {
    display: flex;
    align-items: center;
    height: 50px;
    margin-bottom: 10px;
    .search-form,
    .search-btn {
      display: inline-block;
    }
    .search-form {
      vertical-align: middle;
    }
  }
}
</style>
