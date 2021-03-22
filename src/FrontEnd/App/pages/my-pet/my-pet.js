// pages/my-pet/my-pet.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {
  myPetsList,
  remove,
  addOrUpdate,
  getPet
} from '../../api/pet';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: []
  },
  getPetsList() {
    myPetsList().then(res => {
      if (res && res.status === 200) {
        let arr = [];
        res.data.forEach(item => {
          let obj = {
            pic: {
              src: item.avatar
            },
            technicianName: {
              name: item.nickname,
              style: "font-size:32rpx;font-weight: bold;"
            },
            technicianTitle2: {
              title2: item.variety,
              style: "margin-bottom:20rpx;font-size:28rpx;"
            },
            technicianTitle3: {
              title3: '节假日要提前需要，宠萌也要干净过节',
            },
            show: false,
            businessCard: 'businessCard',
            technicianHead: 'technicianHead',
            myPet: 'myPet',
            id: item.id
          };
          arr.push(obj)
          this.setData({
            options: arr
          })
        });
      }
    });
  },
    onDesUp(e){
      const {id} = e.currentTarget.dataset;
      wx.navigateTo({
        url:`../add-pet/add-pet?id=${id}`
      });
    },
    onClose(event) {
    const {
      position,
      instance
    } = event.detail;
    const {
      id
    } = event.currentTarget.dataset;
    switch (position) {
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          
          remove({petId: id}).then(res => {
            if (res.status === 200) {
              this.getPetsList();
            }
          })
          instance.close();
        }).catch(() => {
          instance.close();
        });
        break;
    }
  },
  upOrAddPet() {
    wx.navigateTo({
      url: '../add-pet/add-pet',
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
    this.getPetsList();
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