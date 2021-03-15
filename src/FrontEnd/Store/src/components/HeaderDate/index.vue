<template>
  <div class="header-dateTime">
    <span>{{ dateTime }}</span>
  </div>
</template>

<script>
import moment from 'moment'
import 'moment/locale/zh-cn'

export default {
  components: {},
  props: {

  },
  data() {
    return {}
  },
  computed: {
    dateTime() {
      return moment().format('YYYY年MM月DD日 dddd')
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
</style>
