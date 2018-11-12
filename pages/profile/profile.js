// pages/profile/profile.js
var wxb = require('../../utils/wxb.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    
  },
  //进入登录界面
  toLogin: function(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  //跳转到设置手机页面
  toSetPhone: function(){
    wx.navigateTo({
      url: 'setPhone/setPhone',
    });
  },
  //跳转到我的订单
  navigatorToOrder: function(e){
    var that = this;
    if (!that.data.isLogin) that.toLogin();
    else  
      wx.switchTab({
        url: '../order/order',
      });
  },
  //点击发票
  invoiceOpen: function(){
    wx.showModal({
      title: '',
      content: '很抱歉，目前小程序暂不支持开发票',
      confirmColor: "#FD8238",
    });
  },
  //联系客服
  contact: function(){
    var p = '000-000-0000';
    var tel = wx.getStorageSync("app_info").service_tel;
    if (wx.getStorageSync("app_info")) {
      p = tel.slice(0, 3) + '-' + tel.slice(3, 6) + '-' + tel.slice(6);
    }
    wx.showModal({
      title: '提示',
      content: '拨打稻客客服：'+p,
      confirmColor: "#FD8238",
      success(res) {
        if(res.confirm){
          wx.makePhoneCall({
            phoneNumber: p,
          });
        }
      }

    });
  },
  //跳转至优惠券页面
  toCoupon: function(){
    var that = this;
    if(!that.data.isLogin) that.toLogin();
    else{
      wx.navigateTo({
        url: 'coupon/coupon',
      });
    }
  },
  //领取优惠券
  toReceiveCoupon: function () {
    wx.showModal({
      title: '提示',
      content: '该功能还在维护中',
      confirmColor: "#FD8238",
      showCancel: false
    });
    // wx.navigateTo({
    //   url: 'coupon/receiveCoupon/receiveCoupon',
    // });
  },
  //意见反馈
  toSuggestion: function(){
    wx.navigateTo({
      url: 'suggestion/suggestion',
    })
  },
  //退出登录
  exit: function(){
    var that = this;
    wx.showModal({
      title: '',
      content: '请确认是否退出登录',
      confirmColor: "#FD8238",
      success(res) {
        if(res.confirm){
          that.setData({
            isLogin: false
          });
          wx.removeStorageSync("userinfo");
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var isLogin = false;
    if(wxb.checkAuthLogin()){
      this.setData({
        isLogin: true
      });
    }
  },

})