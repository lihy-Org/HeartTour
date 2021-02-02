<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="booking-container">
        <Btns :buttons="operationBtns" />
      </div>
    </div>
  </div>
</template>

<script>
import Btns from '@/components/Btns/index'

export default {
  name: 'Booking',
  components: {
    Btns
  },
  data() {
    return {
      operationBtns: [
        {
          type: 'success',
          size: 'medium',
          value: '查询',
          click: () => this.aaa(),
          icon: 'el-icon-search'
        },
        {
          type: 'primary',
          size: 'medium',
          value: '新增',
          click: () => this.aaa(),
          icon: 'el-icon-plus'
        },
        {
          type: 'primary',
          size: 'medium',
          value: '编辑',
          click: () => this.aaa(),
          icon: 'el-icon-edit'
        },
        {
          type: 'danger',
          size: 'medium',
          value: '删除',
          click: () => this.aaa(),
          icon: 'el-icon-delete'
        }
      ]
    }
  },
  computed: {},
  created() { },
  methods: {
    aaa() {
      console.log('aaa')
    }
  }
}
</script>
