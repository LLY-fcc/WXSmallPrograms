// miniprogram/pages/useraddress/useraddress.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //底部信息提示
    hasissue: false,
    tips: '',
    //展示导航栏左侧图标
    showNav: true,
    button: '发送验证码',
    hasCurrent: false,
    isDisabled: false,
    randCode: 'aaaa',
    hasAddressInfo: true,
    options: [{
      dormitory_id: '001',
      dormitory_name: '新校-1号宿舍'
    }, {
      dormitory_id: '002',
      dormitory_name: '新校-2号宿舍'
    }, {
      dormitory_id: '003',
      dormitory_name: '新校-3号宿舍'
    },{
      dormitory_id: '004',
      dormitory_name: '新校-4号宿舍'
    },{
      dormitory_id: '005',
      dormitory_name: '新校-5号宿舍'
    }
  ],
  userInfo: {
    username: '',
    userphone: '',
    address: '',
    address_index: '000',
    register_time: '',
    weixin_name: ''
  },
  _userInfo: {
    username: '',
    userphone: '',
    address: ''
  }
  },
  //姓名正则表达式
  nameTest: function (e) {
    var _name = e.detail.value;
    if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(_name))) {
      this.setData({
        hasissue: true,
        tips: '姓名有误'
      })
      } else {
        this.setData({
          'userInfo.username': _name,
          hasissue: false,
        })
      }
  },
  //手机号正则表达式
  phoneTest: function (e) {
    var _phone = e.detail.value
    if (!(/^((13[0-9])|(14[0-9])|(15[0-9])|(17[0-9])|(18[0-9]))\d{8}$/.test(_phone))) {
      this.setData({
        hasissue: true,
        tips: '手机号码有误'
      })
      } else {
        this.setData({
          'userInfo.userphone': _phone,
          hasissue: false,
        })
      }
  },
  //发送验证码
  sendVCode: function (e) {
    const _phone = this.data.userInfo.userphone;
    if (_phone) {
      //生成验证码
      var rand = Math.random();
      var randCode = Math.floor(rand*10000);
      this.setData({
        randCode: randCode.toString()
      });
      //设置五分钟定时重置randCode
      var that = this
      setTimeout(function () {that.setData({randCode: 'aaaa'})},5*60*1000);
      //初始化云环境，全局仅仅需要一次
      wx.cloud.init({
        env: 'int-print-env-3jd7g'
      });
      wx.cloud.callFunction({
        name: 'sendNote',
        data: {
          phone: _phone,
          para_1: this.data.randCode,
          para_2: "5",
          tId: "744615"
        },
        success: (res) => {
          console.log(res)
          if (res.result.tar == 1) {
            wx.showToast({
              title: '短信发送成功',
              icon: 'success'
            });
            //短信发送成功后设置倒计时
            function sendCode() {
              that.setData({
                isDisabled: true
              })
              var timer_num = 60;
              var timeClock;
              timeClock=setInterval(function(){
                  timer_num--;
                  var text = '(' + timer_num + ')'
                  //引用that
                  that.setData({
                    button: text
                  })
                  if (timer_num == 0) {
                      clearInterval(timeClock);
                      that.setData({
                        button: '获取验证码',
                        isDisabled: false
                      })
                  } 
              },1000)
          };
          sendCode();        
          } else if (res.result.tar == 0){
            wx.showToast({
              title: '短信发送失败',
              icon:'none'
            })
          };
        },
        fail: () => {
          wx.showToast({
            title: '系统错误，稍后再试',
            icon: 'none'
          })
        }
      })
    } else {
      this.setData({
        hasissue: true,
        tips: '请检查手机号码！'
      })
    }
  },
  //验证码测试
  vcodeTest: function (e) {
    var _vcode = e.detail.value;
    var vcode = this.data.randCode;
    if (_vcode == vcode) {
      this.setData({
        hasCurrent: true,
        hasissue: false
      })
    } else {
      this.setData({
        hasissue: true,
        tips: '验证码错误'
      })
    }
  },
  //下拉框提示框
  onselectChange: function (e) {
    var _index = e.detail.id,_address = e.detail.name;
    if (_index == '000') {
      this.setData({
        'userInfo.address_index': _index,
        'userInfo.address': ''
      })
  } else {
    wx.showToast({
      title: _index + _address,
      icon: 'success'
    });
    this.setData({
      'userInfo.address': _address,
      'userInfo.address_index': _index
    })
  }},
  //提交表单信息时
  onsubmit: function (e) {
        //日期
        var date = new Date();
        var _date = date.toISOString().replace(/T.*/,' ')+date.toLocaleTimeString().replace(/ G.*/,"");
        this.setData({
          'userInfo.register_time': _date,
          'userInfo.weixin_name': app.globalData.userInfo.nickName
        });
        //实例化本低user对象
        const user_info = this.data.userInfo;
        if (!user_info.username) {
          this.setData({
            hasissue: true,
            tips: '请检查姓名!'
          })
        } else if (!user_info.userphone) {
          this.setData({
            hasissue: true,
            tips: '请检查手机号码!'
          })
        } else if (!this.data.hasCurrent) {
          this.setData({
            hasissue: true,
            tips: '验证码错误！'
          })
        } else if (user_info.address_index == '000') {
          this.setData({
            hasissue: true,
            tips: '请检查宿舍！'
          })
        } else {
          this.setData({
            hasissue: false
          })
          //一切验证完毕的处理，初始化云后端
          wx.cloud.init({
            env: 'int-print-env-3jd7g'
          });
          //上传数据到数据库
          //初始化数据库
          const db = wx.cloud.database({
            env: 'int-print-env-3jd7g'
          });
          //初始化集合
          const users = db.collection('users');
          users.add({
            data: this.data.userInfo,
            success: (res) => {
              //插入成功后
              wx.showToast({
                title: '保存成功！',
                icon: 'success'
              });
              //页面重载
              wx.startPullDownRefresh({
                success: (res) => {},
              })
            },
            fail:(err) => {
              wx.showToast({
                title: '保存失败，稍后再试!',
                icon: 'none'
              })
            }
          })
        }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从云函数获取openid
    wx.cloud.init({
      env: 'int-print-env-3jd7g'
    });
    var openid = ''
    wx.cloud.callFunction({
      name: 'callback',
      success: (res) => {
         openid = res.result.openid
      }
    });
    //调用云API查询数据
    const db = wx.cloud.database({
      env: 'int-print-env-3jd7g'
    });
    const users = db.collection('users')
    var that = this
    users.where({
      _openid: openid
    }).get({
      success: function (res) {
        var data = res.data[0]
        if (data) {
          that.setData({
            '_userInfo.username': data.username,
            '_userInfo.userphone': data.userphone,
            '_userInfo.address': data.address,
            hasAddressInfo: true
          })
        } else {
          that.setData({
            hasAddressInfo: false
          })
        }
      },
    fail:function (err){

    }
    });
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