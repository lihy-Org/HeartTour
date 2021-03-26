// pages/index/index.js
import {
  comboList
} from '../../api/combo';
import {
  config
} from '../../api/config';
import {
  getWorktime
} from '../../api/worktime';
import {
  userList
} from '../../api/user';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    fkStyle: "transform:translateY(-420rpx); -webkit-transform:translateY(-420rpx);z-index:20;padding-bottom:60rpx;",
    options: {
      pic: {
        src: ''
      },
      technicianName: {
        name: '',
        style: 'vertical-align:middle;margin-right:10rpx;'
      },
      sex: 1,
      technicianTitle2: {
        title2: "",
      },
      show: true,
      businessCard: 'businessCard',
      technicianHead: 'technicianHead',
    },
    icon: {
      normal: '../../assets/images/addpets.png',
      active: '../../assets/images/yes.png',
    },
    banners: [{
      image: '../../assets/images/guanggao.png'
    }],
    mealAnimation: {
      mealAnimationX: {
        show: 0,
        hidden: 424
      },
      mealAnimationY: {
        show: 0,
        hidden: -420
      },
    },
    setMeal: false,
    primaryRadio: '',
    secondaryResult: [],
    mockPet: [],
    addItem: [],
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
    initial: false,
    addPetShow: false,
    mainActiveIndex: 0,
    activeId: null,
    items: [],
    //单选宠物
    radio: 0,
    whichPet: [],
    shopName: null,
    petId: '',
    petName: '',
    totalPrice: '0.00',
    zPrice: '',
    fPricr: [],
    // 主套餐，上一次点击的套餐id
    prevRadio: '',
    // 已选中主次套餐信息
    primaryMealMsg: {},
    secondaryMealMsg: [],
    // 门店ID
    storeId: '',
    //美容师ID
    userId: '',
    //传入日期获取排班
    workDay: '',
    //控制上拉套餐列表
    comboListShow: false,
    isSameShop: true

  },
  goMap: function () {
    console.log(this.data.shopName)
    if (this.data.shopName) {
      wx.setStorageSync("shopId", this.data.shopName.id);
    } else {
      wx.setStorageSync("shopId", '');
    }
    wx.setStorageSync('addItem', this.data.addItem);
    wx.setStorageSync('mockPet',this.data.mockPet)
    wx.navigateTo({
      url: '../map/map',
    });
  },
  goAddPet() {
    wx.navigateTo({
      url: '../add-pet/add-pet'
    })
  },
  goDetails() {
    wx.navigateTo({
      url: '../add-pet/add-pet'
    })
  },
  onChangeCheck(event) {
    this.setData({
      primaryRadio: event.detail,
      prevRadio: this.data.primaryRadio
    });
  },
  onChangeCheckBox(event) {
    this.setData({
      secondaryResult: event.detail,
    });
    console.log(this.data.secondaryResult);
  },
  onClickPrimary(event) {
    const {
      id
    } = event.currentTarget.dataset.text;
    if (this.data.primaryRadio === this.data.prevRadio) {
      this.setData({
        primaryRadio: '',
        primaryMealMsg: {}
      });
    } else {
      this.setData({
        primaryRadio: id,
        primaryMealMsg: event.currentTarget.dataset.text
      });
    }
    this.getUserList();
    this.animationTimeAndPerson();
    this.sumPrice(this.data.primaryMealMsg, this.data.secondaryMealMsg)

  },
  onClickSecondary(event) {
    const secondaryArr = []
    const newAddItem = []
    this.data.addItem.forEach(item => {
      if (this.data.secondaryResult.includes(item.id)) {
        item.checked = true
      } else {
        item.checked = false
      }
      newAddItem.push(item)
    })
    this.setData({
      addItem: newAddItem
    })
    this.data.secondaryResult.forEach((item, index) => {
      this.data.addItem.forEach((ele, num) => {
        if (item === ele.id) {
          secondaryArr.push(ele)
        }
      });
    })
    this.setData({
      secondaryMealMsg: secondaryArr,
    })
    this.getUserList();
    this.animationTimeAndPerson();
    this.sumPrice(this.data.primaryMealMsg, this.data.secondaryMealMsg)

  },
  animationTimeAndPerson() {
    this.setData({
      setMeal: !this.data.setMeal,
      initial: false
    })
    let option, optionY;
    option = this.b()
    optionY = this.c()
    console.log(optionY, option);
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
  initPet: function (e) {
    if (e) {
      this.data.items.forEach(item => {
        if (item.text === e.currentTarget.dataset.text) {
          console.log(item.children[0]);
          if (item.children[0].children[0]) {
            console.log(item);
            this.setData({
              whichPet: item.children,
              activeId: item.children[0].children[0].id,
              mainActiveIndex: 0
            })
          }
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
      radio: e.currentTarget.dataset.index
    })
  },
  /* 删除主套餐 */
  delPrmMeal() {
    this.setData({
      primaryRadio: '',
      primaryMealMsg: {}
    });
    this.animationTimeAndPerson()
    this.sumPrice(this.data.primaryMealMsg, this.data.secondaryMealMsg)
    this.isDeleteAll()
  },
  /* 删除单项套餐 */
  delSedmeal(e) {
    let {
      id
    } = e.currentTarget.dataset.text;
    console.log(id);
    let secondaryArr = this.data.secondaryResult
    secondaryArr.forEach((item, index) => {
      if (id === item) {
        secondaryArr.splice(index, 1)
      }
    })
    console.log(secondaryArr)
    this.setData({
      secondaryResult: secondaryArr
    })
    this.onClickSecondary()
    this.isDeleteAll()
  },
  /**
   * 主套餐、单项套餐都被删除完
   * @param prmMealId 主套餐id
   * @param secondaryArr 单项套餐数组(存放的是id)
   */
  isDeleteAll() {
    const prmMealId = this.data.primaryRadio
    const secondaryArr = this.data.secondaryResult
    if (!prmMealId && secondaryArr.length === 0) {
      this.setData({
        comboListShow: false
      })
    }
  },

  /* 结算按钮拉起套餐列表 */
  showComboDes() {
    this.setData({
      comboListShow: true
    })
  },
  addPet: function () {
    this.setData({
      addPetShow: true
    })
  },
  onClose() {
    this.setData({
      addPetShow: false,
      comboListShow: false
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
  onClickItem(e) {
    this.setData({
      petId: e.detail.id,
      petName: e.detail.text,
      addPetShow: false
    })
    this.getComboList()
  },
  b: function () {
    if (this.data.primaryMealMsg.price || this.data.secondaryMealMsg.length > 0) {
      return this.data.mealAnimation.mealAnimationX.show
    } else {
      return this.data.mealAnimation.mealAnimationX.hidden
    }
  },
  c: function () {
    if (this.data.primaryMealMsg.price || this.data.secondaryMealMsg.length > 0) {
      return this.data.mealAnimation.mealAnimationY.show
    } else {
      return this.data.mealAnimation.mealAnimationY.hidden
    }
  },
  /**
   * sumPrice 预约总价
   * @param primaryMealMsg 主套餐信息
   * @param secondaryMealMsg 辅套餐信息
   */
  sumPrice: function (primaryMealMsg, secondaryMealMsg) {
    let sumValueZ = 0,
      sumValueF = 0
    if (primaryMealMsg.price) {
      sumValueZ = Number(primaryMealMsg.price)
    }
    if (secondaryMealMsg.length > 0) {
      for (var i = secondaryMealMsg.length - 1; i >= 0; i--) {
        sumValueF += Number(secondaryMealMsg[i].price);
      }
    }
    const sumValue = sumValueF + sumValueZ
    console.log(sumValue);
    this.setData({
      totalPrice: sumValue
    })
  },
  goMoreTime() {
    wx.navigateTo({
      url: '../more-time/more-time'
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
  getConfig() {
    let that = this;
    config().then(res => {
      if (res.status === 200) {
        let str = JSON.stringify(res.data)
        let result = str.replace(/value/g, 'text');
        let newData = JSON.parse(result)
        that.setData({
          items: newData
        })
        that.initPet();
      }
    })
  },
  getComboList() {
    let that = this;
    console.log(that.data.petId, that.data.storeId);
    comboList({
      storeId: that.data.storeId,
      varietyId: that.data.petId
    }).then(res => {
      let comboZ = [],
        comboC = [];
      if (res && res.status === 200) {
        res.data.forEach(item => {
          if (item.comboType === 0) {
            comboZ.push(item)
          } else if (item.comboType === 1) {
            comboC.push(item)
          }
        })
      }
      console.log(comboC, comboZ);
      let arr = [],
        arrZ = [];
        const getMockPet = wx.getStorageSync('mockPet')
      comboZ.forEach(item => {
        let obj = {
          bgImg: item.bgImg,
          id: item.id,
          originPrice: item.originPrice,
          price: item.salePrice,
          nursingTime: item.nursingTime,
          details1: item.desc,
          name: item.name
        }
        arr.push(obj)
      })
      that.setData({
        mockPet: this.data.isSameShop?arr:getMockPet
      })
      
      const getAddItem = wx.getStorageSync('addItem');
      comboC.forEach(item => {
        let obj = {
          name: item.name,
          price: item.salePrice,
          originPrice: item.originPrice,
          checked: false,
          id: item.id
        }
        arrZ.push(obj)
      })
      that.setData({
        addItem: this.data.isSameShop ? arrZ : getAddItem,
      })
    })
  },
  goPay() {
    wx.navigateTo({
      url: '../confirm-order/confirm-order'
    })
  },
  getUserList() {
    userList({
      storeId: this.data.storeId,
      comboId: this.data.primaryRadio
    }).then(res => {
      if (res && res.status === 200) {
        let item = res.data[0];
        console.log(item);
        let options = {
          pic: {
            src: item.avatar
          },
          technicianName: {
            name: item.name,
            style: 'vertical-align:middle;margin-right:10rpx;'
          },
          sex: item.gender,
          technicianTitle2: {
            title2: ''
          },
          show: true,
          businessCard: 'businessCard',
          technicianHead: 'technicianHead',
        }
        if (item.titles.length > 0) {
          options.technicianTitle2.title2 = item.titles[0].title
        }
        console.log(item.id);
        this.setData({
          options: options,
          userId: item.id
        })
        this.fnWorkTime()
      }
    })
  },
  fnWorkTime() {
    let date = new Date();
    console.log(this.getDate());
    getWorktime({
      storeId: this.data.storeId,
      userId: this.data.userId,
      workDay: this.getDate()
    }).then(res => {
      if (res && res.status === 200) {
        let arrFive = [];
        console.log();
        res.data.forEach(item => {
          if (item.orderId != null) {
            console.log(item);
          }
        })
      }
    })
  },
  //  获取日期  yy-mm-dd
  getDate() {
    let date = new Date();
    let year = date.getFullYear(); //年份
    let month = date.getMonth() + 1; //月份
    month = month < 10 ? ('0' + month) : month;
    let day = date.getDate(); //天
    day = day < 10 ? ('0' + day) : day;
    return year + '-' + month + '-' + day;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getConfig()
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
    let pages = getCurrentPages();
    console.log(pages)
    /**
     * 页面数据回显
     * 如果是路由切换
     * 或者是回到预约页面，需要不改变之前选择的数据
     * 并且将该数据回显用
     * @param nowRouter 当前页面的路由
     * @param bookingRouter 预约页面路由
     * @param canShowRouters 需要做回显的路由，从该路由跳转过来
     * @param prevRouter 从什么路由跳转过来的
    */
      const nowRouter = pages[0].route
      const bookingRouter = 'pages/index/index'
      const prevRouter = pages[0].__displayReporter.showReferpagepath
      // 我的
      // "pages/my-pet/my-pet",
      // "pages/add-pet/add-pet",
      // "pages/more-time/more-time",
      // "pages/select-variety/select-variety",
      // "pages/confirm-order/confirm-order",
      // "pages/map/map",
      // "pages/address-management/address-management",
      // "pages/my-order/my-order",
      // "pages/mine/mine",
      // "pages/goods/goods",
      // "pages/rim/rim",
      // "pages/update-address/update-address"
      const canShowRouters = ['pages/mine/mine.html','pages/confirm-order/confirm-order.html']
      console.log(nowRouter === bookingRouter, canShowRouters.includes(prevRouter), !!this.data.shopName)
      if (prevRouter !== 'pages/map/map.html') {
        if(nowRouter === bookingRouter && canShowRouters.includes(prevRouter) && this.data.shopName) {
          this.setData({
            mockPet:wx.getStorageSync('mockPet'),
            addItem: wx.getStorageSync('addItem'),
            isSameShop: false
          })
        } else {
          this.setData({
            addItem: [],
            mockPet:[],
            isSameShop: true
          })
        }
      }
    console.log(this.data.isSameShop);

    if (this.data.isSameShop) {
      this.setData({
        primaryRadio: '',
        secondaryResult: [],

        addItem: [],
        animation: '',
        showTime: '',
        initial: false,
        addPetShow: false,
        mainActiveIndex: 0,
        activeId: null,
        //单选宠物
        radio: 0,
        petId: '',
        petName: '',
        totalPrice: '0.00',
        zPrice: '',
        fPricr: [],
        // 主套餐，上一次点击的套餐id
        prevRadio: '',
        // 已选中主次套餐信息
        primaryMealMsg: {},
        secondaryMealMsg: [],
        // 门店ID
        storeId: '',
        //美容师ID
        userId: '',
        //传入日期获取排班
        workDay: '',
        //控制上拉套餐列表
        comboListShow: false,
      })
      let animationY = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 0,
        timingFunction: "ease",
        delay: 0
      });
      this.animationY = animationY
      animationY.translateY("-420rpx").step()
      this.setData({
        animationY: animationY.export(),
      })

    }
    let that = this;
    console.log(!!that.data.shopName);
    if (!that.data.shopName) return
    const storeId = that.data.shopName.id;
    if (storeId) {
      that.setData({
        storeId: storeId
      })
      this.getComboList();
    }
    console.log(this.data.primaryRadio);

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorageSync('addItem', this.data.addItem);
    wx.setStorageSync('mockPet',this.data.mockPet)
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