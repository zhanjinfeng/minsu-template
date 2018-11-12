var app = getApp();
var wxb = require('../../../utils/wxb.js');
var grade = [1,1.5,2,2.5,3,3.5,4,4.5,5]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    photos: [],
    photos_url: [],
    list: [
      {
        value: 'health',
        title: '卫生环境',
        grade: grade,
        grade_index: 8
      }, {
        value: 'service',
        title: '房东服务',
        grade: grade,
        grade_index: 8
      }, {
        value: 'address',
        title: '交通位置',
        grade: grade,
        grade_index: 8
      }, {
        value: 'decoration',
        title: '室内装修',
        grade: grade,
        grade_index: 8
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id
    });
  },
  // 提交评论
  formSubmit: function (e) {
    var params = e.detail.value;
    var that = this;
    wx.showLoading({
      title: '正在加载中..',
    });
    wxb.Post(wxb.api.comment, {
      order_id: that.data.id,
      openid: JSON.parse(wx.getStorageSync("userinfo")).open_id,
      content: params.content,
      photo: that.data.photos,
      health: grade[that.data.list[0].grade_index],
      service: grade[that.data.list[1].grade_index],
      address: grade[that.data.list[2].grade_index],
      decoration: grade[that.data.list[3].grade_index]
     }, function (data) {
      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
      });
      wx.navigateBack();
    });
  },
  // 删除图片
  delele: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var photos = that.data.photos;
    var newphotos = [];
    wxb.Post(wxb.api.delImage,{
      name: photos[index]
     }, function(data){
       for (var a in photos) {
         if (a != index) {
           newphotos.push(photos[a]);
         }
       }
       var photos_url = that.data.photos_url;
       var newphotos_url = [];
       for (var a in photos_url) {
         if (a != index) {
           newphotos_url.push(photos_url[a]);
         }
       }
       that.setData({
         photos: newphotos,
         photos_url: newphotos_url,
       });
    });
  },
  // 图片上传
  upload: function () {
    var that = this;
    wxb.fileupload('', function (data) {
      var photos = that.data.photos;
      var photos_url = that.data.photos_url;
      photos.push(data.img);
      photos_url.push(data.img_url);
      wx.hideLoading();
      that.setData({
        photos: photos,
        photos_url: photos_url,
      });
    });
  },
  // 卫生评分
  sliderChange: function(e){
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var val = e.detail.value;
    var grade_index = 'list[' + idx + '].grade_index';  
    that.setData({
      [grade_index]: grade.indexOf(val)
    });
  },
})