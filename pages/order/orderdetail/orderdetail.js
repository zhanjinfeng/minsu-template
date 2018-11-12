// pages/order/pages/orderdetail/orderdetail.js
var utils = require('../../../utils/util.js');
var wxb = require('../../../utils/wxb.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    clock: '',
    isDisabled: false,
    isShow: false    //popup弹出层
  },
  count_down: function (duringMs) {
    var that = this
    var timer = null
    let a = 2700000 - duringMs
    if (duringMs >= 2700000) {
      that.setData({
        clock: "请重新下单",
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
      if (that.date_format(a).slice(0, 2) == '0') {
        clock1 = that.date_format(a).slice(3, 6)
      }
      else {
        clock1 = that.date_format(a)
      }
      that.setData({
        clock: clock1
      })
      if (a == 0) {
        that.setData({
          clock: "请重新下单",
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
  //跳转到房费明细
  navigatorTohouseCost(){
    var that = this;
    wx.setStorageSync("houseCost", JSON.stringify({
      minsu_name: that.data.order.unitName,
      price: that.data.order.total_price,
      bg_date: that.data.order.checkInDate,
      count: that.data.order.bookingCount
    }));
    wx.navigateTo({
      url: '../houseCost/houseCost',
    });
  },
  togglePopup() {
    this.setData({
      isShow: !this.data.isShow
    });
  },
  //打开地图
  openLocation(){
    var that = this;
    wx.openLocation({
      latitude: parseFloat(that.data.order.lat),
      longitude: parseFloat(that.data.order.lng),
      name: that.data.order.unitName,
      address: that.data.order.unitAddress
    })
  },
  //删除订单
  deleteOrder(){
    wx.showModal({
      title: '',
      content: '请确认是否删除订单',
      confirmColor: "#FD8238"
    })
  },
  //跳转到房屋详情
  navigatorTohouseDetail(){
    wx.navigateTo({
      url: '/pages/houseDetail/houseDetail?room_id=' + this.data.order.room_id,
    });
  },
  //跳转到支付页面
  navigatorToPay(){
    wx.navigateTo({
      url: '../pay/pay?order_id=' + this.data.order.order_id,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wxb.Post(wxb.api.order_detail, { order_id: options.id, openid: JSON.parse(wx.getStorageSync("userinfo")).open_id}, function(data){
      if(data){
        that.setData({
          order: data
        });
        //支付倒计时
        var time = utils.formatTime(new Date());
        var a = that.data.order.orderTime;
        var b = time.split(/[^0-9]/);
        //截止日期：日期转毫秒
        var now = new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
        var duringMs = now.getTime() - a;
        that.count_down(duringMs);
      }
    });  
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