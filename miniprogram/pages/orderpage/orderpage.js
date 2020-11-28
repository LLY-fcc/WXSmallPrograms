// pages/orderpage/orderpage.js
const app = getApp()
Page({
  data: {
    //展示左侧导航按钮
    showNav: true,
    imgLists: [],
    fileLists: [],
    orderInfo: {
      order_status: '等待商家接单',
      order_comment: '',
      order_status_tag:'0',
      order_index: '',
      order_address: '',
      order_serial_number: '',
      user_name: '',
      user_phone: '',
      order_date: '',
      order_sum: '',
      print_num: '',
      img_num: '',
      file_num: '',
      price: '',
      timestamp: '',
      file_id_list: null
    },
    price: 0.2,
    num: 1,
    //底部弹窗标志
    showModalStatus: false,
    //用户地址信息
    hasSetInfo: false,
    hasUserInfo: true,
    userInfo: [],
    //商标图片
    trademark_image_url: 'cloud://int-print-env-3jd7g.696e-int-print-env-3jd7g-1302671499/merchant_trade_mark_image/AI1.jpg',
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
  ]
  },
    //立即下单！！！
    PAY: function (e) {
      //关键信息判断
      if (!this.data.hasSetInfo) {
        wx.showToast({
          title: '请选择地址',
          icon:  'none'
        })
      } else {
        //生成序列号
        var _img = this.data.imgLists.length;
        var _file = this.data.fileLists.length;
        if (_img == 0 && _file == 0) {
          var num = '2';
        } else if (_img == 0 && _file != 0) {
          var num = '0'
        } else if (_img != 0 && _file == 0) {
          var num = '1'
        };
        var _p = this.data.orderInfo.user_phone;
        var _i = this.data.orderInfo.order_index;
        //序列号
        var _order_serial_number = _i.substr(2,1) + '-' + num + '-' + _p.substr(7,4);
        //日期
        var date = new Date();
        var _data = date.toISOString().replace(/T.*/,' ')+date.toLocaleTimeString().replace(/ G.*/,"")
        //num
        var _num = this.data.num;
        this.setData({
          'orderInfo.order_serial_number': _order_serial_number,
          'orderInfo.order_date': _data,
          'orderInfo.print_num': _num.toString(),
          'orderInfo.order_sum': (_img + _file).toString(),
          'orderInfo.img_num': _img.toString(),
          'orderInfo.file_num': _file.toString(),
          'orderInfo.price': this.data.price.toString()
        });
        //挑起申请模板消息授权
        wx.requestSubscribeMessage({
          tmplIds: ['8T3VzrI6YR95MegXvQlXnj5wp6N_wR2dbmVIujmqopY','8T3VzrI6YR95MegXvQlXnj5wp6N_wR2dbmVIujmqopY'],
          success: (res) => {
            //初始化cloudAPI
            wx.cloud.init({
            env: 'int-print-env-3jd7g'
            });
            var that = this;
            var files = this.data.fileLists;
            var imgs = this.data.imgLists;
            //定义文件id列表
            //var id_list = []
            if (files.length  != 0) {
              for (var i = 0;i<files.length;i++) {
                wx.cloud.uploadFile({
                  cloudPath: 'user_upload_files/' + that.data.orderInfo.user_name + '/file_' + i + '_' + files[i].name,
                  filePath: files[i].path,
                  config: {
                    env: 'int-print-env-3jd7g'
                  },
                  success: (res) => {
                    //id_list.push(res.fileID);
                    if (i == (files.length - 1)) {
                      wx.showToast({
                        title: i +'份文件上传成功!',
                        icon: 'success'
                      });
                    };
                  },
                  fail (err) {
                    wx.showToast({
                      title: '上传第'+(i+1)+'个文件失败!',
                      icon: 'none'
                    })
                  }
                })
              }
            };
            if (imgs != 0) {
              for (var i = 0;i<imgs.length;i++) {
                wx.cloud.uploadFile({
                  cloudPath: 'user_upload_files/' + that.data.orderInfo.user_name + '/img_' + i + '.jpg',
                  filePath: imgs[i],
                  config: {
                    env: 'int-print-env-3jd7g'
                  },
                  success: (res) => {
                    //id_list.push(res.fileID)
                    if (i == (imgs.length - 1)) {
                      wx.showToast({
                        title: i +'张图片上传成功!',
                        icon: 'success'
                      });
                    };
                  },
                  fail() {
                    wx.showToast({
                      title: '上传第' + i + '张图片失败！',
                      icon: 'none'
                    })
                  }
                });
              }
            };
            //写回数据
            //this.setData({
              //'orderInfo.file_id_list': id_list
            //});
            var orderforms = wx.cloud.database().collection('orderforms');
            //向数据库传送数据
            orderforms.add({
              data: this.data.orderInfo,
              success: (res) => {
                var info = this.data.orderInfo;
                //发送邮件给商家
                wx.cloud.callFunction({
                  name: 'sendEmail',
                  data: {
                    o_s_n: info.order_serial_number,
                    u_n: info.user_name,
                    u_p: info.user_phone,
                    p_n: info.print_num,
                    o_d: info.order_date,
                    _p: info.price
                  }
                });
                //插入数据成功后执行的操作
                wx.showToast({
                  title: '下单成功!',
                  icon: 'none',
                  delay: 3000
                });
                wx.navigateTo({
                  url: '../userorder/userorder',
                });
              },
              fail: (err) => {
                //失败后执行的操作
                console.log(err)
                wx.showToast({
                  title: '下单失败，请稍后尝试',
                  icon: 'none'
                });
              },
            });
          },
        });
      }
      //else到此结束
    },
  //添加地址
  gotoAddAddress: function () {
    wx.navigateTo({
      url: '../useraddress/useraddress',
    })
  },
  //单选按钮选择地址
  radioChange: function (e) {
    var data = this.data.userInfo[e.detail.value]
    this.setData({
      'orderInfo.order_address': data.address,
      'orderInfo.user_phone': data.userphone,
      'orderInfo.user_name': data.username,
      'orderInfo.order_index': data.address_index,
      hasSetInfo: true
    });
    wx.showToast({
      title: data.address+'!',
      icon: 'success'
    })
  },
  //设置备注
  setComment: function (e) {
    this.setData({
      'orderInfo.order_comment': e.detail.value
    })
  },
  //下拉框提示框
  onselectChange: function (e) {
    var _index = e.detail.id,_address = e.detail.name;
    if (_index == '000') {
  } else {
    wx.showToast({
      title: _index + '\n' + _address,
      icon: 'success'
    });
    this.setData({
      'orderInfo.order_address': _address,
      'orderInfo.order_index': _index
    })
  }},
  //显示底部弹窗
  showModal:function (e) {
    //定义遮罩层动画
    var animation = wx.createAnimation({
      delay: 200,
      timingFunction: "linear"
    });
    this.animate = animation;
    animation.translateY(800).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    });
    setTimeout(function () {
      animation.translateY(0).step();
      this.setData({
        animationData: animation.export()
      })
    }.bind(this),200)
  },
  //隐藏对话框
  hideModal: function () {
    var animation = wx.createAnimation({
      delay: 200,
      timingFunction: 'linear',
      delay: 0
    });
    this.animation = animation;
    animation.translateY(800).step();
    this.setData({
      animationData: animation.export(),
      showModalStatus: false
    });
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this),200)
  },
  //提交订单时
  onorderSubmit: function (e) {
    if ( this.data.fileLists.length == 0 && this.data.imgLists.length == 0) {
      wx.showToast({
        title: '请选择文件',
        icon: 'none'
      })
    } else {
      //页面内的控制函数
      this.showModal()
    };
  },
  //计数器发生改变时
  onbindStepper: function (e) {
    var num = parseInt(e.detail.num);
    //解决计算后为浮点数的问题
    var price = (num * 0.2).toFixed(2)
    this.setData({
      price: price,
      num: num
    })
  },
  //从聊天记录上传文件
  onuploadFiles:function (e) {
    wx.chooseMessageFile({
      count: 50 - this.data.fileLists.length,
      type: 'file',
      extension: ['pdf','xlsx','xls','csv','txt','doc','docx'],
      success: res => {
        var newFileLists = this.data.fileLists
        var tar = res.tempFiles
        var i = 0
        for (i;i < tar.length ;i++) {
          var url = tar[i]
          newFileLists.push(url)
        }
        this.setData({
          fileLists: newFileLists
        })
      },
      fail () {
        wx.showToast({
          title: '文件选取失败！',
          icon: 'none'
        })
      }
    })
  },
  ondelFile:function (e){
    var tar = e.currentTarget.dataset.index
    var newFileLists = this.data.fileLists
    var remFileLists = newFileLists.splice(tar,1)
    this.setData({
      fileLists: newFileLists
    })
  },
  //从相册上传图片
  onuploadImages:function (e) {
    wx.chooseImage({
      count: 9 - this.data.imgLists.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        var newImgLists = this.data.imgLists
        var tar = res.tempFilePaths
        var i = 0
        for (i;i < tar.length ;i++) {
          var url = tar[i]
          newImgLists.push(url)
        }
        this.setData({
          imgLists: newImgLists
        })
      }
    })
  },
  //删除图片
  ondelImg: function (e) {
    var tar = e.currentTarget.dataset.index
    var newImgLists = this.data.imgLists
    var remImgLists = newImgLists.splice(tar,1)
    this.setData({
      imgLists: newImgLists
    })
  },
  //点击已经上传的图片进行预览
  onpreviewImage: function (e) {
    var urlList = this.data.imgLists
    wx.previewImage({
      urls: urlList,
      current: urlList[e.currentTarget.dataset.index]
    })
  },
  //从数据库读取用户地址信息
  getUserInfo: function (e) {
    wx.cloud.init({
      env: 'int-print-env-3jd7g'
    });
    //获取openid
    var openid = ''
    wx.cloud.callFunction({
      name: 'callback',
      success: (res) => {
        openid = res.result.openid
      }
    });
  var db = wx.cloud.database();
  db.collection('users').where({
    _openid: openid
  }).get({
    success: (res) => {
      this.setData({
        userInfo: [res.data[0]]
      });
      if (res.data.length != 0) {
        this.setData({
          hasUserInfo: true
        })
      } else {
        this.setData({
          hasUserInfo: false
        })
      };
    }
  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
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