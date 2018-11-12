var utils = require('../../../utils/util.js');
var wxb = require('../../../utils/wxb.js');

Page({
  data: {
    TheSearchResults: 1,
    GuessYouLike: [],
    SearchHistory: [],
    SearchHistory: true,
    arrValue: [],
    inputValue: ''
  },
  //删除历史记录
  remove:function(){
    wx.showModal({
      title: '确认清除全部历史记录',
      success: res=>{
        if(res.confirm){
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
  //点击取消返回上一页面
  onEmpty(){
    this.setData({
      text: '',
      TheSearchResults: 1
    })
    wx.navigateBack({
      delta: -1
    })
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
    if(text == ''){
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
  //点击搜索结果跳转
  navigatorToResult: function(e){
    var that = this
    var item = e.currentTarget.dataset.itm
    var pages = getCurrentPages()   //获取当前页面栈
    var curr_page = pages[pages.length - 1]
    var prev_page = pages[pages.length - 2]
    if(item.result_type.id=='jd'){
      prev_page.setData({
        inputValue: item.name,
        place: {
          title: item.name,
          value: item.id,
          mainActiveIndex: 1
        }
      })
      console.log('测试的年末实地电视剧',item)
    } else if (item.result_type.id == 'dw'){
      var dataList = {}
      if(wx.getStorageSync("index_dataList")){
        dataList = JSON.parse(wx.getStorageSync("index_dataList"))
        dataList.city_id = item.cityInfo.city_id
        dataList.lat = item.cityInfo.city_lat
        dataList.lng = item.cityInfo.city_lng
      }
      console.log(wxb.getCity())
      wxb.setCity(item.cityInfo.city_id, item.name, item.cityInfo.city_lat, item.cityInfo.city_lng)
      console.log(item,'测试啊啊啊啊啊')
      wx.setStorageSync("index_dataList",JSON.stringify(dataList))
      prev_page.setData({
        inputValue: '',
        place: {
          title: '位置',
          value: 0
        }
      })
    } else if (item.result_type.id == 'dt'){
      prev_page.setData({
        inputValue: item.name,
        place: {
          title: item.name,
          value: item.id,
          mainActiveIndex: 2
        }
      })
    } else if(item.result_type.id == 'fx'){
      prev_page.setData({
        inputValue: item.name
      })
    } else if(item.result_type.id == 'fw'){
      var list = {}
      var starttime = utils.getDateStr(new Date(),0)
      if (wx.getStorageSync('wxb_bg_end_date')) {
        let dateList = JSON.parse(wx.getStorageSync('wxb_bg_end_date'))
        list['bg_date'] = dateList.bg_date
        list['end_date'] = dateList.end_date
      }
      else {
        let endtime = utils.getDateStr(starttime, 1)
        list['bg_date'] = starttime
        list['end_date'] = endtime
      }
      list['id'] = item.id
      list['lat'] = item.lat
      list['lng'] = item.lng
      console.log('我运行到这里')
      wx.navigateTo({
        url: '../../houseDetail/houseDetail?list=' + JSON.stringify(list)
      })
      let TheQuery = wx.getStorageSync('TheQuery');
      //判断缓存是否已经存在，存在不添加，不存在添加
      let box = TheQuery.every(function (res) { return res.name != item.name });
      if (box) {
        console.log(item, '测试222222222222222')
        TheQuery.push(item)
      }
      wx.setStorageSync('TheQuery', TheQuery)
      return
    }
    wx.navigateBack({
      delta: -1
    })
    var TheQuery = wx.getStorageSync('TheQuery');
    //判断缓存是否已经存在，存在不添加，不存在添加
    var box = TheQuery.every(function (res) { return res.name != item.name });
    if (box) {
      console.log(item,'测试222222222222222')
      TheQuery.push(item)
    }
    wx.setStorageSync('TheQuery', TheQuery)
  },
  onLoad: function (options) {
    var arr = []
    var that = this
    var list = [utils.json[0], utils.json[2], utils.json[3]]
    if (options.title != '') {
      that.setData({
        inputValue: options.title
      })
    }
    //判断缓存是否为空
    if (!Array.isArray(wx.getStorageSync('TheQuery'))) {
      wx.setStorageSync('TheQuery', arr)
    }
    that.setData({
      SearchHistory: wx.getStorageSync('TheQuery'),
      GuessYouLike: list
    })
  },
  onReady: function () {
    var that = this;
    var len = wx.getStorageSync('TheQuery')
    if (len.length == 0) {
      that.setData({
        SearchHistory: false
      })
    }
  },
})