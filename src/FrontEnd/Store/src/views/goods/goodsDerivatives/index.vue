<!-- 商品管理-周边 -->
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
import axios from 'axios'

export default {
  name: 'Dervatives',
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
        // 默认待支付
        state: 100,
        orgName: ''
      },
      searchFormItems: [
        {
          type: 'select',
          size: 'mini',
          placeholder: '请选择状态',
          label: '订单状态 :',
          value: 'state',
          clearable: true,
          list: () => this.goodsState,
          change: () => this.currentChange(1),
          filterable: true,
          style: 'width: 120px'
        },
        {
          type: 'datetimerange',
          size: 'mini',
          label: '下单时间 :',
          style: 'width: 360px',
          separator: '至',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          value: 'startTime',
          change: () => this.currentChange(1)
        },
        {
          type: 'input',
          size: 'mini',
          placeholder: '下单用户名/手机号',
          value: 'deviceId',
          clearable: true
        }
      ],

      /**
       * 顶部按钮组
       * @param operationBtns 按钮组
       * @param goodsState 状态
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
      goodsState: [
        { value: 100, label: '待支付' },
        { value: 200, label: '待发货' },
        { value: 400, label: '已发货' },
        { value: 500, label: '已收货' }
      ],

      /**
       * table属性
       * @param tableLoading 动画
       * @param tableData 列表数据
       * @param statusMap 状态对应字典
       * @param columns 列表展示项
       * @param pagination 分页
       * @param total 数据总量
       * @param petTypeMap 宠物类型对应字典
       */
      tableLoading: false,
      statusMap: {
        100: '待支付',
        200: '待发货',
        400: '已发货',
        500: '已收货'
      },
      tableData: [],
      petTypeMap: {
        0: '猫猫',
        1: '狗狗'
      },
      columns: [
        {
          label: '订单ID',
          prop: 'id'
        },
        {
          label: '下单用户',
          prop: 'wcName'
        },
        {
          label: '订单状态',
          prop: 'state',
          formatter: row => {
            return this.statusMap[row.state]
          }
        },
        {
          label: '套餐名称',
          prop: 'mainComboName'
        },
        {
          label: '下单时间',
          prop: 'apptTime',
          formatter: row => parseTime(row.apptTime, '{y}-{m}-{d} {h}:{i}')
        },
        {
          label: '周边编号',
          prop: 'goodsNumber'
        },
        {
          label: '周边类型',
          prop: 'petType',
          formatter: row => {
            return this.petTypeMap[row.petType]
          }
        },
        {
          label: '周边品种',
          prop: 'petBreed'
        },
        {
          label: '订单金额',
          prop: 'totalMoney'
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
      axios.post('https://www.fastmock.site/mock/06260b1fdf2704085031aac99da750a5/xinzhilv/xinzhilv/goods').then(res => {
        if (res.status === 200) {
          console.log(res)
          this.tableLoading = false
          this.tableData = res.data.data
          console.log(this.tableData)
        }
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
