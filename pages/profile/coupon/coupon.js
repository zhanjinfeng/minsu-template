// pages/profile/coupon/coupon.js
var app = getApp()
const Toast = require('../../../components/dist/toast/toast');
var list = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabId: 0,
    couponList: [],
  },
  //tab切换
  changeTab: function () {
    var that = this;
    var id = 0;
    if (that.data.tabId == 0) id = 1;
    that.setData({
      tabId: id
    });
  },
  //领取优惠券
  toReceiveCoupon: function(){
    wx.showModal({
      title: '提示',
      content: '该功能还在维护中',
      confirmColor: "#FD8238",
    });
    // wx.navigateTo({
    //   url: 'receiveCoupon/receiveCoupon',
    // });
  },

})