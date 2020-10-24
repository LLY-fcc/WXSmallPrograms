// pages/index/index.js
const app = getApp();
Page({
    /*点击事件*/
    turnto: function(e) {
      //检查登录态
      wx.checkSession({
        //成功回调
        success: () => {
          if (app.globalData.userInfo) {
            wx.navigateTo({
              url: '../orderpage/orderpage',
            });
          } else {
            wx.switchTab({
              url: '../user/user',
            });
            wx.showToast({
              title: '请先登录！',
              icon: 'none'
            });
          }
        },
        //未登录回调
        fail () {
          wx.login({
            timeout: 0,
            success: (res) => {
              wx.showToast({
                title: '登录成功！',
              })
              wx.navigateTo({
                url: '../orderpage/orderpage',
              })
            },
            fail () {
              wx.showToast({
                title: '登录失败！',
                icon: 'none'
              })
            }
          });
        }
      })
    },

  /**
   * 页面的初始数据
   */
  data: {
    //
    broadcast: '点击轮播图可以查看注意事项哟',
    //轮播图
    banner: ['../../images/banner/1.jpg','../../images/banner/2.jpg','../../images/banner/5.jpg','../../images/banner/3.jpg','../../images/banner/4.jpg'],
    //是否展示左侧按钮
    showNav: false,
    isSuper: false,
    /*设置商家列表*/
    merchant_lists: [{
      _id: '3205',
      name: 'INT打印',
      address: '新校3-205'
    }]
  },
  //客服会话
  turntoCustomer: function (e) {
    wx.navigateTo({
      url: '../im/room/room',
    })
  },
  imageClick:function(e) {
    wx.navigateTo({
      url: '../des/des',
    })
  },
  //调用云函数判断是否为管理员
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
    var that = this;
    var text = ['点击首页轮播图有惊喜！','有问题不要忘记咨询客服!','从这一刻开启便捷生活!','您的支持是我们最大的动力！','发现问题可以向我们反馈哟!','Welcome to INT!','INT一定会更好哒！','图片仅仅支持灰色打印呦!','概率论作业可以备注丫！']
    this.time_2 = setInterval(function () {
      var i = parseInt(Math.random()*9);
      that.setData({
        broadcast: text[i]
      });
      if (that.data.miao == 0) {
        clearInterval(this.time_2);
      }
    },4000)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.time_2);

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.time_2);
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