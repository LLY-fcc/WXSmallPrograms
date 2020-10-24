  // pages/advertising/advertising.js
  Page({
    /**
     * 页面的初始数据
     */
    data: {
      miao: 6,
      time:'',
      adv_text: '从这一刻开启便捷生活'
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    //设置动态广告语、提示词

    imgClick: function () {
      //clearInterval(this.time);
      //clearInterval(this.time_2);
      //wx.redirectTo({
       // url: '../des/des',
      //});
      wx.navigateTo({
        url: '../des/des',
      });
    },
    onLoad: function (options) {
      var that = this;
      var text = ['点击首页轮播图有惊喜！','有问题不要忘记咨询客服','从这一刻开启便捷生活','您的支持是我们最大的动力！','发现问题可以向我们反馈哟','Welcome to INT!','INT一定会更好哒！']
      this.time_2 = setInterval(function () {
        var i = parseInt(Math.random()*8);
        that.setData({
          adv_text: text[i]
        });
        if (that.data.miao == 0) {
          clearInterval(this.time_2);
        }
      },2000)
      this.time = setInterval(function () {
        that.setData({
          miao: that.data.miao-1
        })
        if (that.data.miao == 0){
          clearInterval(this.time);
          wx.switchTab({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
            url: "../index/index"
          })
        }
  
    }, 1000)
    },
  
    cliadv: function(){
          clearInterval(this.time);
          clearInterval(this.time_2);
          wx.switchTab({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
            url: "../index/index"
          })
    }
  })
  