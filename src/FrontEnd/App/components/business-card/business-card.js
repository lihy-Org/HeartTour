// components/business-card/business-card.js
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true,
  },
  properties: {
   options:{type:Object}
  },
  lifetimes: {
    attached() {

    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    newClick(e) {
      console.log(e);
    },

  }
})
