<!-- 人员管理-业绩 -->
<template>
  <div class="performance-container">
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

// import { getPerformanceList } from '@/api/personManage'
import axios from 'axios'

export default {
  name: 'Performance',
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
          type: 'select',
          size: 'mini',
          placeholder: '请选择业绩',
          label: '业绩 :',
          value: 'placeId',
          clearable: true,
          list: () => this.communitys,
          change: () => this.currentChange(1),
          filterable: true,
          style: 'width: 120px'
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
       */
      tableLoading: false,
      tableData: [],
      columns: [
        {
          label: '技师',
          prop: 'name'
        },
        {
          label: '职称头衔',
          prop: 'positionalTitles'
        },
        {
          label: '绩效',
          prop: 'achievements'
        },
        {
          label: '接单量',
          prop: 'ordersNumber'
        },
        {
          label: '联系方式',
          prop: 'phone'
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
    this.getPerformanceList()
  },
  methods: {
    // 获取列表数据
    getPerformanceList() {
      this.tableLoading = true
      axios.post('https://www.fastmock.site/mock/06260b1fdf2704085031aac99da750a5/xinzhilv/xinzhilv/personManage/performance').then(res => {
      // getPerformanceList().then(res => {
        this.tableLoading = false
        this.tableData = res.data.data
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
.performance-container {
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
