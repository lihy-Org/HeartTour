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
        style:'vertical-align:middle;margin-right:20rpx;'
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
      },
      show:true,
      businessCard:'businessCard',
      technicianHead:'technicianHead'
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
      mealAnimationX: {
        show: 0,
        hidden: '300rpx'
      },
      mealAnimationY: {
        show: 0,
        hidden: -620
      },
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
    addItem: [{
        name: '刷牙',
        price: `￥45':00`,
        id: '1',
        checked: ""
      },
      {
        name: '洗澡',
        price: `￥45:00`,
        id: '2',
        checked: ""
      },
      {
        name: '按摩',
        price: `￥45:00`,
        id: '3',
        checked: ""
      },
      {
        name: '马杀鸡',
        price: `￥45:00`,
        id: '4',
        checked: ""
      },
      {
        name: '撕吧儿',
        price: `￥45:00`,
        id: '5',
        checked: ""
      },
      {
        name: '安逸安逸安逸',
        price: `￥45:00`,
        id: '6',
        checked: ""
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
    showTime: '',
    activeMeal: '',
    initial: true,
    suggestAdd: [],
    addPetShow: false,
    mainActiveIndex: 0,
    activeId: null,
    items: [{
        // 导航名称
        text: '汪星人',
        children: [{
            // 名称
            text: '小型犬',
            // id，作为匹配选中状态的标识
            children: [{
                // 名称
                text: '泰迪狗1',
                // id，作为匹配选中状态的标识
                src:'../../assets/images/shan.png',
                id: 1,

              },
              {
                text: '吉娃娃2',
                id: 2,
              },
            ],
          },
          {
            // 名称
            text: '中型犬',
            // id，作为匹配选中状态的标识
            children: [{
                // 名称
                text: '哈巴狗3',
                // id，作为匹配选中状态的标识
                id: 3,

              },
              {
                text: '比特4',
                id: 4,
              },
            ],
          },
          {
            // 名称
            text: '大型犬',
            // id，作为匹配选中状态的标识

            children: [{
                // 名称
                text: '金毛5',
                // id，作为匹配选中状态的标识
                id: 5,

              },
              {
                text: '2哈6',
                id: 6,
              },
            ],
          },
        ],
      },
      {
        // 导航名称
        text: '喵星人',
        // 导航名称右上角徽标，1.5.0 版本开始支持

        // 该导航下所有的可选项
        children: [{
            // 名称
            text: '长毛猫',
            // id，作为匹配选中状态的标识

            children: [{
                // 名称
                text: '蓝猫',
                // id，作为匹配选中状态的标识
                id: 7,
              },
              {
                text: '绿毛',
                id: 8,
              },
            ],
          },
          {
            // 名称
            text: '短毛猫',
            // id，作为匹配选中状态的标识

            children: [{
              // 名称
              text: '加肥猫',
              // id，作为匹配选中状态的标识
              id: 9,
            }],
          },
          {
            // 名称
            text: '其他猫',
            // id，作为匹配选中状态的标识

            children: [{
              // 名称
              text: '比鲁斯',
              // id，作为匹配选中状态的标识
              id: 10,
            }],
          },
        ],
      },
      {
        // 导航名称
        text: '其他',

        children: [{
          text: '其他',
          children: [{
              // 名称
              text: '羊驼',
              // id，作为匹配选中状态的标识
              id: 11,
            },
            {
              text: '蛇',
              id: 12,
            },
          ]
        }],
      },
    ],
    radio:0,
    whichPet: [],
    shopName:''
  },
  goMap:function(){
    wx.navigateTo({
      url: '../map/map',
    });
  },
  goAddPet(){
    wx.navigateTo({
      url:'../add-pet/add-pet'
    })
  },
  initPet: function (e) {
    if (e) {
      this.data.items.forEach(item => {
        if (item.text === e.currentTarget.dataset.text) {
          this.setData({
            whichPet: item.children,
            activeId: item.children[0].children[0].id,
            mainActiveIndex: 0
          })
        }
      });
    } else {
      this.setData({
        whichPet: this.data.items[0].children,
        activeId: this.data.items[0].children[0].children[0].id,
        mainActiveIndex: 0
      })
    }
  },
  getPetList(e) {
    this.initPet(e);
    console.log(e);
    this.setData({
      radio:e.currentTarget.dataset.index
    })
  },
  addPet: function () {
    this.setData({
      addPetShow: true
    })
  },
  onClose() {
    this.setData({
      addPetShow: false
    });
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onClickNav(e) {
    const detail = e.detail;
    this.setData({
      mainActiveIndex: detail.index || 0,
      activeId: e.currentTarget.dataset.items[detail.index].children[0].id,
    });
  },
  onClickItem() {

    console.log(this.data.activeId);
  },
  a: function (e) {
    if (e.currentTarget.dataset.item.id === this.data.activeMeal) {
      this.setData({
        activeMeal: ''
      })
    } else {
      this.setData({
        activeMeal: e.currentTarget.dataset.item.id
      })
    }
  },
  b: function (e) {
    if (e.currentTarget.dataset.item.id === this.data.activeMeal) {
      return this.data.mealAnimation.mealAnimationX.show
    } else {
      return this.data.mealAnimation.mealAnimationX.hidden
    }
  },
  c: function (e) {
    if (e.currentTarget.dataset.item.id === this.data.activeMeal) {
      return this.data.mealAnimation.mealAnimationY.show
    } else {
      return this.data.mealAnimation.mealAnimationY.hidden
    }
  },
  selectMeal: function (e) {
    this.a(e)
    this.setData({
      setMeal: !this.data.setMeal,
      initial: false
    })
    let option, optionY;
    option = this.b(e)
    optionY = this.c(e)
    let animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateX(`${option}rpx`).step()
    this.setData({
      animation: animation.export(),
    })
    let animationY = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1000,
      timingFunction: "ease",
      delay: 0
    });
    this.animationY = animationY
    animationY.translateY(`${optionY}rpx`).step()
    this.setData({
      animationY: animationY.export(),
    })
  },
  suggestItem: function (e) {
    let that = this,
      index = e.currentTarget.dataset.index,
      id = e.currentTarget.dataset.id,
      items = that.data.addItem,
      suggestAdd = that.data.suggestAdd,
      val = items[index].checked; //点击前的值

    if (!val) {
      suggestAdd.push(id);
    } else {
      for (let i in suggestAdd) {
        if (suggestAdd[i] == id) {
          suggestAdd.splice(i, 1);
        }
      }
    }
    items[index].checked = !val;
    that.setData({
      addItem: items,
      suggestAdd: suggestAdd,
    })
  },

  seletTime(e) {
    if (e.currentTarget.dataset.item.id === this.data.showTime) {
      this.setData({
        showTime: ''
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
    this.initPet()
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