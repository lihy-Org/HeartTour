// pages/add-pet/add-pet.js
import {addOrUpdate,getPet} from '../../api/pet'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    radio: {
      gender: [// 性别
        { label: '妹妹',value:2 },
        { label: '弟弟', value:1},
      ],
      sterilization: [// 是否绝育
        { label: '已绝育', value: 1 },
        { label: '未绝育', value: 0 },
      ],
      // vaccine: [// 是否绝育
      //   { label: '已打疫苗', value: 1 },
      //   { label: '未打疫苗', value: 0 },
      // ],
      shoulderHeight: [// 品级
        { label: '<35cm' },
        { label: '>35cm' },
      ]
    },
    show: false, // 日期选择器
    files: [], // 头像文件
    petImageFiles: [], // 宠物图片上传
    isEditAvatar: false,
    isAdd: 1,
    values: {
      avatar:'',
      petId: '',
      nickname: '',    
      gender: '',
      color:'',
      birthday: '',
      shoulderHeight: '',
      is_sterilization: '',
      varietyId:'',
      remark:'',
      variety:''
    },
    breed: '',
    desId:''
  },
  //获取宠物详情
  getDes(){
    let id = this.data.desId;
    getPet(id).then(res=>{
      if(res&&res.status === 200){
        console.log(res.data);
        this.setData({
           values:res.data,
           [`values.birthday`]:res.data.birthday.slice(0,10),
           [`values.petId`]:res.data.id
         })
      }   
    })
  },
  _checkForm() {
    return new Promise(resolve => {
      const { values: { nickname, gender,variety } } = this.data;
      let errMsg = '';
      switch (true) {
        // case files.length < 1:
        case !nickname:
          errMsg = '请填写宠物昵称';
          break;
        case !this.data.breed&&!variety:
          errMsg = '请填写宠物品种';
          break;
        case !gender:
          errMsg = '请选择宠物性别';
          break;
      }
      if (errMsg) {
        wx.showToast({
          title: errMsg,
          icon: 'none'
        })
      } else {
        resolve();
      }
    })
  },
  // 单选框切换
  onRadioChange({ detail: { value, key } }) {
    this.setData({
      [`values.${key}`]: value
    })
  },
    // 处理输入
    onInput({ currentTarget: { dataset: { key } }, detail: { value } }) {
      this.setData({
        [`values.${key}`]: value
      })
    },
    toSelectPet:function(){
      wx.navigateTo({
        url: '../select-variety/select-variety',
      });
    },
    onFilesAfterRead(event) {
      const { file } = event.detail;
      console.log(file)
      this.setData({
        files: [ { url: file.path }],
        isEditAvatar: true
      });
    },
    onDelete() {
      this.setData({
        files: []
      })
    },
      // 显示日期拾取器
  onShowPicker(event) {
    this.pickerKey = event.currentTarget.dataset.key;
    this.setData({
      show: true
    })
  },
  // 日期拾取器值变化
  onPickerChange({ detail: { day, month, year } }) {
    this.setData({
      [`values.${this.pickerKey}`]: `${year}-${month}-${day}`
    })
  },
  onAddPets() {
    let data = this.data.values;
    console.log(data);
    this._checkForm().then(() => {
      addOrUpdate(data).then(res=>{
        if(res&&res.status === 200){
          wx.showToast({
            title:'添加成功',
            icon:'none'
          }),
          wx.navigateTo({
            url:'../my-pet/my-pet'
          })
        }
      })

    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      desId:options.id
    })
    this.getDes();
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
    console.log(this.data.values.petId);
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