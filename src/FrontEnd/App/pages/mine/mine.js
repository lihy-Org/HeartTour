Page({
  data: {
    functionalArea:[
      {name:"我的宠物",src:'../../assets/images/dog.png',to:'../my-pet/my-pet'},
      {name:"地址管理",src:'../../assets/images/positioning.png',to:'../address-management/address-management'},
      {name:"用户协议",src:'../../assets/images/userAgreement.png'},
      {name:"隐私政策",src:'../../assets/images/PrivacyPolicy.png'},
      {name:"关于我们",src:'../../assets/images/aboutwe.png'}
    ]
  },
  goMyOrder(){
    wx.navigateTo({
      url: '../my-order/my-order',
    });
  },
  goSelfPage({currentTarget:{dataset:{text,to}}}){
    console.log(text,to)
    switch(text){
      case '我的宠物':
        wx.navigateTo({
          url:to,
        })
        break;
      case '地址管理':
        wx.navigateTo({
          url:to,
        })
        break;
      default:{
        wx.showToast({
          title: '暂时无有',
          icon: 'none',
          duration: 1500,
        });
      }
    }
  }
})