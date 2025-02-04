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
      :key="isSelect"
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

    <!-- 调店的dialog -->
    <div v-if="dialogVisible">
      <el-dialog title="调店" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
        <Form
          ref="transferForm"
          class="transfer-form"
          :inline="true"
          :form="transferForm"
          :form-items="transferFormItems"
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
  </div>
</template>

<script>
import Form from '@/components/Form/index'
import Btns from '@/components/Btns/index'
import Table from '@/components/Table/index'
import { getStatsWorktime, getUsersList, setStaffShiftList, getRotaList } from '@/api/personManage'
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
          clearable: false,
          disabled: () => this.isSelect,
          change: val => this.changeDate(val)
        },
        {
          type: 'select',
          size: 'mini',
          placeholder: '请选择人员',
          label: '人员 :',
          value: 'userId',
          clearable: true,
          disabled: () => this.isSelect,
          list: () => this.usersList,
          change: () => this.currentChange(1),
          style: 'width: 120px'
        }
      ],

      usersList: [],
      // 班次list
      rotaList: [],

      // 是否table展示下拉框、即是否为编辑班表
      isSelect: false,

      // 调店
      dialogVisible: false,

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
          disabled: () => this.isSelect,
          click: () => this.seachList(),
          icon: 'el-icon-search'
        },
        {
          type: () => this.isSelect ? 'danger' : 'success',
          size: 'small',
          value: '编辑排班',
          click: () => this.setRota(),
          icon: 'el-icon-setting'
        },
        {
          type: 'primary',
          size: 'small',
          value: '提交班表',
          disabled: () => !this.isSelect,
          click: () => this.submitRota(),
          icon: 'el-icon-setting'
        }
      ],

      /**
       * table属性
       * @param tableLoading 动画
       * @param tableData 列表数据
       * @param saveData 进入编辑保存当前tableData，若取消，使用该保存data赋值给tableData
       * @param setTableData 编辑班表时，拷贝的table，清空数据时会用（只为了传递给后端的数据是修改的、并非所有的）
       * @param originalData 进入班表编辑，深克隆的数据
       * @param columns 列表展示项
       * @param pagination 分页
       * @param total 数据总量
       * @param tableHeight 表格高度
       */
      tableHeight: 'height: calc(100vh - 184px)',
      tableLoading: false,
      tableData: [],
      saveData: [],
      setTableData: [],
      originalData: [],
      columns: [
        {
          label: '姓名',
          prop: 'uname',
          fixed: true
        },
        {
          label: '职位',
          prop: 'post',
          fixed: true
        }
      ],

      /**
       * 调店属性
       * @param transferStores 店铺
       * @param transferForm 编辑的字段
       * @param formColStyle 表单元素样式
       * @param labelWidth form中label文字宽度
       * @param labelPosition 对齐方式
       * @param transferFormItems 页面展示内容
       */
      transferStores: [
        { value: 100, label: '店铺A' },
        { value: 200, label: '店铺B' },
        { value: 300, label: '店铺C' },
        { value: 400, label: '店铺D' },
        { value: 500, label: '店铺E' },
        { value: 501, label: '店铺F' },
        { value: 502, label: '店铺G' }
      ],
      transferForm: {
        storeId: '',
        nowStore: '店铺XXX'
      },
      formColStyle: 'width: 100%',
      labelWidth: '110px',
      labelPosition: 'right',
      transferFormItems: [
        {
          size: 'mini',
          label: '当前店铺 :',
          value: 'nowStore',
          style: 'width: 320px'
        },
        {
          type: 'select',
          size: 'mini',
          placeholder: '请选择店铺',
          label: '调离到 :',
          value: 'storeId',
          list: () => this.transferStores,
          // change: () => this.currentChange(1),
          filterable: true,
          style: 'width: 220px'
        }
      ],

      pagination: {
        page: 1,
        pageSize: 20
      },
      total: 0
    }
  },
  watch: {
    isSelect: {
      handler(n, o) {
        console.log('isSelect值： ' + this.isSelect)
      }
    }
  },
  created() {
    console.log('排班')
    this.getRotaList()
    this.setTimeFn()
    this.getUsersList()
  },
  methods: {
    getRotaList() {
      getRotaList().then(res => {
        if (res.status === 200) {
          const newRotaList = []
          res.data.forEach(item => {
            const obj = {
              allTime: item.value.split(','),
              value: item.id,
              label: item.key,
              workTime: item.value.split(',')[0],
              restTime: item.value.split(',')[1],
              sort: item.sort,
              type: item.type
            }
            newRotaList.push(obj)
          })
          this.rotaList = newRotaList
          console.log(this.rotaList)
        }
      }).catch(err => {
        console.log(err)
      })
    },
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
        if (res.status === 200) {
          console.log(res.data)
          this.usersList = res.data.map(item => ({
            value: item.id,
            label: item.name
          }))
          console.log(this.usersList)
        }
      }).catch(err => {
        console.log(err)
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
            if (res.status === 200) {
              console.log(res.data)
              /**
               * 数据格式化
               * 1. 去重、且将同一人的班表放在一个数组中，数组中每个对象即不同的人 personArr存放去重后的人员id
               * 2. 将同一个id下人员的班表以key-value形式加入对象中 如："2021-3-11": "13:00-17:00"
               */
              const personArr = []
              const newData = []
              for (let i = 0; i < res.data.length; i++) {
                if (personArr.indexOf(res.data[i].uid) === -1) {
                  personArr.push(res.data[i].uid)
                }
              }
              personArr.forEach(item => {
                const obj = {}
                res.data.forEach(ele => {
                  if (item === ele.uid) {
                    obj.post = ele.post
                    obj.uid = ele.uid
                    obj.uname = ele.uname
                    if (ele.workDay) {
                      obj[`${ele.workDay}`] = ele.freqName
                    }
                  }
                })
                newData.push(obj)
              })
              console.log(newData)
              // 每次切换时间，数据重置
              this.columns = this.$options.data().columns

              this.tableLoading = false
              this.tableData = newData
              this.saveData = this.$_.cloneDeep(newData)
              const dateArr = []
              for (let i = 0; i < timeDifference; i++) {
                const dateStamp = moment(val[0] + i * 1000 * 60 * 60 * 24)
                const obj = {
                  label: `${dateStamp.format('YYYY-MM-DD')} / ${this.getWeek(dateStamp.day())}`,
                  prop: `${dateStamp.format('YYYY-MM-DD')}`,
                  canEdit: true,
                  value: `${dateStamp.format('YYYY-MM-DD')}`,
                  rotaName: '请选择班次',
                  optionData: () => this.rotaList,
                  clearable: true,
                  clear: (val, row) => this.clearSelectRota(val, row, dateStamp.format('YYYY-MM-DD')),
                  contentType: 'normal',
                  isDisabled: moment().startOf('day') > moment(dateStamp).startOf('day'),
                  minWidth: '160px',
                  change: (val, row) => this.changeDateTable(val, row)
                }
                dateArr.push(obj)
              }
              console.log(dateArr)
              const operation = {
                contentType: 'button',
                label: '操作',
                width: 120,
                align: 'center',
                fixed: 'right',
                buttons: [
                  {
                    type: 'primary',
                    size: 'mini',
                    label: '调店',
                    disabled: () => this.isSelect,
                    click: row => this.transferStore(row)
                  }
                ]
              }
              dateArr.push(operation)
              this.columns.splice(2, 0, ...dateArr)
              console.log(this.columns)
              this.isFirstIn = false
            }
          }).catch(err => {
            console.log(err)
            this.isFirstIn = false
            this.tableLoading = false
          })
        }
      }
    },

    // 编辑排班
    setRota() {
      console.log(this.isSelect)
      console.log(this.saveData)
      this.columns.forEach(item => {
        if (!this.isSelect && item.contentType === 'normal') {
          item.contentType = 'select'
        }
        if (this.isSelect && item.contentType === 'select') {
          item.contentType = 'normal'
        }
      })
      if (this.isSelect) {
        this.$confirm('班表尚未提交, 此操作将退出编辑, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isSelect = !this.isSelect
          this.operationBtns[1].value = this.isSelect ? '取消排班' : '编辑排班'
          this.isFirstIn = true
          this.tableData = this.$_.cloneDeep(this.saveData)
          this.$message({
            type: 'info',
            message: '退出编辑'
          })
        }).catch(() => {
          console.log(this.isSelect)
          // 取消后，仍然是select下拉框
          this.columns.forEach(item => {
            if (this.isSelect && item.contentType === 'normal') {
              item.contentType = 'select'
            }
          })
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
      } else {
        this.setTableData = []
        this.isSelect = true
        this.operationBtns[1].value = this.isSelect ? '取消排班' : '编辑排班'
        // setTableData 只保留tableData中的非班次的数据
        this.tableData.forEach((item) => {
          this.setTableData.push({
            post: item.post,
            uid: item.uid,
            uname: item.uname
          })
        })
        console.log(this.setTableData)
        // 因为是要编辑，设置一个字段存储，存储的为：没有任何排班的字段
        this.originalData = this.$_.cloneDeep(this.tableData)
        console.log(this.originalData)
        this.isFirstIn = true
      }
    },

    // 编辑班表-下拉框选择班次
    changeDateTable(val, row) {
      console.log(val)
      console.log(row)
      console.log(this.tableData)
    },
    // 编辑班表，清空时，删除班表的key-value
    clearSelectRota(val, row, key) {
      console.log(row)
      console.log(key)
      delete row[key]
      console.log(row)
    },

    // 提交班表
    submitRota() {
      console.log(this.tableData)
      console.log(this.originalData)
      /**
       * 目前暂时一个一个人传，因此按人，将数据处理，多次请求接口，select清空时，已delete
       * 进入编辑班表的页面，并深克隆该data
       * 判断深克隆的data和改变后的data之间，每一个item的key是否includes
       */
      this.tableData.forEach((item, index) => {
        console.log(item)
        const tableDataKeysArr = Object.keys(item)
        const originalKeysArr = Object.keys(this.originalData[index])
        console.log(tableDataKeysArr)
        // 没有排班，所存在的key为["post", "uid", "uname"]，剩下的key["post", "uid", "uname", "2021-03-23", "2021-03-24"]，是day
        // 比较深克隆data和改变后data的keys
        let daysKeyArr = []
        const originalArr = originalKeysArr
        /**
         * 在已有班表做新增（tableDataKeysArr的长度增加）
         * 在已有班表做减少（tableDataKeysArr的长度减少）
         * 在已有班表做修改（tableDataKeysArr的长度不变，即切换班次）
         */
        daysKeyArr = tableDataKeysArr.filter(ele => {
          return originalArr.indexOf(ele) === -1
        })
        console.log(daysKeyArr)
        const daysArr = []
        daysKeyArr.forEach((ele, index) => {
          const dayObj = {
            day: ele,
            freqId: item[ele]
            // startTime: item[ele].split('-')[0],
            // endTime: item[ele].split('-')[1]
          }
          daysArr.push(dayObj)
        })
        const obj = {
          userId: item.uid,
          days: daysArr
        }
        // 只请求修改了班表的人
        if (obj.days.length > 0) {
          console.log(obj, '------------------------------------')
          setStaffShiftList(obj).then(res => {
            if (res.status === 200) {
              console.log(res.data)
            }
          }).catch(err => {
            console.log(err)
          })
        }
        console.log('+++++++++++++++++++++++++++++++++++')
      })
    },

    // 调店
    transferStore(row) {
      console.log(row)
      this.dialogVisible = true
    },

    // 关闭编辑弹框的提示
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
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
      this.isSelect = false
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
