// pages/search/pages/place/place.js
var wxb = require('../../../utils/wxb.js') //API核心接口文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        text: '热门推荐',
        key: '观光景点',
        children: []
      },{
        text: '观光景点',
        key: '观光景点',
        children: []
      },{
        text: '商圈',
        key: '商圈',
        children: []
      },{
        text: '行政区',
        key: '行政区',
        children: []
      },{
        text: '地铁线路',
        key: '地铁线路',
        children: []
      },{
        text: '机场/车站',
        key: '机场车站',
        children: []
      },{
        text: '高校',
        key: '高校',
        children: []
      }, {
        text: '医院',
        key: '医院',
        children: []
      }
    ],
    mainActiveIndex: 0,
    activeId: 0
  },
  //左边一级分类
  handleNavClick({ detail = {} }) {
    var that = this;
    var query = that.data.items[detail.index]["key"];
    if(query != '行政区'){
      that.getPlace({ query: query, region: wxb.getCity().city_name },detail.index);
    }else{
      that.getPlace({ query: wxb.getCity().city_name, type: 4 }, detail.index)
    }
    that.setData({
      mainActiveIndex: detail.index || 0
    });
  },
  //右边二级
  handleItemClick({ detail = {} }) {
    var that = this;
    var pages = getCurrentPages();
    var curr_page = pages[pages.length - 1];
    var prev_page = pages[pages.length - 2];
    prev_page.setData({
      place: {
        title: detail.name,
        value: detail.location,
        mainActiveIndex: that.data.mainActiveIndex
      },
      inputValue: ''
    });
    wx.setStorageSync("isQuery", true);
    wx.navigateBack();
  },  
  //获取位置数据
  getPlace: function(params,index){
    var that = this;
    wxb.Post(wxb.api.query_place, params, function (data) {
      var arr = [];
      var s = 'items[' + index + '].children';
      for (let i in data.results) {  
        arr.push({
          name: data.results[i].name,
          location: data.results[i].location,
        });
      }
      that.setData({
        [s]: arr,
      });
    });
  },  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('place',options);
    var that = this;
    var query;
    if(options.mainActiveIndex!='undefined'){
      query = that.data.items[options.mainActiveIndex].key;
      that.getPlace({ query: query, region: wxb.getCity().city_name }, options.mainActiveIndex);
      that.setData({
        activeId: options.value,
        mainActiveIndex: options.mainActiveIndex
      });
    }
    else{
      that.getPlace({ query: '观光景点', region: wxb.getCity().city_name }, 0);
    }
  },
})