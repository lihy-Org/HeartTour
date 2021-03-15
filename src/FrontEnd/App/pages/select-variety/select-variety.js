import Pinyin from '../../utils/pinyin';
import {
  config
} from '../../api/config';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    bbb:[],
    indexList: [],
  },
  pinyinSort:function(name, arr) {
    var pinyinArray = new Array()
    for (var bukn = 0; bukn < name.length; bukn++) {
      var o = new Object()
      var ken = Pinyin.getSpell(name[bukn], function (charactor, spell) {
        return spell[1];
      });
      o.name = name[bukn]
      o.pinyin = ken.split(',').join('')
      o.src = arr[bukn].src,
      o.petId =arr[bukn].petId
      pinyinArray.push(o)
    }
    // pinyinArray = pinyinArray.sort(compare("pinyin"))
    let map = {
      title: '',
      datas: []
    }
    pinyinArray.forEach((item, index) => {
      if (!map[item.pinyin[0].toUpperCase()]) {
        map[item.pinyin[0].toUpperCase()] = {
          title: item.pinyin[0].toUpperCase(),
          datas: []
        }
      }
      map[item.pinyin[0].toUpperCase()].datas.push({
        name: item.name,
        pinyin: item.pinyin,
        src:item.src,
        petId:item.petId
      })
    }
    )
    var turn = new Array()
    var letters = "*ABCDEFGHIJKLNMOPQRSTUVWXYZ".split('');
    for (var i = 1; i < letters.length; i++) {
      if (map[letters[i]]) {
        var obj = new Object()
        //自己改改命名改成自己需要的
        obj.title = letters[i]
        obj.datas = map[letters[i]].datas
        turn.push(obj)
      }
    }
    return turn;
  },
  petName:function(e){
    let petName = e.currentTarget.dataset.text.name;
    let pages =  getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      [`values.breed`] : petName,
      petId:e.currentTarget.dataset.text.petId
    }) 
    wx.navigateBack({
      delta: 1
    });
  },
  getConfig(){
    let that = this;
    config().then(res => {
      if (res.status === 200) {
        let arr1 = [];
        res.data.forEach(item=>{
          item.children.forEach(item=>{
            item.children.forEach(item=>{
              let obj = {
                name:item.value,
                src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg',
                petId:item.id
              }
              arr1.push(obj);
              that.setData({
                items:arr1
              })
            })
          })     
        })
        let aaa = this.data.items.map(item=>item.name);
        let indexData = that.pinyinSort(aaa, this.data.items);
        let arr = []
        indexData.forEach(element => {
          arr.push(element.title)
        }); 
        this.setData({
          bbb:indexData,
          indexList:arr
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getConfig();
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