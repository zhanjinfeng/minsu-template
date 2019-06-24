//index.js
//获取应用实例
var utils = require("../../utils/util.js");
var wxb = require('../../utils/wxb.js');  //API接口请求核心文件
var bmap = require('../../utils/bmap-wx.min.js');    //引入百度地图SDK
let year = new Date().getFullYear();
let month = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
let date = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
let starttime = year + "-" + month + "-" + date;
const app = getApp();

Page({
  data: {
    ak: 'CKpGeZ2wsdylTqPBdKFrPISUfGF7XGa1',
    bannerList: [],
    src: '',
    motto: '休息，休息一下~',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    cityInfo: {
      city_id: '',
      city_name: '',
      city_lat: '',
      city_lng: ''
    },
    place: '',
    bg_date: '',
    end_date: '',
    days: '1',
    peopleNum: '不限人数',
    isHide: true,
    current: 0,
    recommendList: []
  },
  
  onLoad: function (options) {
    var that = this;
    //请求一张首页的背景图片
    //that.get_bgImg();
    var bg_date = month + '月' + date + '日';
    var end_date = utils.getDateStr(starttime, 1).slice(5, 7) + '月' + utils.getDateStr(starttime, 1).slice(8, 10) + '日';
    that.setData({
      bg_date: bg_date,
      end_date: end_date
    });
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    that.getPlace();
    /*wxb.getCityList(function (data) {
      if(data != '')
        wxb.dingWei(data, function (data2) {
          that.setData({
            cityInfo: data2
          });       
          wxb.setCity(data2.city_id, data2.city_name, data2.city_lat, data2.city_lng);
        });
    })*/
  },
  onShow: function () {
    var that = this;
    if (wx.getStorageSync('wxb_bg_end_date')) {
      var dateList = JSON.parse(wx.getStorageSync('wxb_bg_end_date'))
      that.setData({
        bg_date: dateList.bg_date1,
        end_date: dateList.end_date1,
        days: dateList.day2
      })
    }
    if (wx.getStorageSync("selectNum")) {
      var num = wx.getStorageSync("selectNum")
      that.setData({
        peopleNum: num
      });
    }
    if (wxb.getCity()) {
      var city = {
        city_id: wxb.getCity().city_id,
        city_name: wxb.getCity().city_name,
        city_lat: wxb.getCity().city_lat,
        city_lng: wxb.getCity().city_lng
      }
      that.setData({
        cityInfo: city,
        place: ''
      });
    }
    wx.removeStorageSync("filter_num");
  },
  //点击查找房屋进行跳转
  search(){
    var that = this;
    var list = {};
    //添加入住与离店时间
    if (wx.getStorageSync('wxb_bg_end_date')) {
      var dateList = JSON.parse(wx.getStorageSync('wxb_bg_end_date'));
      list['bg_date'] = dateList.bg_date;
      list['end_date'] = dateList.end_date;
    }
    else{
      var endtime = utils.getDateStr(starttime,1);
      list['bg_date'] = starttime;
      list['end_date'] = endtime;
    }
    //入住人数
    if(this.data.peopleNum != '不限人数'){
      var filter = this.data.peopleNum.replace(/[^0-9]/ig, "");
      list["appropriate"] = parseInt(filter);
      wx.setStorageSync("filter_num", 1);
    }
    else{
      list["appropriate"] = 0;
    }
    if(that.data.place!=''){
      list['keywords'] = that.data.place;
    }
    list['city_id'] = that.data.cityInfo.city_id;
    list['lat'] = that.data.cityInfo.city_lat;
    list['lng'] = that.data.cityInfo.city_lng;
    list['order'] = 1;
    wx.setStorageSync("index_dataList", JSON.stringify(list));
    wx.navigateTo({
      url: '/pages/houseList/houseList'
    });
  },
  //获取定位城市信息
  getPlace(){
    var that = this;
    /*wx.getLocation({
      success: function (res) {
        var l = res.latitude + ',' + res.longitude;
        wxb.Post(wxb.api.getLocation, { location: l} ,function(data){
          that.setData({
            cityInfo: {
              city_id: data.result.cityCode,
              city_name: data.result.addressComponent.city,
              city_lat: data.result.location.lat,
              city_lng: data.result.location.lng
            },
          });
          wxb.setCity(data.result.cityCode, data.result.addressComponent.city, data.result.location.lat, data.result.location.lng);
        });
      }
    });*/

  },
  // 获取定位具体位置
  getLocation: function(){
    var that = this;
    that.setData({
      isHide: false
    });
    /* 获取定位地理位置 */
    var BMap = new bmap.BMapWX({
      ak: that.data.ak
    });
    var fail = function (data) {
      console.log(data);
    };
    var success = function (data) {
      that.setData({
        isHide: true,
        place: data.originalData.result.formatted_address
      })
      
    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success
    });
  },
  //点击城市跳转到选择城市页面
  navigatorToCity(){
    var that = this
    var city = that.data.cityInfo.city_name
    wx.navigateTo({
      url: 'city/city?city=' + city,
    })
  },
  //获取个人信息授权
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //获取首页背景图
  get_bgImg: function () {
    var that = this;
    wxb.Post(wxb.api.getConfig, {}, function (data) {
      if(data.banner){
        that.setData({
          src: data.banner[0],
          bannerList: data.banner,
          recommendList: data.marke
        });
        if(data.app_name){
          wx.setNavigationBarTitle({
            title: data.app_name,
          });
        }
        wx.setStorageSync("app_info", data);
      }
    });
  },
  //今日推荐swiper图片当前下标
  bindchange(e) {
    this.setData({
      current: e.detail.current
    });
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: wx.getStorageSync("app_info").app_name,
      path: '/pages/index/index?userid=' + JSON.parse(wx.getStorageSync("userinfo")).user_id
    }
  },
  // 推荐图片点击跳转
  navigatorToPhoto: function(e){
    var path = e.currentTarget.dataset.path;
    if(path != ''){
      wx.navigateTo({
        url: path,
      });
    }
  },
  // 首页活动跳转
  toActivity: function(){
    wx.showModal({
      title: '提示',
      content: '活动尚未开始，敬请期待！',
      showCancel: false,
      confirmColor: '#FD8238'
    })
  }
})
