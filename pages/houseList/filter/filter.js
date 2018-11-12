// pages/search/pages/filter/filter.js
var i = 2;   //判断动画是展开还是收起
var p = 2;
var service = [];
var filter_num = 0; //选择的条件数
var list; //搜索房屋条件
var arr = ['house_level', 'recommend', 'room_type', 'house_type', 'service', 'feature'];
var wxb = require('../../../utils/wxb.js');     //API核心接口文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMin: 0,
    leftMax: 6,
    rightMin: 0,
    rightMax: 6,
    leftValue: 0,
    rightValue: 6,
    leftPer: '90%',
    activeList: {
        house_level: [
          {
            id: 0,
            parm: 1,
            title: '豪华',
            active: false,
            icon: 'icon-jingpin1'
          },
          {
            id: 1,
            parm: 2,
            title: '精品',
            active: false,
            icon: 'icon-jingpin'
          },
          {
            id: 2,
            parm: 3,
            title: '舒适',
            active: false,
            icon: 'icon-zuowu-xiaomai'
          },
        ],
        recommend: [
          {
            id: 0,
            title: '豪宅',
            active: false
          },
          {
            id: 1,
            title: '超赞房东',
            active: false
          },
          {
            id: 2,
            title: '超赞新房',
            active: false
          },
          {
            id: 3,
            title: '新房特惠',
            active: false
          },
          {
            id: 4,
            title: '自营民宿',
            active: false
          },
          {
            id: 5,
            title: '独立房间',
            active: false
          },
          {
            id: 6,
            title: '连住优惠',
            active: false
          },
          {
            id: 7,
            title: '途家优选',
            active: false
          },
          {
            id: 8,
            title: '斯维登',
            active: false
          },
          {
            id: 9,
            title: '闪灯',
            active: false
          },
          {
            id: 10,
            title: '信用免押金',
            active: false
          },
          {
            id: 11,
            title: '提供发票',
            active: false
          },
        ],
        room_type: [
          {
            id: 0,
            parm: 1,
            title: '一居',
            active: false
          },
          {
            id: 1,
            parm: 2,
            title: '二居',
            active: false
          },
          {
            id: 2,
            parm: 3,
            title: '三居',
            active: false
          },
          {
            id: 3,
            parm: 4,
            title: '四居及以上',
            active: false
          },
        ],
        house_type: [
          {
            id: 0,
            parm: 1,
            title: '公寓',
            active: false
          },
          {
            id: 1,
            parm: 2,
            title: '别墅',
            active: false
          },
          {
            id: 2,
            parm: 3,
            title: '复式',
            active: false
          },
          {
            id: 3,
            parm: 4,
            title: '农家乐',
            active: false
          },
          {
            id: 4,
            parm: 5,
            title: '木屋',
            active: false
          },
          {
            id: 5,
            parm: 6,
            title: '四合院',
            active: false
          },
          {
            id: 6,
            parm: 7,
            title: '老洋房',
            active: false
          },
          {
            id: 7,
            parm: 8, 
            title: '客栈',
            active: false
          }
        ],
        service: [
          {
            id: 0,
            parm: 9,
            title: '无线网络',
            active: false,
            icon: 'icon-wifi'
          },
          {
            id: 1,
            parm: 18,
            title: '全天热水',
            active: false,
            icon: 'icon-quantianreshui'
          },
          {
            id: 2,
            parm: 67,
            title: '电梯',
            active: false,
            icon: 'icon-dianti'
          },
          {
            id: 3,
            parm: 13,
            title: '洗衣机',
            active: false,
            icon: 'icon-xiyiji'
          },
          {
            id: 4,
            parm: 15,
            title: '电视',
            active: false,
            icon: 'icon-dianshi'
          },
          {
            id: 5,
            parm: 11,
            title: '空调',
            active: false,
            icon: 'icon-kongtiao'
          },
          {
            id: 6,
            parm: 14,
            title: '冰箱',
            active: false,
            icon: 'icon-bingxiang'
          },
          {
            id: 7,
            parm: 53,
            title: '微波炉',
            active: false,
            icon: 'icon-weibolu'
          }
        ],
        feature: [
          {
            id: 0,
            parm: 1,
            title: '做饭方便',
            active: false
          },
          {
            id: 1,
            parm: 2,
            title: '长租首选',
            active: false
          },
          {
            id: 2,
            parm: 3,
            title: '宠物同行',
            active: false
          },
          {
            id: 3,
            parm: 4,
            title: '聚会轰趴',
            active: false
          },
          {
            id: 4,
            parm: 5,
            title: '海景房',
            active: false
          },
          {
            id: 5,
            parm: 6,
            title: '湖景房',
            active: false
          },
          {
            id: 6,
            parm: 7,
            title: '江景房',
            active: false
          },
          {
            id: 7,
            parm: 8,
            title: '山景房',
            active: false
          },
        ]
    },
    priceList: ['￥0','￥200','￥300','￥400','￥500','￥800','不限'],
    stepper: {
      stepper: 0,
      min: 0,
      max: 10,
      size: 'small'
    },
    result: '',
    isActive: false,
    isQuery: true
  },
  // 查询房屋数据
  getHouse: function(params){
    var that = this;
    that.setData({
      isQuery: false
    });
    wxb.Post(wxb.api.minsu_index, params, function (data) {
      var result = 0;
      if (data.total) result = data.total;
      that.setData({
        isQuery: true,
        result: result + '套'
      });
    });
  },
  //展开收起1
  arrowChange(){
    var that = this
    if(i % 2 == 0){
      that.setData({
        isArrow: 'animation: arrow 0.3s;animation-fill-mode: forwards',
        isView: 'animation: view 0.3s;animation-fill-mode: forwards;'
      })
      i++
    }
    else{
      that.setData({
        isArrow: 'animation: arrow2 0.3s;animation-fill-mode: forwards',
        isView: 'animation: view2 0.3s;animation-fill-mode: forwards;'
      })
      i++
    }
  },
  //展开收起2
  arrowChange2(){
    var that = this
    if (p % 2 == 0) {
      that.setData({
        isArrow_2: 'animation: arrow 1s;animation-fill-mode: forwards',
        isView_2: 'animation: view_mating 1s;animation-fill-mode: forwards;'
      })
      p++
    }
    else {
      that.setData({
        isArrow_2: 'animation: arrow2 1s;animation-fill-mode: forwards',
        isView_2: 'animation: view_mating2 1s;animation-fill-mode: forwards;'
      })
      p++
    }
  },
  //选中状态切换
  activeTogg(e){
    var that = this;
    var activeList = that.data.activeList;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var parm = e.currentTarget.dataset.parm;
    var active = 'activeList.' + name + '[' + id + '].active';
    // 判断状态是否为true
    if (e.currentTarget.dataset.active){
      that.setData({
        [active]: false
      });
      if(name == 'recommend'){
        var index = list[name].indexOf(parm);
        list[name].splice(index,1);
        if(list[name].length == 0)  delete list[name];
      }
      else{
        var l = JSON.parse(JSON.stringify(list[name].split(',')));
        var index = l.indexOf(parm.toString());
        l.splice(index, 1);
        list[name] = l.join(',');
        if (l.length == 0) delete list[name];
      }
      filter_num--;
    }
    else{   //状态为false
      that.setData({
        [active]: true
      });
      if(typeof list[name] == "undefined"){
        service = [];
        service.push(parm);
      }  
      else{ 
        service = name == 'recommend'?list[name]:list[name].split(',');
        service.push(parm);      
      }
      if (name == 'recommend') list[name] = service;
      else list[name] = service.join(',');
      filter_num++;
    }
    // 选择状态后的进行查询
    that.getHouse(list);
    for(var item in arr){
      for (let i = 0; i < activeList[arr[item]].length; i++) {
        if (activeList[arr[item]][i].active) {       
          that.setData({
            isActive: true
          });
          return;
        }
        else{
          that.setData({
            isActive: false
          })
        }
      }
    }  
  },
  //价格slider滑动
  leftSchange: function (e) {
    var that = this;
    var value = e.detail.value;
    if(value==that.data.rightValue){
      if(that.data.rightValue==6) value--;
      else value++
    }
    that.setData({
      leftValue: value
    });
    if(value<that.data.rightValue){
      var bg_price = that.data.priceList[value].slice(1);
      var end_price = that.data.priceList[that.data.rightValue].slice(1);
    }
    else{
      var end_price = that.data.priceList[value].slice(1);
      var bg_price = that.data.priceList[that.data.rightValue].slice(1);
    }
    list['bg_price'] = bg_price;
    list['end_price'] = end_price;
    wx.setStorageSync("priceList", { bg_price: value, end_price: that.data.rightValue});
    that.getHouse(list);
  },
  rightSchange: function (e) {
    var that = this
    that.setData({
      isQuery: false
    })
    var value = e.detail.value
    if (value == that.data.leftValue) {
      if(that.data.leftValue==6) value--
      else value++
    }
    that.setData({
      rightValue: value
    })
    if (value < that.data.leftValue) {
      var bg_price = that.data.priceList[value].slice(1)
      var end_price = that.data.priceList[that.data.leftValue].slice(1)
    }
    else {
      var end_price = that.data.priceList[value].slice(1)
      var bg_price = that.data.priceList[that.data.leftValue].slice(1)
    }
    list['bg_price'] = bg_price
    list['end_price'] = end_price
    console.log('这是bg:',value,"这是end:",that.data.leftValue)
    wx.setStorageSync("priceList", { bg_price: value, end_price: that.data.leftValue })
    that.getHouse(list);
  },
  //更新选择人数
  handleZanStepperChange({detail: stepper}) {
      var that =this;
      var isActive = false;
      if(stepper != 0)  isActive = true;
      that.setData({
        isQuery: false,
        'stepper.stepper': stepper,
        isActive: isActive
      });
      list['appropriate'] = stepper;
      that.getHouse(list);
  },
  //清除所有选中状态
  clearAll(){
    var that = this;
    var activeList = that.data.activeList;
    that.setData({
      isQuery: false
    });
    for (var item in arr) {
      for (let i = 0; i < activeList[arr[item]].length; i++) {
        if (activeList[arr[item]][i].active) {
          let active = 'activeList.' + arr[item] + '[' + i + '].active'
          that.setData({
            [active]: false
          })
        }
      }
    }
    for(var j in list){
      if(arr.indexOf(j)!=-1){
        delete list[j]
      }
    }
    delete list['bg_price'];
    delete list['end_price'];
    that.setData({
      leftValue: 0,
      rightValue: 6,
      isActive: false,
      'stepper.stepper': 0
    });
    filter_num = 0;
    service = [];
    wx.removeStorageSync("priceList")
    if (wx.getStorageSync("index_dataList")) {
      list = JSON.parse(wx.getStorageSync("index_dataList"));
      that.getHouse(list);
    }
  },
  //确认查看
  confirm(){
    var that = this;
    if(that.data.result=='0套') return;
    wx.setStorageSync("index_dataList", JSON.stringify(list));
    wx.setStorageSync("isQuery", true);
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    filter_num = wx.getStorageSync("filter_num") ? wx.getStorageSync("filter_num") : 0;
    list = JSON.parse(wx.getStorageSync("index_dataList"));
    if(wx.getStorageSync("index_dataList")){
      list =JSON.parse(wx.getStorageSync("index_dataList"));
      that.getHouse(list);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if(wx.getStorageSync("activeList")){
      that.setData({
        activeList: JSON.parse(wx.getStorageSync("activeList")),
        isActive: true
      });
    }
    if(wx.getStorageSync("priceList")){
      console.log(wx.getStorageSync("priceList").bg_price + '和' + wx.getStorageSync("priceList").end_price);
      that.setData({
        leftValue: wx.getStorageSync("priceList").bg_price,
        rightValue: wx.getStorageSync("priceList").end_price
      });
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this
    if(filter_num!=0) wx.setStorageSync("filter_num", filter_num)
    else wx.removeStorageSync("filter_num")
    wx.setStorageSync("activeList", JSON.stringify(that.data.activeList))
  },

})