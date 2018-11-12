// pages/houseDetail/dianPing/dianPing.js
var wxb = require('../../../utils/wxb.js');

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    commentsList: []
  },
  prevImage(e){
    wx.previewImage({
      current: e.currentTarget.dataset.value,
      urls: e.currentTarget.dataset.imgurls,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wxb.Post(wxb.api.getComment, {
      room_id: options.id,
      type: 1
    }, function(data){
      that.setData({
        commentsList: data
      });
    })
    
  },

})