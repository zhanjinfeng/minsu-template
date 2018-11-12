// pages/index/city/city.js
var utils = require('../../../utils/util.js');
var wxb = require('../../../utils/wxb.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 0,
        title: '推荐'
      },
      {
        id: 1,
        title: '国内城市'
      }
    ],
    cityList: [],
    selectedId: '0',
    TheSearchResults: 1,
    GuessYouLike: [],
    SearchHistory: [],
    SearchHistory: true,
    arrValue: [],
    inputValue: '',
    city: [],
    dingwei: ''
  },
  //推荐和国内城市切换
  handleTabChange: function(e){
    this.setData({
      selectedId: e.detail
    })
  },
  //删除历史记录
  remove: function () {
    wx.showModal({
      title: '确认清除全部历史记录',
      success: res => {
        if (res.confirm) {
          this.setData({
            SearchHistory: ""
          })
          wx.setStorageSync('TheQuery', [])
          this.setData({
            SearchHistory: false
          })
        }
      }
    })
  },
  //点击历史记录
  SearchHistory: function (e) {
    var val = e.currentTarget.dataset.in
  },
  // 递归方法，来遍历最内层的字符串并通过正则来替换
  digui: function (newJson, obj, key) { 
    var that = this;
    var reg = new RegExp(that.data.inputValue, 'g');
    if (newJson.constructor == Array) {
      newJson.forEach(function (item, index) {
        if (item.constructor == String) {
          obj[key].splice(index, 1, item.replace(reg, "<span style='color:red'>" + that.data.inputValue + "</span>"))
        } else {
          that.digui(item, newJson);
        }
      });
    } else if (newJson.constructor == Object) {
      var json = {};
      for (var key in newJson) {
        json[key] = newJson;
        that.digui(newJson[key], newJson, key);
      }
    } else if (newJson.constructor == String) { // 这里做全局替换
      if (key) {
        obj[key] = newJson.replace(reg, "<span style='color:red'>" + that.data.inputValue + "</span>")
      }
    }
  },
  // 每次输入来监听键盘，处理匹配的数据
  searchChange: function (e) { 
    var text = e.detail.value;
    this.setData({
      inputValue: text,
      TheSearchResults: 2
    })
    if (text == '') {
      this.setData({
        TheSearchResults: 1,
        arrValue: []
      })
      return
    }
    var newJson = JSON.parse(JSON.stringify(utils.json)); // 实现深复制
    this.digui(newJson);
    this.setData({
      arrValue: []
    })
  },
  //返回首页
  navigatorBack(){
    wx.navigateBack({
      delta: 1,
    })
  },
  //返回首页获取我的位置
  navigatorBack2(){
    var pages = getCurrentPages();             //  获取页面栈
    var currPage = pages[pages.length - 1];    // 当前页面
    var prevPage = pages[pages.length - 2];    // 上一个页面
    prevPage.getLocation();                   
    wx.navigateBack({
      delta:-1
    })
  },
  //点击推荐里的内容和搜索选项内容进行跳转
  bindItem(e){
    var that = this
    var item = e.currentTarget.dataset.itm
    var TheQuery = wx.getStorageSync('TheQuery')
    var pages = getCurrentPages()   //获取当前页面栈
    var curr_page = pages[pages.length - 1]
    var prev_page = pages[pages.length - 2]
    //判断缓存是否已经存在，存在不添加，不存在添加
    var box = TheQuery.every(function (res) { return res.name != item.name });
    if (box) {
      TheQuery.push(item)
    }
    wx.setStorageSync('TheQuery', TheQuery)
    if(item.result_type.id=='dw'){
      prev_page.setData({
        place: ''
      })
      wxb.setCity(item.cityInfo.city_id, item.name, item.cityInfo.city_lat, item.cityInfo.city_lng);
    }
    else if(item.result_type.id=='jd'){
      console.log(item,'看这里看这里')
      prev_page.setData({
        place: item.name
      })
      wxb.setCity(item.cityInfo.city_id, item.address, item.cityInfo.city_lat, item.cityInfo.city_lng)
    }
    that.navigatorBack()
  },
  //点击国内城市页面的城市名
  navigatorToIndex(e){
    var that = this
    var item = e.currentTarget.dataset.itm
    var TheQuery = wx.getStorageSync('TheQuery')
    console.log(e.currentTarget.dataset.itm,'测试水电开发阿里的就答复江安')
    // var box = TheQuery.every(function (res) { return res.name != item.name });
    // if (box) {
    //   TheQuery.push(item)
    // }
    // wx.setStorageSync('TheQuery', TheQuery)
    wxb.setCity(item.city_id, item.city_name, item.lat, item.lng)
    that.navigatorBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var list = [utils.json[0], utils.json[2], utils.json[3]]
    if(options.city!=''){
      that.setData({
        dingwei: options.city
      })
    }
    var arr = [];
    //判断缓存是否为空
    if (!Array.isArray(wx.getStorageSync('TheQuery'))) {
      wx.setStorageSync('TheQuery', arr)
    }
    that.setData({
      SearchHistory: wx.getStorageSync('TheQuery')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    var len = wx.getStorageSync('TheQuery')
    if (len.length == 0) {
      that.setData({
        SearchHistory: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wxb.getCityList(function(data){
      let cityList = []
      for(let i=0;i<data.length;i++){
        cityList[i] = {
          city_id: data[i].city_id,
          city_name: data[i].city_name,
          initial: data[i].initial,
          is_hot: data[i].is_hot,
          lat: data[i].lat,
          lng: data[i].lng
        }
      }
      that.setData({
        cityList: cityList
      })
    })
  },

})