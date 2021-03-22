// pages/more-time/more-time.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeName: '1',
    active:0,
    dayTitle:[
      {name:'今天',date:'3.10'},
      {name:'周一',date:'12.31'},
      {name:'周二',date:'3.10'},
      {name:'周三',date:'3.10'},
      {name:'周四',date:'3.10'},
      {name:'周五',date:'3.10'},
      {name:'周六',date:'3.10'},
    ],
    showTime:[
      '9:00','9:30','10:00','10:30','11:00','11:30',"12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30"
    ]
  },
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})