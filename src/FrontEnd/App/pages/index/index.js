// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {
      pic: {
        src: '../../assets/images/shan.png'
      },
      technicianName: {
        name: '刘博杭',
      },
      technicianTitle: {
        title: '美容之星',
        showTitle: true
      },
      technicianTitle2: {
        title2: "终极美容师",
        style: 'color:red'
      },
      praise: {
        praise: "好评率100%",
      }
    },
    praiseList: [{
        url: '../../assets/images/praise_sel.png'
      },
      {
        url: '../../assets/images/praise_sel.png'
      },
      {
        url: '../../assets/images/praise_sel.png'
      },
      {
        url: '../../assets/images/praise.png'
      },
      {
        url: '../../assets/images/praise.png'
      },
      {
        url: '../../assets/images/praise.png'
      },
      {
        url: '../../assets/images/praise.png'
      },
      {
        url: '../../assets/images/praise.png'
      },
      {
        url: '../../assets/images/praise.png'
      },
      {
        url: '../../assets/images/praise.png'
      }
    ],
    banners: [{
      image: '../../assets/images/guanggao.png'
    }],
    mealAnimation: {
      show: 0,
      hidden: 300
    },
    setMeal: false,
    mockPet: [{
        name: '洗护套餐A',
        details: '8项护理',
        details1: "360°全方位清洁服务360°360°全方位清洁服务360°360°全方位清洁服务360°360°全方位清洁服务360°",
        price: '45.00',
        id: '1'
      },
      {
        name: '洗护套餐B',
        details: '8项护理',
        details1: "360°全方位清洁服务B",
        price: '45.00',
        id: '2'
      },
      {
        name: '洗护套餐C',
        details: '8项护理',
        details1: "360°全方位清洁服务C",
        price: '45.00',
        id: '3'
      },
      {
        name: '洗护套餐D',
        details: '8项护理',
        details1: "360°全方位清洁服务D",
        price: '46.00',
        id: '4'
      },
    ],
    timers: [{
        date: "今天",
        times: "9:00",
        id: "1"
      },
      {
        date: "今天",
        times: "11:00",
        id: "2"
      },
      {
        date: "今天",
        times: "15:00",
        id: "3"
      },
      {
        date: "明天",
        times: "17:00",
        id: "4"
      },
      {
        date: "明天",
        times: "19:00",
        id: "5"
      },
    ],
    animation: '',
    showTime: null,
  },
  selectMeal: function () {
    this.setData({
      setMeal: !this.data.setMeal
    })
    let option;
    if (this.data.setMeal) {
      option = this.data.mealAnimation.show
    } else {
      option = this.data.mealAnimation.hidden
    }

    let animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateX(option).step()
    this.setData({
      animation: animation.export(),
    })
  },
  seletTime(e) {
    if (e.currentTarget.dataset.item.id === this.data.showTime) {
      this.setData({
        showTime: null
      })
    } else {
      this.setData({
        showTime: e.currentTarget.dataset.item.id,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.showTime);
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