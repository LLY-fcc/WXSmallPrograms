// miniprogram/pages/userorder/userorder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //展示导航栏左侧图标
    showNav: true,
    hasOrder: false,
    hasHisOrder: false,
    text: '您还没有下过单哟',
    owenOrder: [],
    owenHisOrder: [],
    //按钮参数
    color: 'primary',
    hasAgree: false,
    des_button: '订阅通知消息',
    //页面参数
    pageindex: 1,
    isCurrent:1
  },
  //订单切换
  navOne:function(e) {
    this.setData({
      pageindex: 1,
      isCurrent: 1
    })
  },
  navTwo:function(e) {
    this.setData({
      pageindex: 2,
      isCurrent: 2
    })
  },
  //订阅通知消息
  onbindButton: function(e) {
    var index = e.currentTarget.dataset.index;
    wx.requestSubscribeMessage({
      tmplIds: ['8T3VzrI6YR95MegXvQlXnj5wp6N_wR2dbmVIujmqopY','8T3VzrI6YR95MegXvQlXnj5wp6N_wR2dbmVIujmqopY'],
      success: (res) => {
        var para_1 = this.data.owenOrder[index].hasAgree;
        var para_2 = this.data.owenOrder[index].color;
        var para_3 = this.data.owenOrder[index].des_button;
        this.setData({
          para_1: true,
          para_2: 'default',
          para_3: '已定阅'
        })
      }
    })
  },
  getOrderInfo:function () {
    wx.cloud.init({
      env: 'int-print-env-3jd7g'
    });
    //调用云函数获取openid
    wx.cloud.callFunction({
      name: 'callback',
      success: (res) => {
       let openid = res.result.openid;
       this.setData({
         openid: openid
       })
      },
      fail: (err) => {
        console.log(err)
      }
    });
    var _that = this;
    var db = wx.cloud.database();
    const _ = db.command;
    db.collection('orderforms').where({
      _openid: this.data.openid,
      order_status_tag: _.or('0','1')
    }).get({
      success: (res) => {
        this.setData({
          owenOrder: res.data,
        });
        if (res.data.length != 0) {
          this.setData({
            hasOrder: true
          })
        } else {
          this.setData({
            hasOrder: false
          })
        }
      },
      fail: () => {
        this.setData({
          hasOrder: false
        })
      }
    });
    db.collection('orderforms').where({
      _openid: this.data.openid,
      order_status_tag: _.or('2','3')
    }).get({
      success: (res) => {
        this.setData({
          owenHisOrder: res.data,
        });
        if (res.data.length != 0) {
          this.setData({
            hasHisOrder: true
          })
        } else {
          this.setData({
            hasHisOrder: false
          })
        }
      },
      fail: () => {
        this.setData({
          hasHisOrder: false
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderInfo();
    wx.stopPullDownRefresh({
      success: (res) => {},
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
    this.onLoad()
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