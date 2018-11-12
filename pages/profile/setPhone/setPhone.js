// pages/profile/setPhone/setPhone.js
var wxb = require('../../../utils/wxb.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: 61,
    isShow: false,
    time: '获取验证码', //倒计时
    userPhone: '',   //手机号码
    valatedCode: '',  //图形验证码
    codeNum: '',  //数字验证码
    isFinished: false,
    disabled: false,
    imgUrl: '',
    sjn: 1100,
  },
  //刷新图形验证码
  getImg: function () {
    this.setData({
      sjn: Math.random(100, 100000)
    });
  },
  //验证码倒计时
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime;
    if(that.data.valatedCode == ''){
      wx.showModal({
        title: '提示',
        content: '请先输入图片验证码',
        confirmColor: "#FD8238",
        showCancel: false
      });
    }
    else{
      that.setData({
        disabled: true
      });
      var interval = setInterval(function () {
        currentTime--;
        that.setData({
          time: '已发送(' + currentTime + 's)'
        })
        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            time: '重新发送',
            currentTime: 61,
            disabled: false
          })
        }
      }, 1000);
    }
  },
  // 验证用户手机号码
  getVerificationCode: function (e) {
    var that = this;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    var phone = that.data.userPhone;
    var flag = reg.test(phone);
    if (flag) {
      that.getCode();
    }
    else {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码',
        confirmColor: "#FD8238",
        showCancel: false
      });

    }
  },
  //关闭弹出层
  closePopup: function(){
    this.setData({
      isShow: false
    });
  },
  // 获取用户手机号码
  getUserPhone: function (e) {
    var that = this;
    that.setData({
      userPhone: e.detail.value
    });
    that.formVerity();
  },
  //获取数字验证码
  getCodeNum: function (e) {
    var that = this;
    that.setData({
      codeNum: e.detail.value
    });
    that.formVerity();
  },
  // 获取图片验证码
  getValatedCode: function (e) {
    var that = this;
    that.setData({
      valatedCode: e.detail.value
    });
    that.formVerity();
  },
  //验证3个数据是否填写完整
  formVerity: function () {
    var that = this
      , phone = that.data.userPhone
      , codeNum = that.data.codeNum
      , valatedCode = that.data.valatedCode;
    if (phone.length == 11 && codeNum.length == 6 && valatedCode.length == 4) {
      that.setData({
        isFinished: true
      });
    }
  },
  //提交数据登录
  login: function () {
    var that = this;
    if (that.data.valatedCode != that.data.codeImg.value) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的图片验证码',
      });
    }
    else {
      console.log({
        phone: that.data.userPhone,
        codeNumber: that.data.codeNum
      })
    }
  },
  //手机号授权
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      this.setData({
        isShow: true
      });
    }
    console.log(e);
    console.log(e.detail.iv);
    console.log(e.detail.encryptedData);
  },
  //绑定其他手机号弹出层
  togglePopup: function(){
    this.setData({
      isShow: !this.data.isShow
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getExtConfig({
      success: function (res) {
        console.log('afsd', res);
        res.extConfig;
        that.setData({
          imgUrl: res.extConfig.apiurl + wxb.api.captcha
        });
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