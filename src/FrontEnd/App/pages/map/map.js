// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    makers: [{
        latitude: 30.5702,
        longitude: 104.06476,
        iconPath: '../../assets/images/1.png',
        width: 20,
        height: 20
      },
      {
        latitude: 30.616867,
        longitude: 104.09948,
        iconPath: '../../assets/images/1.png',
        width: 20,
        height: 20
      }
    ]
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
    distance = Math.round(distance * 10000) / 10000;
    distance = distance.toFixed(1) + 'km'
    return distance
  },

  onLoad: function () {
    let latitude, longitude;
    wx.getLocation({
      success: function (res) {
        latitude = res.latitude;
        longitude = res.longitude;
        console.log(latitude, longitude)
      }
    });
    console.log(this.getDistance(30.5702, 104.06476, 30.616867,104.09948));
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