// pages/map/map.js
import {
  storeList
} from '../../api/map';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    makers: [],
    myLatitude: null,
    myLongitude: null,
    activeId: null,
    items: [{
      text: '成都',
    }, ],
    shopName: ''
  },
  /**
   * 计算两点间直线距离
   * @param a 表示纬度差
   * @param b 表示经度差
   * @return 返回的是距离，单位m
   */
  getDistance(latFrom, lngFrom, latTo, lngTo) {
    var rad = function (d) { //计算角度
      return d * Math.PI / 180.0;
    }
    var EARTH_RADIUS = 6378136.49;
    var radLatFrom = rad(latFrom);
    var radLatTo = rad(latTo);
    var a = radLatFrom - radLatTo;
    var b = rad(lngFrom) - rad(lngTo);
    var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLatFrom) * Math.cos(radLatTo) * Math.pow(Math.sin(b / 2), 2)));
    distance = distance * EARTH_RADIUS;
    distance = Math.round(distance * 10000) / 10000000;
    distance = distance.toFixed(1)
    return distance
  },

  tapPet(e) {
    let name = e.currentTarget.dataset.text;
    let pages = getCurrentPages();
    let prevPages = pages[pages.length - 2];
    prevPages.setData({
      shopName: name
    });
    wx.navigateBack({
      delta: 1
    });
  },
  compare(key) {
    return function (obj1, obj2) {
      if (Number(obj1[key]) < Number(obj2[key])) {
        return -1
      } else if (obj1[key] === obj2[key]) {
        return 0
      } else {
        return 1
      }
    }
  },

  onLoad: function () {
    let that = this;
    storeList().then(res => {
      if (res && res.status === 200) {
        let arr = [];
        res.data.forEach(item => {
          let obj = {
            iconPath: '../../assets/images/1.png',
            width: 20,
            height: 20,
            kilo: '',
            ass: item.address,
            hourEnd: item.businessHourEnd,
            hourStart: item.businessHourStart,
            latitude: item.lat,
            longitude: item.lng,
            name: item.name,
            id:item.id
          }
          arr.push(obj)
          that.setData({
            makers: arr
          })
        });
      }
    });
      wx.getLocation({
        success: function (res) {
          that.setData({
            myLatitude: res.latitude,
            myLongitude: res.longitude
          })
          let shops = that.data.makers.map(item => {
            item.kilo = that.getDistance(Number(that.data.myLatitude), Number(that.data.myLongitude), Number(item.latitude), Number(item.longitude))
            return item
          })
          shops.sort(that.compare('kilo'))
          that.setData({
            makers: shops
          })
        }
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