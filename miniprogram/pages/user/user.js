//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎来到INT打印室',
    userInfo: {},
    hasUserInfo: false,
    isSuper: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //导航到商家页面
  turntoMorder: function (e) {
    wx.navigateTo({
      url: '../Morder/Morder',
    });
  },
  //导航到个人信息地址页面
  turntoaddress: function (e) {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../useraddress/useraddress',
      })
    } else (
      wx.showToast({
        title: '请先登录!',
        icon: 'none'
      })
    );
  },
  //导航到个人订单页面
  turntoorder: function (e) {
    if (this.data.hasUserInfo) {
      wx.navigateTo({
        url: '../userorder/userorder',
      })
    } else {
      wx.showToast({
        title: '请先登录!',
        icon: 'none'
      })
    }
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      };
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          });
        },
      });
    };
    //链接云函数，判断是否为商家
    wx.cloud.init({
      env: 'int-print-env-3jd7g'
    });
    wx.cloud.callFunction({
      name: 'callback',
      success: (res) => {
        if (res.result.openid == 'oUjhA5boL9qBKUpu_17q-0VmT-SQ') {
          this.setData({
            isSuper: true
          });
        };
      }
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
