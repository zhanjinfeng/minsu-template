// pages/order/houseCost/houseCost.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    day: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync("houseCost")){
      var d = JSON.parse(wx.getStorageSync("houseCost"));
      if(d.bg_date){
        var day = new Date(d.bg_date).getDay();
        var days = ['周日','周一','周二','周三','周四','周五','周六'];
        this.setData({
          day: days[day]
        });
      }
      this.setData({
        list: d
      });
    }
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
    wx.removeStorageSync("houseCose");
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