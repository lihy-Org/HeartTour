import Pinyin from '../../utils/pinyin';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
      {name:"PP",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"狐狸呀",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"大重九",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"天九王",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"二娃",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"包雨兮",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"李红耀",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"封宗鑫",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"陈林浩",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"阿尔巴尼亚",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"阿凡达",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"阿童木",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"阿凡提",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},  
      {name:"阿拉斯加",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"我的宠物",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"地址管理",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpgg'},
      {name:"用户协议",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"隐私政策",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"关于我们",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"我的宠物",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"地址管理",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpgg'},
      {name:"用户协议",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"隐私政策",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"关于我们",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"我的宠物",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"地址管理",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpgg'},
      {name:"用户协议",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"隐私政策",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"关于我们",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"我的宠物",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"地址管理",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpgg'},
      {name:"用户协议",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"隐私政策",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"关于我们",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"我的宠物",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"地址管理",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpgg'},
      {name:"用户协议",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"隐私政策",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"关于我们",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"我的宠物",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"地址管理",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpgg'},
      {name:"用户协议",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"隐私政策",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"关于我们",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"我的宠物",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"地址管理",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpgg'},
      {name:"用户协议",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"隐私政策",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"关于我们",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"我的宠物",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"地址管理",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpgg'},
      {name:"用户协议",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"隐私政策",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
      {name:"关于我们",src:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3160107510,784197751&fm=26&gp=0.jpg'},
    ],
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
      o.src = arr[bukn].src
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
        src:item.src
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
    let petName = e.currentTarget.dataset.text;
    let pages =  getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      [`values.breed`] : petName
    }) 
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
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