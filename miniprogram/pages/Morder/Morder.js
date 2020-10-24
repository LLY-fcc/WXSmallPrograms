// miniprogram/pages/Morder/Morder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //展示导航栏左侧图标
    showNav: true,
    hasorder: false,
    //展示设置
    orderstatus: 0,
    isCurrent: 1,
    orders: [],
    makeorders: [],
    disorders: [],
    madeorders: [],
    //关于按钮的状态
    hasAgree: false,
    des_0_0: '接单',
    des_0_1: '退单',
    des_1_0: '制作完成',
    hasMake: false
  },
  //按钮操作
  //制作完成
  onMake:function(e) {
    var index = e.currentTarget.dataset.index;
    var info = this.data.makeorders;
    var _that = this;
    wx.cloud.init({
      env: 'int-print-env-3jd7g'
    });
    //更新数据库订单的状态(微信小程序前端无权限，改为云函数)
    wx.cloud.callFunction({
      name: 'updataDb',
      data: {
        _indexValue: info[index]._id,
        _updateValue_1: '3',
        _updateValue_2: '订单制作完成'
      },
      success: function(res) {
        if (res.result != 0) {
          wx.cloud.callFunction({
            name: 'sendNote',
            data: {
              phone: info[index].user_phone,
              para_1: info[index].user_name + '同学',
              para_2: info[index].order_serial_number,
              tId: '748700'
            },
            sucess: (res) => {
              wx.showToast({
                title: '短信发送成功',
                icon: 'success'
              })
            }
          })
          wx.cloud.callFunction({
            name: 'sendMessage',
            data: {
              _openid: info[index]._openid,
              _tId: '8T3VzrI6YR95MegXvQlXnj5wp6N_wR2dbmVIujmqopY',
              _data: {
                character_string1:{
                  value:  info[index]._id
                },
                phrase2: {
                  value: '订单已完成'
                },
                thing3: {
                  value: '订单完成,请等待投递员联系,凭取件码取件'
                },
                thing4: {
                  value: '新校3-205'
                },
                character_string5: {
                  value: info[index].order_serial_number
                }
              }
            },
            success: (res) =>  {
              var newinfo = info.splice(index,1)
              _that.setData({
                orders: newinfo
              });   
              wx.showToast({
                title: '消息发送成功!',
                icon: 'success'
              });
            _that.onPullDownRefresh();
            },
            fail: (err) => {
              wx.showToast({
                title: '消息发送失败',
                icon: 'none'
              })
            }
          });
        } else {
          wx.showToast({
            title: '数据库更改失败',
            icon: 'none'
          })
        }
      },
    });
  },
  //拒单
  onDisagree:function(e) {
    var index = e.currentTarget.dataset.index;
    var info = this.data.orders;
    var _that = this;
    wx.cloud.init({
      env: 'int-print-env-3jd7g'
    });
    //更新数据库订单的状态(改为云函数)
    wx.cloud.callFunction({
      name: 'updataDb',
      data: {
        _indexValue: info[index]._id,
        _updateValue_1: '2',
        _updateValue_2: '商家已拒单'
      },
      success: function(res) {
        wx.cloud.callFunction({
          name: 'sendMessage',
          data: {
            _openid: info[index]._openid,
            _tId: '8T3VzrI6YR95MegXvQlXnj5wp6N_wR2dbmVIujmqopY',
            _data: {
              character_string1:{
                value:  info[index]._id
              },
              phrase2: {
                value: '商家已拒单'
              },
              thing3: {
                value: '抱歉!由于设备原因不能接受订单'
              },
              thing4: {
                value: '新校3-205'
              },
              character_string5: {
                value: info[index].order_serial_number
              }
            }
          },
          success: (res) =>  {
            wx.showToast({
              title: '拒单成功!',
              icon: 'success'
            });
            //重写本地数据
            var newinfo = info.splice(index,1)
            _that.setData({
              orders: newinfo
            });
            _that.onPullDownRefresh();
          },
          fail: (err) => {
            wx.showToast({
              title: '消息发送失败',
              icon: 'none'
            })
          }
        });
      },
    });
  },
  //接单
  onAgree:function(e) {
    var index = e.currentTarget.dataset.index;
    var info = this.data.orders;
    var _that = this;
    wx.cloud.init({
      env: 'int-print-env-3jd7g'
    });
    //更新数据库订单的状态(小程序端无权限，改为云函数)
    wx.cloud.callFunction({
      name: 'updataDb',
      data: {
        _indexValue: info[index]._id,
        _updateValue_1: '1',
        _updateValue_2: '商家已接单'
      },
      success: function(res) {
        if (res.result != 0) {
          wx.cloud.callFunction({
            name: 'sendMessage',
            data: {
              _openid: info[index]._openid,
              _tId: '8T3VzrI6YR95MegXvQlXnj5wp6N_wR2dbmVIujmqopY',
              _data: {
                character_string1:{
                  value:  info[index]._id
                },
                phrase2: {
                  value: '商家已接单'
                },
                thing3: {
                  value: '订单已接收，请您等待商家短信通知取件'
                },
                thing4: {
                  value: '新校3-205'
                },
                character_string5: {
                  value: info[index].order_serial_number
                }
              }
            },
            success: (res) =>  {
              var newinfo = info.splice(index,1)
              _that.setData({
                orders: newinfo
              });
              wx.showToast({
                title: '接单成功!',
                icon: 'success'
              });
              _that.onPullDownRefresh();
            },
            fail: (err) => {
              wx.showToast({
                title: '消息发送失败',
                icon: 'none'
              })
            }
          });
        }
      },
    });
  },
  //从数据库读取数据
  getOrderInfo:function () {
    wx.cloud.init({
      env: 'int-print-env-3jd7g'
    });
    const db = wx.cloud.database();
    var _that = this;
    //未接单数据
    db.collection('orderforms').where({
      order_status_tag: '0'
    }).get({
      success:function(res) {
        _that.setData({
          orders: res.data,
          hasorder: true
        });
      }
    });
    //已经接单数据
    db.collection('orderforms').where({
      order_status_tag: '1'
    }).get({
      success:function(res) {
        _that.setData({
          makeorders: res.data,
          hasorder: true
        });
      }
    });
    //退单数据
    db.collection('orderforms').where({
      order_status_tag: '2'
    }).get({
      success:function(res) {
        _that.setData({
          disorders: res.data,
          hasorder: true
        });
      }
    });
    //制作完成数据
    db.collection('orderforms').where({
      order_status_tag: '3'
    }).get({
      success:function(res) {
        _that.setData({
          madeorders: res.data,
          hasorder: true
        });
      }
    });
  },
  //导航栏按钮功能
  navZero:function(e) {
    this.setData({
      orderstatus: 0,
      isCurrent: 1
    })
  },
  navOne:function(e) {
    this.setData({
      orderstatus: 1,
      isCurrent: 2
    })
  },
  navTwo:function(e) {
    this.setData({
      orderstatus: 2,
      isCurrent: 3
    })
  },
  navThree:function(e) {
    this.setData({
      orderstatus: 3,
      isCurrent: 4
    })
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
    this.onLoad();
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