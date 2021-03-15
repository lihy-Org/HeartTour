import {
  login,
  edit,
  editPhone
} from '../../api/user'
import eventBus from '../../utils/eventBus'
var appInst = getApp();

Page({
  _login() {
    return new Promise((resolve, reject) => {
      // 如果token不存在，说明该用户还没有注册
      if (!wx.getStorageSync("token")) {
        wx.login({
          complete: (res) => {
            console.log(res);
            if (res.errMsg === 'login:ok') {
              // 调用登录接口
              login(res.code).then(response => {
                console.log(response)
                if (response.status === 200) {
                  const {
                    isBindPhone,
                    token
                  } = response.data;
                  // 存储token
                  wx.setStorageSync("token", token);
                  // 存储手机号绑定状态
                  appInst.globalData.isBindPhone = isBindPhone;
                  resolve();
                } else {
                  reject();
                }
              }).catch(err => {
                console.log(err);
              })
            } else {
              reject();
            }
          },
        });
      } else {
        resolve();
      }
    })
  },
  // 绑定手机号
  onGetPhoneNumber({
    detail: {
      encryptedData,
      iv,
      errMsg
    }
  }) {
    console.log(encryptedData,iv,errMsg);
    if (/ok/.test(errMsg)) {
      editPhone({
        iv: encodeURIComponent(iv),
        encryptedData: encodeURIComponent(encryptedData),
      }).then(() => {
        eventBus.$emit('PHONE_CHANGE');
        appInst.globalData.isBindPhone = 1;
      })
    } else {
      console.log('获取失败');
    }
  },
  onGetUserInfo({
    detail
  }) {
    if (/ok/.test(detail.errMsg)) { // 成功授权
      this._login().then(() => {
        const {
          avatarUrl,
          nickName
        } = detail.userInfo;
        edit({
          nickname: nickName,
          avatar: avatarUrl
        }).then(() => {
          appInst.globalData.isAuth = true;
          eventBus.$emit('LOGGED');
          wx.switchTab({
            url: '../index/index',
          });
        })
      })
    } else {
      // 拒绝授权
      console.log('用户拒绝获取用户信息');
    }
  },
  onNoLogin() {
  },
  onPush({
    currentTarget: {
      dataset: {
        path
      }
    }
  }) {
    wx.navigateTo({
      url: path,
    })
  }
})