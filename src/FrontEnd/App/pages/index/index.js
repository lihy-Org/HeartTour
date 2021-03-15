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
        style: 'vertical-align:middle;margin-right:20rpx;'
      },
      technicianTitle: {
        title: '美容之星',
        showTitle: true
      },
      technicianTitle2: {
        title2: "终极美容师",
        // style: 'color:red'
      },
      praise: {
        praise: "好评率100%",
      },
      show: true,
      businessCard: 'businessCard',
      technicianHead: 'technicianHead'
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
      {
        name: '刷牙',
        price: `￥45':00`,
        id: '1',
        checked: ""
      }
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
    items: [],
    radio: 0,
    whichPet: [],
    shopName: null,
    petId:'',
    petName:'',
    totalPrice:'0.00',
    zPrice:'',
    fPricr:[]
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
    console.log(e);
    this.setData({
      petId:e.detail.id,
      petName:e.detail.text,
      addPetShow: false
    })
    this.getComboList()
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
    
    console.log(this.data.activeMeal!==e.currentTarget.dataset.item.id);
    // 主套餐价格
    if(e.currentTarget.dataset.item.id!==this.data.activeMeal){
      this.setData({
        zPrice:e.currentTarget.dataset.item.price
      })
      
    this.sub(e.currentTarget.dataset.item.price,this.data.fPrice)
    }else{
      this.setData({
        zPrice:0
      })
    }
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
  sub:function(priceZ,pirceF){
    let sumValueF = 0
    if(pirceF){
    for (var i=pirceF.length-1; i>=0; i--) {
      sumValueF += Number(pirceF[i]);
    }
    }else{
      sumValueF=0
    }
    const sumValue=sumValueF+Number(priceZ)
    console.log(sumValue);
    this.setData({
      totalPrice:sumValue
    })
  },
  suggestItem: function (e) {
    console.log(e.currentTarget.dataset.item)
    console.log(this.data.addItem);
    wx.nextTick(()=>{
      let priceArr=[];
      this.data.addItem.forEach((item, index)=>{
        if(item.checked){
          priceArr.push(item.price)
        }
      })
    console.log(priceArr);
    this.setData({
      fPrice:priceArr
    })

    this.sub(this.data.zPrice,priceArr)
    });

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
    // let data =  {storeId:that.data.shopName.id,varietyId:that.data.petId}
     comboList().then(res => {
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
        that.setData({
          mockPet:arr
        })
      })
      comboC.forEach(item=>{
        let obj = {
          name:item.name,
          price:item.salePrice,
          originPrice:item.originPrice,
          checked:'',
          id:item.id
        }
        arrZ.push(obj)
        that.setData({
          addItem:arrZ
        })
      })
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
    this.getComboList()
    // if(!that.data.shopName){return}
    // console.log(that.data.shopName.id);
    // const storeId  = that.data.shopName.id;
    // getWorktime(storeId ).then(res=>{
    //   if(res&&res.status === 200){
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