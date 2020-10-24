// pages/component/stepper/stepper.js
//页面构造器
const app = getApp()
Page({

}),
//自定义组件构造器
Component({
  export () {
    return {num: this.data.num}
  },
  properties: {

  },
  data: {
    //组件内部数据
    num: 1,
    minusStatus: 'disabled'
  },
  methods: {
    //自定义方法
    /*点击减号*/
    onbindMinus: function () {
      var num = this.data.num;
      //大于一才可以减
      if (num > 1) {
        num--;
      }
      //大于一件的时候才可以将减号显示为正常状态
      var minusStatus = num <= 1 ? 'disabled' : 'normal';
      //将数值与状态写回
      this.setData({
        num: num,
        minusStatus: minusStatus
      });
      //将数据传递给stepper调用者
      this.triggerEvent('stepper',{num: num})
    },
    /*点击加号*/
    onbindPlus: function () {
      var num = this.data.num;
      //无条件自增一
      num++;
      //大于一件的时候才可以将减号显示为正常状态
      var minusStatus = num <= 1 ? 'disabled' : 'normal';
      //将状态与数值写回
      this.setData({
        num: num,
        minusStatus: minusStatus
      });
      //将数据传递给stepper调用者
      this.triggerEvent('stepper',{num: num})
    },
    /*输入框发生改变时*/
    onbindManual: function (e) {
      var num = e.detail.value;
      //输入负数和其他类型报错
      if (num <= 0 ) {
        wx.showToast({
          title: '请输入合理的正整数!',
          icon: 'none'
        });
        this.setData({
          num: 1
        });
        this.triggerEvent('stepper',{num: 1})
      } else {
      //将数值与状态写回
      var minusStatus = num <= 1 ? 'disabled' : 'normal';
      this.setData({
        num: num,
        minusStatus: minusStatus
      });
      //将数据传递给stepper调用者
      this.triggerEvent('stepper',{num: num})
      };
    }
  }
})