<!-- 商品管理-产品 -->
<template>
  <div class="dervatives-container">
    <!-- 搜索区域 -->
    <div class="search-wrap">
      <Form class="search-form" :inline="true" :form="searchForm" :form-items="searchFormItems" />
      <Btns class="search-btn" :buttons="operationBtns" />
    </div>

    <!-- 表格区域 -->
    <Table
      :loading="tableLoading"
      :table-data="tableData"
      :has-select="false"
      :has-index="true"
      :columns="columns"
      :pagination="pagination"
      :total="total"
      :current-change="currentChange"
      :size-change="sizeChange"
    />
  </div>
</template>

<script>
import Form from '@/components/Form/index'
import Btns from '@/components/Btns/index'
import Table from '@/components/Table/index'
import { parseTime } from '@/utils'

import { getBookingManageList } from '@/api/personManage'

export default {
  name: 'Product',
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
        placeName: '',
        orgName: ''
      },
      searchFormItems: [
        {
          type: 'datetimerange',
          size: 'mini',
          label: '预约时间 :',
          style: 'width: 360px',
          separator: '至',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          value: 'startTime',
          change: () => this.currentChange(1)
        },
        {
          type: 'select',
          size: 'mini',
          placeholder: '请选择技师',
          label: '技师 :',
          value: 'placeId',
          clearable: true,
          list: () => this.communitys,
          change: () => this.currentChange(1),
          filterable: true,
          style: 'width: 120px'
        },
        {
          type: 'input',
          size: 'mini',
          placeholder: '预约用户名/手机号',
          value: 'deviceId',
          clearable: true
        }
      ],

      /**
       * 顶部按钮组
       * @param operationBtns 按钮组
       */
      operationBtns: [
        {
          type: 'success',
          size: 'small',
          value: '查询',
          click: () => this.aaa(),
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
       * @param petTypeMap 宠物类型对应字典
       */
      tableLoading: false,
      tableData: [],
      petTypeMap: {
        0: '猫猫',
        1: '狗狗'
      },
      columns: [
        {
          label: '预约技师',
          prop: 'technician'
        },
        {
          label: '预约时间',
          prop: 'time',
          formatter: row => parseTime(row.time, '{y}-{m}-{d} {h}:{i}')
        },
        {
          label: '预约用户',
          prop: 'userName'
        },
        {
          label: '联系方式',
          prop: 'phone'
        },
        {
          label: '套餐名称',
          prop: 'comboName'
        },
        {
          label: '宠物类型',
          prop: 'petType',
          formatter: row => {
            return this.petTypeMap[row.petType]
          }
        }
        // {
        //   contentType: 'img',
        //   name: '背景图',
        //   prop: 'imgSrc'
        // },
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
    console.log('预约管理')
    this.getBookingManageList()
  },
  methods: {
    // 获取列表数据
    getBookingManageList() {
      this.tableLoading = true
      getBookingManageList().then(res => {
        this.tableLoading = false
        this.tableData = res.data
        console.log(this.tableData)
      }).catch(err => {
        this.tableLoading = false
        this.$message({
          message: err.msg,
          type: 'error'
        })
      })
    },

    /**
     * 分页
     * @param currentChange 页码改变
     * @param sizeChange 每页数量改变
     */
    currentChange(val) {
      this.pagination.page = val
      this.getTableData()
    },
    sizeChange(val) {
      this.pagination.pageSize = val
      this.getTableData()
    },
    aaa() {
      console.log('aaa')
    }
  }
}
</script>

<style lang="scss" scoped>
.dervatives-container {
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

