// pages/profile/suggestion/suggestion.js
const Toast = require('../../../components/dist/toast/toast');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textareaValue: '',
    tel: '000-000-0000',
    isDisabled: false
  },
  //唤起手机
  openPhone: function(){
    var tel = this.data.tel;
    wx.makePhoneCall({
      phoneNumber: tel,
    });
  },
  //获取输入框内容
  getTextarea: function(e){
    this.setData({
      textareaValue: e.detail.value
    });
  },
  //提交内容
  submit: function(){
    var that = this;
    if(that.data.textareaValue == ''){
      Toast({
        message: '请输入内容',
        selector: '#zan-toast-test'
      });
    }
    else{
      that.setData({
        isDisabled: true
      });
      setTimeout(function(){
        wx.showToast({
          title: '提交成功！',
          icon: 'success',
          duration: 900
        });
        that.setData({
          isDisabled: false
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: -1
          });
        }, 800);
      },800);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tel = wx.getStorageSync("app_info").service_tel;
    if(wx.getStorageSync("app_info")){
      this.setData({
        tel: tel.slice(0, 3) + '-' + tel.slice(3, 6) + '-' + tel.slice(6)
      });
    }
  },
})