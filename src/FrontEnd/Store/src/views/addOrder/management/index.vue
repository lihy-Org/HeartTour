<!-- 线下加单 -->
<template>
  <div class="addorder-container">
    <!-- 搜索区域 -->
    <div class="search-wrap">
      <Form class="search-form" :inline="true" :form="searchForm" :form-items="searchFormItems" />
      <Btns class="search-btn" :buttons="operationBtns" />
    </div>

    <!-- 表格区域 -->
    <Table
      :loading="tableLoading"
      :table-data="tableData"
      :is-fit="true"
      :has-select="false"
      :has-index="true"
      :columns="columns"
      :pagination="pagination"
      :total="total"
      :current-change="currentChange"
      :size-change="sizeChange"
    />

    <!-- 线下录单 -->
    <div v-if="dialogVisible">
      <el-dialog title="录单" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
        <div class="formChild">
          <span class="orderLabel">宠物品种:</span>
          <span>{{ checkedPet.value }}</span>
          <el-tree
            ref="tree"
            :data="petsList"
            node-key="id"
            highlight-current
            :props="defaultProps"
            accordion
            @node-click="handleNodeClick"
          />
        </div>
        <div class="formChild">
          <span class="orderLabel">用户姓名：</span>
          <el-input
            v-model="wcName"
            placeholder="请输入用户姓名"
            prefix-icon="el-icon-user"
            style="width: 300px"
          />
        </div>
        <div class="formChild">
          <span class="orderLabel">用户手机号：</span>
          <el-input
            v-model="wcName"
            placeholder="请输入用户手机号"
            prefix-icon="el-icon-phone"
            style="width: 300px"
          />
        </div>
        <div class="formChild">
          <span class="orderLabel">宠物姓名：</span>
          <el-input
            v-model="wcName"
            class="iWrap"
            placeholder="请输入宠物姓名"
            style="width: 300px"
          >
            <i slot="prefix" style="position: relative; top: 50%; transform: translateY(-50%); display: flex;align-items: center; justify-content: center">
              <img
                style="width:16px;height:16px"
                src="@/assets/addOrder/pet.png"
                alt
              >
            </i>
          </el-input>
        </div>
        <div class="formChild">
          <span class="orderLabel">宠物性别：</span>
          <div style="display: inline-block">
            <el-radio v-model="petSex" label="1" border>弟弟</el-radio>
            <el-radio v-model="petSex" label="2" border>妹妹</el-radio>
          </div>
        </div>
        <div class="formChild">
          <span class="orderLabel">套餐选择：</span>
          <el-select v-model="comboVal" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setNewBooking">确 定</el-button>
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

import { getBookingList } from '@/api/booking'
import { getPetsList } from '@/api/addOrder'

import moment from 'moment'
import 'moment/locale/zh-cn'

export default {
  name: 'Addorder',
  components: {
    Form,
    Btns,
    Table
  },
  data() {
    return {
      // 套餐列表
      combosList: [],
      // 宠物列表
      petsList: [],
      defaultProps: {
        children: 'children',
        label: 'value'
      },
      // 录单中选中的宠物
      checkedPet: {},
      // 录单中用户姓名
      wcName: '',
      // 套餐列表、套餐
      options: [],
      comboVal: '',
      petSex: '',
      /**
       * 顶部搜索区域form
       * @param searchForm 搜索内容字段
       * @param searchFormItems 搜索内容组
       * @param userList 技师列表
       */
      searchForm: {
        // 默认已完成-加单
        state: 500,
        userId: '',
        searchKey: '',
        dateTime: ''
      },
      usersList: [],
      everyMsg: {},
      getDateRota: [],
      searchFormItems: [
        {
          type: 'datetimerange',
          size: 'mini',
          label: '订单时间 :',
          style: 'width: 360px',
          separator: '至',
          startPlaceholder: '开始时间',
          endPlaceholder: '结束时间',
          value: 'dateTime'
          // change: () => this.currentChange(1)
        },
        {
          type: 'input',
          size: 'mini',
          placeholder: '线下加单用户名/手机号',
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
        },
        {
          type: 'warning',
          size: 'small',
          value: '录单',
          click: () => this.recording(),
          icon: 'el-icon-edit'
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
          label: '订单技师',
          prop: 'userName'
        },
        {
          label: '加单用户',
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
        {
          label: '用户备注',
          prop: 'remark'
        },
        {
          label: '技师备注',
          prop: 'userRemark',
          formatter: row => {
            if (!row.userRemark) {
              return '-'
            }
          }
        },
        {
          label: '店铺备注',
          prop: 'storeRemark'
        },
        // {
        //   contentType: 'img',
        //   name: '背景图',
        //   prop: 'imgSrc'
        // },
        {
          contentType: 'button',
          label: '操作',
          width: 150,
          align: 'center',
          buttons: [
            {
              type: 'primary',
              size: 'mini',
              label: '查看详情',
              click: row => this.getDetails(row)
            }
          ]
        }
      ],
      /**
       * 预约编辑form
       * @prams detailsFormItems 详情内容组
       * @param labelPosition 对齐方式
       */
      formColStyleDetails: 'width: 30%',
      labelWidth: '110px',
      labelPosition: 'right',
      detailsForm: {},
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

    // 关闭编辑弹框的提示
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },

    // 提交录单
    setNewBooking() {
      console.log(this.checkedPet.children)
      if (!this.checkedPet.children || this.checkedPet.children.length > 0) {
        this.$message.error('请选择具体的宠物品种')
        return
      }
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
    },

    // 手动录单
    recording() {
      console.log('线下录单')
      this.dialogVisible = true
      this.getPetsList()
    },

    // 获取宠物列表
    getPetsList() {
      getPetsList().then(res => {
        this.petsList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    // 树状单选
    handleNodeClick(data) {
      console.log(data)
      this.checkedPet = data
    }
  }
}
</script>

<style lang="scss" scoped>
.addorder-container {
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
.formChild {
  margin-bottom: 20px;
  .orderLabel {
    display: inline-block;
    width: 100px;
    font-weight: 700;
  }
  .iWrap {
    ::v-deep .el-input__prefix {
      width: 25px !important;
    }
  }
}
</style>
