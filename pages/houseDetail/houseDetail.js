// pages/detail/detail.js
var utils = require('../../utils/util.js');
var wxb = require('../../utils/wxb.js')  //API接口请求核心文件
var current_m = new Date().getMonth()+1;
var alreadydate = [];      //已预订日期数据
const Toast = require('../../components/dist/toast/toast');

Page({
  data: {
    isView1: true,       //收起展开控制
    isView2: true,
    isView3:true,
    isView4: true,
    isShow: false,       //押金popup显示控制
    isShow2: false,
    detailList: [],
    zhoubianList: [],
    date: [],
    starttime: '',
    endtime: '',
    level: '',
    current: 0,
    popupList: [
      {
        title: '优选',
        isShow: false,
        context: '途家优选房屋，误服优质，设施可靠，出行首选'
      },
      {
        title: '连住优惠',
        isShow: false,
        context: '连住多天可享受超值折扣'
      },
      {
        title: '闪订',
        isShow: false,
        context: '下单既有房'
      },
      {
        title: '实拍',
        isShow: false,
        context: '途家摄影师上门拍摄，百分百真实展示'
      },
      {
        title: '免押金',
        isShow: false,
        context: '信用认证达标，即可享受途家担保，无需支付押金'
      },
      {
        title: '验真',
        isShow: false,
        context: '途家实地上门考察，房屋图片，描述，设施真实有效'
      },
      {
        title: '智能门锁',
        isShow: false,
        context: '密码开锁，自助入住和退房，无需等待房东'
      }
    ],
    facilitiesCount: 0,
    price: '',
    days: 1
  },
  onLoad: function(options){
    var that = this;
    var room_id = options.room_id;
    var list;
    Toast.loading({
      message: '加载中',
      selector: '#zan-toast-test',
      timeout: -100
    });
    if (wx.getStorageSync('index_dataList')) {
      list = JSON.parse(wx.getStorageSync('index_dataList'));
    }
    //获取房屋详情数据
    wxb.Post(wxb.api.house_detail, {room_id: room_id}, function (data) {
      var count = 0;
      var isWeek = new Date().getDay() == 0 || new Date().getDay() == 6 ? true : false;
      for(let i = 0; i < data.facilities.length; i++){
        count += data.facilities[i].child.length;
      }
      that.setData({
        detailList: data,
        facilitiesCount: count,
        price: isWeek ? data.sale_week_price : data.sale_worke_price
      });
      Toast.clear();
    });
    var a = 0;
    var level = '';
    var start_m = 0;
    var monthdate = utils.getMonthDate();
    if (wx.getStorageSync("index_dataList")) {
      var bg_date = list.bg_date.replace(/[^0-9]/ig, "");
      var end_date = list.end_date.replace(/[^0-9]/ig, "");
      for (let i = 0; i < monthdate.length; i++) {
        for (let k = 0; k < monthdate[i].day.length; k++) {
          monthdate[i].day[k].select = a;
          if (monthdate[i].day[k].day3) {
            if (monthdate[i].day[k].day3.replace(/[^0-9]/ig, "") == bg_date) {
              monthdate[i].day[k].select = 1;
              a = 3;
            }
            if (monthdate[i].day[k].day3.replace(/[^0-9]/ig, "") == end_date) {
              a = 0;
              monthdate[i].day[k].select = 2;
            }
          }
        }
      }
      for (let i = 0; i < monthdate.length; i++) {
        for (let j = 0; j < monthdate[i].day.length; j++) {
          for (let k = 0; k < alreadydate.length; k++) {
            if (monthdate[i].day[j].day1 == alreadydate[k]) {
              monthdate[i].day[j]['already'] = true;
            }
          }
        }
      }
    }
    if (list.level == 0) {
      level = '豪华';
    }
    else if (list.level == 1) {
      level = '精品';
    }
    else if (list.level == 2) {
      level = '舒适';
    }
    else {
      level = '';
    }
    //获取缓存中的入住时间和离店时间
    if (wx.getStorageSync("wxb_bg_end_date")) {
      var time = JSON.parse(wx.getStorageSync("wxb_bg_end_date"))
      start_m = time.bg_date.slice(5, 7)        //获取入住时间的月份
      that.setData({
        starttime: time.bg_date,
        endtime: time.end_date,
        days: time.day2
      });
    }
    else {
      if (wx.getStorageSync("index_dataList")) {
        var list = JSON.parse(wx.getStorageSync("index_dataList"))
        start_m = list.bg_date.slice(5, 7)
        that.setData({
          starttime: list.bg_date,
          endtime: list.end_date
        })
      }
    }
    that.setData({
      date: monthdate[start_m - current_m >= 0 ? start_m - current_m : start_m - current_m + 12],
      level: level
    });
  },
  onShareAppMessage: function(res){
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: wx.getStorageSync("app_info").app_name,
      path: '/pages/houseDetail/houseDetail?room_id=' + that.data.detailList.room_id
    }
  },
  onShow: function(){
    var that = this
    //获取缓存中的入住时间和离店时间
    var start_m = 0;
    if (wx.getStorageSync("wxb_bg_end_date")) {
      var time = JSON.parse(wx.getStorageSync("wxb_bg_end_date"))
      start_m = time.bg_date.slice(5, 7);      //获取入住时间的月份
      that.setData({
        starttime: time.bg_date,
        endtime: time.end_date,
        days: time.day2
      });
    }
    else {
      if (wx.getStorageSync("index_dataList")) {
        var list = JSON.parse(wx.getStorageSync("index_dataList"));
        start_m = list.bg_date.slice(5, 7);
        that.setData({
          starttime: list.bg_date,
          endtime: list.end_date,
        });
      }
    }
    var monthdate = utils.getMonthDate();
    var a = 0;
    var bg_date = that.data.starttime.slice(4).replace(/[^0-9]/ig, "");
    var end_date = that.data.endtime.slice(4).replace(/[^0-9]/ig, "");
    for (let i = 0; i < monthdate.length; i++) {
      for (let k = 0; k < monthdate[i].day.length; k++) {
        monthdate[i].day[k].select = a
        if (monthdate[i].day[k].day3) {
          if (monthdate[i].day[k].day3.replace(/[^0-9]/ig, "") == bg_date) {
            monthdate[i].day[k].select = 1;
            a = 3;
          }
          if (monthdate[i].day[k].day3.replace(/[^0-9]/ig, "") == end_date) {
            a = 0;
            monthdate[i].day[k].select = 2;
          }
        }
      }
      for (let i = 0; i < monthdate.length; i++) {
        for (let j = 0; j < monthdate[i].day.length; j++) {
          for (let k = 0; k < alreadydate.length; k++) {
            if (monthdate[i].day[j].day1 == alreadydate[k]) {
              monthdate[i].day[j]['already'] = true;
            }
          }
        }
      }
    }
    that.setData({
      date: monthdate[start_m - current_m >= 0 ? start_m - current_m : start_m - current_m + 12],
    });
  },
  //swiper滑动下标切换
  bindchange(e) {
    this.setData({
      current: e.detail.current
    });
  },
  //调用手机呼叫号码
  markerUpPhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.detailList.HomeownerPhone
    });
  },
  //展开收起切换（view）
  viewChange(e){
    var isView = e.currentTarget.dataset.value;
    this.setData({
      [isView]: !this.data[isView]
    });
  },
  //popup显示隐藏切换（特殊服务和押金）
  togglePopup(e){
    var that = this;
    var isShow = e.currentTarget.dataset.isshow;
    if(isShow == "isShow2"){
      var list = that.data.detailList.service
      var popupList = that.data.popupList
      for (let i = 0; i < popupList.length; i++) {
        if (list.indexOf(popupList[i].title) != -1) {
          popupList[i].isShow = true
        }
      }
      that.setData({
        popupList: popupList
      })
    }
    that.setData({
      [isShow]: !that.data[isShow]
    });
  },
  //打开地图显示位置信息
  navigatorToLocation(e){
    var that = this;
    console.log('lat', parseFloat(e.currentTarget.dataset.lat), '2', e.currentTarget.dataset.lat);
    wx.openLocation({
      latitude: parseFloat(e.currentTarget.dataset.lat),
      longitude: parseFloat(e.currentTarget.dataset.lng),
      name: that.data.detailList.introduction.minsu_name, 
      address: that.data.detailList.unitAddress,
      scale: 18
    });
  },
  //跳转到评论信息
  navigatorToDianPing(){
    wx.navigateTo({
      url: 'dianPing/dianPing?id=' + this.data.detailList.room_id,
    });
  },
  //跳转到照片详情
  navigatorToPhoto(e){
    var imgUrlsList = JSON.stringify(e.currentTarget.dataset.value)
    wx.navigateTo({
      url: 'photo/photo?imgUrlsList=' + imgUrlsList,
    })
  },
  //跳转到日期选择页面
  navigatorToCalendar(){
    var bg_date = this.data.starttime.slice(4)
    var end_date = this.data.endtime.slice(4)
    wx.navigateTo({
      url: '/common/calendar/calendar?bg_date=' + bg_date + '&end_date=' + end_date + '&alreadydate=' + JSON.stringify(alreadydate)
    })
  },
  //跳转到填写订单信息页面
  navigatorToCommitOrder(){
    var that = this;
    var price = that.data.detailList.decount_list != '' && that.data.days >= that.data.detailList.decount_list[0].day ? parseInt(that.data.price).toFixed(2) * that.data.detailList.decount_list[0].discount * 0.1 : that.data.price;
    if (!wxb.checkAuthLogin()) {
      wx.navigateTo({
        url: '../login/login',
      });
      return;
    }
    wx.navigateTo({
      url: 'commitOrder/commitOrder?room_id=' + that.data.detailList.room_id + '&price=' + price ,
    });
  },
  // 跳转到发票
  toFaPiao: function(e){
    console.log(e.currentTarget.dataset.val);
    wx.navigateTo({
      url: 'faPiao/faPiao?url=' + e.currentTarget.dataset.val,
    });
  }
})