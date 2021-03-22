// pages/my-order/my-order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {

    },
    yuyue: {
      active: 0,
      items: [{
        title: '待支付',
        type: 0,
      },
      {
        title:'待服务',
        type:1,
      },
      {
        title:'待领取',
        type:3,
      },
      {
        title:'已完成',
        type:4,
      },
      {
        title:'已取消',
        type:5,
      }
    ]
    },
    mockData:{
      0:[{name:'迷你杜宾洗护套餐',status:'待支付'}],
      1:[{name:'2',status:'待支付'}],
      2:[{name:'3',status:'待支付'}],
      3:[{name:'4',status:'待支付'}],
      4:[{name:'5',status:'待支付'}],
      5:[{name:'6',status:'待支付'}],
    },
    options: {
      pic: {
        src: '../../assets/images/shan.png'
      },
      technicianName: {
        name: '刘博杭',
      },
      technicianTitle: {
        wordTitle: '美容之星',
      },
      technicianTitle2: {
        title2: "预约时间",
      },
      praise: {
        praise: "2021-01-27 18:30",
      },
      show:false,
      businessCard:'businessCard',
      technicianHead:'technicianHead'
    },

  },
  onChange(e){
    wx.showToast({
      title: `点击标签 ${e.detail.name}`,
      icon: 'none',
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