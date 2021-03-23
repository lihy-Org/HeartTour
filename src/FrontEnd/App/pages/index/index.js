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
    options: {
      pic: {
        src: ''
      },
      technicianName: {
        name: '',
        style: 'vertical-align:middle;margin-right:10rpx;'
      },
      sex:1,
      technicianTitle2: {
        title2: "终极美容师",
      },
      show: true,
      businessCard: 'businessCard',
      technicianHead: 'technicianHead',
      abcdef:() => {
        console.log(123123)
      }
    },
    icon:{
      normal: '../../assets/images/dog.png',
      active: '../../assets/images/dengpao.png',
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
    primaryRadio:'',
    secondaryResult: [],
    mockPet: [
      // {
      //   name: '洗护套餐A',
      //   details: '8项护理',
      //   details1: "360°全方位清洁服务360°360°全方位清洁服务360°360°全方位清洁服务360°360°全方位清洁服务360°",
      //   price: '45.00',
      //   id: '1'
      // }
    ],
    addItem: [
      // {
      //   name: '刷牙',
      //   price: `￥45':00`,
      //   id: '1',
      //   checked: ""
      // }
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
    initial: false,
    suggestAdd: [],
    addPetShow: false,
    mainActiveIndex: 0,
    activeId: null,
    items: [],
    radio: 0,
    whichPet: [],
    shopName: null,
    petId:'',
    petName:'',
    totalPrice:'0.00',
    zPrice:'',
    fPricr:[],
    // 主套餐，上一次点击的套餐id
    prevRadio: '',
    // 已选中主次套餐信息
    primaryMealMsg:{},
    secondaryMealMsg:[],
    // 门店ID
    storeId:''
  },
  goToDes(){
    console.log(this.goMap());
  },
  goMap: function () {
      wx.navigateTo({
        url: '../map/map',
      });
  },
  goAddPet() {
    wx.navigateTo({
      url: '../add-pet/add-pet'
    })
  },
  goDetails(){
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
  onChangeCheckBox(event){
    this.setData({
      secondaryResult: event.detail,
    });
    console.log(this.data.secondaryResult);
  },
  onClickPrimary(event) {
    const { id } = event.currentTarget.dataset.text;
    if (this.data.primaryRadio === this.data.prevRadio) {
      this.setData({
        primaryRadio: '',
        primaryMealMsg: {}
      });
    } else {
      this.setData({
        primaryRadio: id,
        primaryMealMsg:event.currentTarget.dataset.text
      });
    }
    this.animationTimeAndPerson();
    this.sumPrice(this.data.primaryMealMsg, this.data.secondaryMealMsg)
  },
  onClickSecondary(event){
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
    console.log(newAddItem)
    this.data.secondaryResult.forEach((item, index) => {
      this.data.addItem.forEach((ele, num) => {
        if(item === ele.id) {
          secondaryArr.push(ele)
        }
      });
    })
    this.setData({
      secondaryMealMsg: secondaryArr,
    })   
    this.animationTimeAndPerson();
    this.sumPrice(this.data.primaryMealMsg, this.data.secondaryMealMsg)
  },
  animationTimeAndPerson(){
    this.setData({
      setMeal: !this.data.setMeal,
      initial: false
    })
    let option, optionY;
    option = this.b()
    optionY = this.c()
    console.log(optionY,option);
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
          if(item.children[0].children[0]){
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
  onClickItem(e) {
    this.setData({
      petId:e.detail.id,
      petName:e.detail.text,
      addPetShow: false
    })
    this.getComboList()
  },
  b: function () {
    if (this.data.primaryMealMsg.price||this.data.secondaryMealMsg.length > 0) {
      return this.data.mealAnimation.mealAnimationX.show
    } else {
      return this.data.mealAnimation.mealAnimationX.hidden
    }
  },
  c: function () {
    if (this.data.primaryMealMsg.price||this.data.secondaryMealMsg.length > 0) {
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
  sumPrice: function(primaryMealMsg, secondaryMealMsg) {
    let sumValueZ = 0, sumValueF = 0
    if (primaryMealMsg.price) {
      sumValueZ = Number(primaryMealMsg.price)
    }
    if (secondaryMealMsg.length > 0) {
      for (var i=secondaryMealMsg.length-1; i>=0; i--) {
        sumValueF += Number(secondaryMealMsg[i].price);
      }
    }
    const sumValue=sumValueF + sumValueZ
    console.log(sumValue);
    this.setData({
      totalPrice:sumValue
    })
  },
  goMoreTime(){
    wx.navigateTo({
      url:'../more-time/more-time'
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
  getConfig(){
    let that = this;
    config().then(res => {
      if (res.status === 200) {
        let str = JSON.stringify(res.data)
        let result = str.replace(/value/g,'text');
        let newData = JSON.parse(result)
        that.setData({
          items:newData
        } )
        that.initPet();
      }
    })
  },
  getComboList(){
     let that = this;
     console.log(that.data.petId,that.data.storeId);
     comboList({storeId:that.data.storeId,varietyId:that.data.petId}).then(res => {
      let comboZ = [],comboC=[];
      if(res&&res.status===200){
        res.data.forEach(item =>{
          if(item.comboType === 0){
            comboZ.push(item)
          }else if(item.comboType === 1){
            comboC.push(item)
          }
        })
      }
      console.log(comboC,comboZ);
      let arr = [], arrZ =[];
      comboZ.forEach(item=>{
        let obj = {
          bgImg:item.bgImg,
          id:item.id,
          originPrice:item.originPrice,
          price:item.salePrice,
          nursingTime:item.nursingTime,
          details1:item.desc,
          name:item.name
        }
        arr.push(obj)
      })
      that.setData({
        mockPet:arr
      })
      comboC.forEach(item=>{
        let obj = {
          name:item.name,
          price:item.salePrice,
          originPrice:item.originPrice,
          checked: false,
          id:item.id
        }
        arrZ.push(obj)
      })
      that.setData({
        addItem:arrZ
      })
      console.log(arrZ);
      console.log(this.data.addItem)
      console.log(comboC,comboZ);
    })
  },
  goPay(){
    wx.navigateTo({
      url:'../confirm-order/confirm-order'
    })
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
    let that = this;
    console.log(!!that.data.shopName);
    if (!that.data.shopName) return
    const storeId  = that.data.shopName.id;
    if(storeId){
      that.setData({
        storeId:storeId
      })
      this.getComboList()
    }
    console.log(storeId);
    userList({storeId:storeId,pageSize:1}).then(res=>{
      if(res&&res.status===200){
        console.log(res.data);
      }
    })
    // getWorktime( {storeId:storeId} ).then(res=>{
    //   if(res.status === 200){
    //     console.log(res);
    //   }
    // }).catch(err=>{
    //   console.log(err);
    // })
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