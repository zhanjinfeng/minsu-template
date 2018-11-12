// pages/order/pages/pay/pay.js
var utils = require('../../../utils/util.js');
var wxb = require('../../../utils/wxb.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: '',
    clock: '',
    order_id: '',
    isDisabled: false
  },
  count_down: function (duringMs) {   
    var that = this;
    var timer = null;
    let a = 2700000 - duringMs;   
    if(duringMs >= 2700000){ 
      that.setData({
        clock: "支付已截止，请重新下单",
        isDisabled: true
      });
      return
    }
    that.setData({
      clock: that.date_format(a)
    })
    timer = setInterval(function () {
      let clock1 = ''
      a -= 1000;
      if(that.date_format(a).slice(0,2)=='0'){
        clock1 = that.date_format(a).slice(3, 6)
      }
      else{
        clock1 = that.date_format(a)
      }
      that.setData({
        clock: clock1
      })
      if (a == 0) {
        that.setData({
          clock: "支付已截止，请重新下单",
          isDisabled: true
        })
        // timeout则停止timer
        clearInterval(timer)
        wx.navigateBack({
          delta: -1
        })
      }
    }, 1000)
  },
  /* 格式化倒计时 */
  date_format(micro_second) {
    var that = this
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = that.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = that.fill_zero_prefix(second % 60);// equal to => var sec = second % 60;
    return min + "分" + sec + "秒";
  },
  /* 分秒位数补0 */
  fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
  },
  // 支付
  pay: function(){
    var that = this;
    wxb.Post(wxb.api.pay,{order_id: that.data.order_id,openid:JSON.parse(wx.getStorageSync("userinfo")).open_id}, function(res){
      if(res){
        wx.requestPayment({
          timeStamp: res.order.timeStamp,
          nonceStr: res.order.nonceStr,
          package: res.order.package,
          signType: res.order.signType,
          paySign: res.order.paySign,
          success: function (res) {
            wx.showToast({
              title: '支付成功',
            });
            setTimeout(function(){
              wx.setStorageSync("isOrder", true);
              wx.switchTab({
                url: '../order',
              });
            },500);         
          },
          fail: function(res){
            console.log(res);
          },
          complete: function(res){
            console.log(res);
          }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.order_id){
      wxb.Post(wxb.api.order_detail, { order_id: options.order_id, openid: JSON.parse(wx.getStorageSync("userinfo")).open_id }, function (data) {
        if (data.orderTime&&data.total_price){
          var time = utils.formatTime(new Date());
          var b = time.split(/[^0-9]/);
          //截止日期：日期转毫秒
          var setuptime = data.orderTime;
          var now = new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
          var duringMs = now.getTime() - setuptime;
          that.count_down(duringMs);
          that.setData({
            price: data.total_price,
            order_id: data.order_id
          });
        }
      });
    }
  },
})