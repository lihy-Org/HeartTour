<!-- 预约管理 -->
<template>
  <div class="bookingManage-container">
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

    <!-- 修改预约信息dialog -->
    <div v-if="dialogVisible">
      <el-dialog title="预约信息修改" :visible.sync="dialogVisible" width="450px" :before-close="handleClose">
        <Form
          class="search-form"
          :inline="true"
          :form="editForm"
          :form-items="editFormItems"
          :form-col-style="formColStyle"
          :label-width="labelWidth"
          :label-position="labelPosition"
        />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 查看详情dialog -->
    <div v-if="dialogDetails">
      <el-dialog title="预约详情" :visible.sync="dialogDetails" width="1000px" :before-close="handleClose">
        <Form
          class="details-form"
          :inline="true"
          :form="detailsForm"
          :form-items="detailsFormItems"
          :form-col-style="formColStyleDetails"
          :label-width="labelWidth"
          :label-position="labelPosition"
        />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogDetails = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Form from '@/components/Form/index'
import Btns from '@/components/Btns/index'
import Table from '@/components/Table/index'
import { parseTime } from '@/utils'

import { getBookingList } from '@/api/booking'
import { getStaffShiftList, getUsersList } from '@/api/personManage'

import moment from 'moment'
import 'moment/locale/zh-cn'

export default {
  name: 'Booking',
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
       * @param bookingState 预约状态
       * @param userList 技师列表
       */
      searchForm: {
        // 默认已预约
        state: 200,
        userId: '',
        searchKey: '',
        dateTime: ''
      },
      bookingState: [
        { value: 100, label: '待支付' },
        { value: 200, label: '已预约' },
        { value: 300, label: '进行中' },
        { value: 400, label: '待接取' },
        { value: 500, label: '已完成' }
      ],
      usersList: [],
      searchFormItems: [
        {
          type: 'select',
          size: 'mini',
          placeholder: '请选择状态',
          label: '状态 :',
          value: 'state',
          list: () => this.bookingState,
          // change: () => this.currentChange(1),
          filterable: true,
          style: 'width: 120px'
        },
        {
          type: 'datetimerange',
          size: 'mini',
          label: '预约时间 :',
          style: 'width: 360px',
          separator: '至',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          value: 'dateTime'
          // change: () => this.currentChange(1)
        },
        {
          type: 'select',
          size: 'mini',
          placeholder: '请选择技师',
          label: '技师 :',
          value: 'userId',
          clearable: true,
          list: () => this.usersList,
          // change: () => this.currentChange(1),
          filterable: true,
          style: 'width: 120px'
        },
        {
          type: 'input',
          size: 'mini',
          placeholder: '预约用户名/手机号',
          value: 'searchKey',
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
          click: () => this.seachList(),
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
       * @param statusMap 状态对应字典
       * @param petTypeMap 宠物类型对应字典
       * @param dialogVisible 预约信息修改弹框
       * @param dialogDetails 查看详情
       */
      tableLoading: false,
      dialogVisible: false,
      dialogDetails: false,
      tableData: [],
      statusMap: {
        100: '待支付',
        200: '已预约',
        300: '进行中',
        400: '待接取',
        500: '已完成'
      },
      petTypeMap: {
        0: '猫猫',
        1: '狗狗'
      },
      columns: [
        {
          label: '预约状态',
          prop: 'state',
          formatter: row => {
            return this.statusMap[row.state]
          }
        },
        {
          label: '预约时间',
          prop: 'apptTime',
          formatter: row => parseTime(row.apptTime, '{y}-{m}-{d} {h}:{i}')
        },
        {
          label: '预约技师',
          prop: 'userName'
        },
        {
          label: '预约用户',
          prop: 'wcName'
        },
        {
          label: '联系方式',
          prop: 'phone'
        },
        {
          label: '套餐名称',
          prop: 'mainComboName'
        },
        {
          label: '宠物类型',
          prop: 'petType',
          formatter: row => {
            return this.petTypeMap[row.petType]
          }
        },
        // {
        //   contentType: 'img',
        //   name: '背景图',
        //   prop: 'imgSrc'
        // },
        {
          contentType: 'button',
          label: '操作',
          width: 400,
          buttons: [
            {
              type: 'primary',
              size: 'mini',
              label: '查看详情',
              click: row => this.getDetails(row)
            },
            {
              type: 'primary',
              size: 'mini',
              label: '修改预约信息',
              click: row => this.editRowData(row)
            },
            {
              type: 'danger',
              size: 'mini',
              label: '退款',
              click: row => this.editRowData(row)
            },
            {
              type: 'warning',
              size: 'mini',
              label: '完成该订单',
              click: row => this.editRowData(row)
            }
          ]
        }
      ],
      /**
       * 预约编辑form
       * @param {technician, time} editForm 编辑的字段:技师、时间
       * @param editFormItems 修改预约内容组
       * @prams detailsFormItems 详情内容组
       * @param formColStyle 表单元素样式
       * @param labelWidth form中label文字宽度
       * @param labelPosition 对齐方式
       */
      formColStyle: 'width: 100%',
      formColStyleDetails: 'width: 30%',
      labelWidth: '80px',
      labelPosition: 'right',
      editForm: {
        dateTime: '',
        technician: '',
        time: ''
      },
      detailsForm: {},
      editFormItems: [
        {
          type: 'date',
          size: 'mini',
          label: '预约日期 :',
          style: 'width: 320px',
          value: 'dateTime',
          change: val => this.changeDate(val)
        },
        {
          type: 'radio',
          label: '预约技师',
          value: 'technician',
          style: 'width: 320px',
          list: []
        },
        {
          type: 'select',
          size: 'mini',
          placeholder: '请选择预约时间',
          label: '时间 :',
          value: 'time',
          clearable: true,
          list: () => this.communitys,
          change: () => this.currentChange(1),
          filterable: true,
          style: 'width: 320px'
        }
      ],
      detailsFormItems: [],
      pagination: {
        page: 1,
        pageSize: 20
      },
      total: 0
    }
  },
  computed: {},
  created() {
    this.detailsFormItemsFn()
    console.log('预约管理')
    this.getBookingList()
    this.getUsersList()
  },
  methods: {
    // 设置details数据
    detailsFormItemsFn() {
      this.detailsFormItems = [
        {
          size: 'mini',
          label: '预约编号 :',
          value: 'orderNo',
          style: 'width: 320px'
        },
        {
          size: 'mini',
          label: '预约状态 :',
          value: 'state',
          style: 'width: 320px',
          dataMap: this.statusMap
        },
        {
          size: 'mini',
          label: '预约时间 :',
          value: 'apptTime',
          style: 'width: 320px'
        },
        {
          size: 'mini',
          label: '预约用户 :',
          value: 'wcName',
          style: 'width: 320px'
        },
        {
          size: 'mini',
          label: '联系方式 :',
          value: 'phone',
          style: 'width: 320px'
        },
        {
          size: 'mini',
          label: '预约技师 :',
          value: 'userName',
          style: 'width: 320px'
        },
        {
          size: 'mini',
          label: '预约套餐 :',
          value: 'storeName',
          style: 'width: 320px'
        },
        {
          size: 'mini',
          label: '订单金额 :',
          value: 'totalMoney',
          style: 'width: 320px',
          dataJoin: '元'
        },
        {
          size: 'mini',
          label: '支付金额 :',
          value: 'payMoney',
          style: 'width: 320px',
          dataJoin: '元'
        },
        {
          size: 'mini',
          label: '宠物类型 :',
          value: 'petType',
          style: 'width: 320px',
          dataMap: this.petTypeMap
        },
        {
          size: 'mini',
          label: '支付时间 :',
          value: 'payTime',
          style: 'width: 320px'
        }
      ]
    },
    // 获取当天日期的时间戳
    getNowTime(row) {
      this.$set(this.editForm, 'dateTime', new Date(new Date().toLocaleDateString()).getTime())
      this.dialogVisible = true
      this.editFormItems[1].list = this.usersList.map(item => ({
        label: item.label,
        value: item.value,
        border: true,
        style: 'margin: 0px 10px 10px 0px'
      }))
      console.log(this.editFormItems[1].list)
      const userId = this.editFormItems[1].list.filter(item => {
        return item.label === row.userName
      })
      console.log(userId)
      this.editForm.technician = userId[0].value
    },

    // 修改日期
    changeDate(val) {
      console.log(val)
    },

    // 获取列表数据
    getBookingList() {
      this.tableLoading = true
      console.log(this.searchForm)
      const data = {
        state: this.searchForm.state,
        userId: this.searchForm.userId,
        // startDate: this.searchForm.dateTime[0],
        searchKey: this.searchForm.searchKey,
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      }
      console.log()
      if (this.searchForm.dateTime) {
        data.startDate = moment(this.searchForm.dateTime[0]).format('YYYY-MM-DD HH:mm:ss')
        data.endDate = moment(this.searchForm.dateTime[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      getBookingList(data).then(res => {
        this.tableLoading = false
        this.tableData = res.data
        console.log(this.tableData)
      }).catch(err => {
        console.log(err)
        this.tableLoading = false
      })
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

    // 获取排班
    getWorkTime() {
      const data = {}
      getStaffShiftList(data).then(res => {

      })
    },

    // 查看详情
    getDetails(row) {
      console.log(row)
      const data = JSON.parse(JSON.stringify(row))
      this.$set(this, 'detailsForm', data)
      console.log(this.detailsForm)
      this.dialogDetails = true
    },

    // 修改预约信息
    editRowData(row) {
      console.log(row)
      this.getNowTime(row)
      this.getWorkTime()
    },
    // 关闭编辑弹框的提示
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },

    /**
     * 分页
     * @param currentChange 页码改变
     * @param sizeChange 每页数量改变
     */
    currentChange(val) {
      this.pagination.page = val
      this.getBookingList()
    },
    sizeChange(val) {
      this.pagination.pageSize = val
      this.getBookingList()
    },
    seachList() {
      this.getBookingList()
      console.log('seachList')
    }
  }
}
</script>

<style lang="scss" scoped>
.bookingManage-container {
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
