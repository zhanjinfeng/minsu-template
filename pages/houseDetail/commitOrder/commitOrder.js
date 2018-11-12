// pages/houseDetail/commitOrder/commitOrder.js
const Toast = require('../../../components/dist/toast/toast');
var utils = require('../../../utils/util.js');
var wxb = require('../../../utils/wxb.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: {},
    price: '',
    days: 1,
    name: '',
    phone: '',
    id_card: '',
    otherList: ['限时退：取消订单，将收取100%房费作为违约金支付给房东；入住后若提前退房，将收取100%的剩余房费作为违约金支付给房东。','请根据实际入住人数填写，人数不同房屋报价也有所不同'],
    stepper: {  //房屋套数计数器
      stepper: 1,
      min: 1,
      max: 1,
      // 尺寸
      size: 'small'
    },
    stepper2: {   //入住人数计数器
      stepper: 1,
      min: 1,
      max: 1,
      // 尺寸
      size: 'small'
    },
    array: ['身份证', '军官证', '护照'],
    objectArray: [
      {
        id: 0,
        name: '身份证'
      },
      {
        id: 1,
        name: '军官证'
      },
      {
        id: 2,
        name: '护照'
      }
    ],
    index: 0,
    isShow: false,
    baoxian: '未使用',   //保险是否使用
    peopleCount: 1,
    isDisabled: false
  },
  // 提交订单 /form模板id
  formSubmit: function (e) {
    var that = this;
    var name = that.data.name
    var phone = that.data.phone
    var id_card = that.data.id_card
    if (name == '') {
      that.openToast('姓名不能为空')
      return
    }
    if (phone == '') {
      that.openToast('手机号码不能为空')
      return
    }
    else {
      var filter_sj = /^1[3|4|5|7|8][0-9]{9}$/      //手机号码
      if (filter_sj.test(phone) == false) {
        that.openToast('手机号码格式错误')
        return
      }
    }
    if (id_card == '') {
      that.openToast('证件号码不能为空')
      return
    }
    else {
      if (that.data.index == 0) {
        if (utils.isCardID(id_card) == true) {
          //console.log('身份证阔以')  
        }
        else {
          that.openToast(utils.isCardID(id_card))
          return
        }
      }
      if (that.data.index == 1) {
        var filter_jg = /^[a-zA-Z0-9]{7,21}$/  //军官证
        if (filter_jg.test(id_card) == false) {
          that.openToast('证件格式不正确')
          return
        }
      }
      if (that.data.index == 2) {
        var filter_hz = /^[a-zA-Z0-9]{3,21}$/  //军官证
        if (!filter_hz.test(id_card)) {
          that.openToast('证件格式不正确')
          return
        }
      }
    }
    var data = {
      room_id: that.data.dataList.room_id,
      bg_date: that.data.dataList.bg_date,
      end_date: that.data.dataList.end_date,
      days: that.data.days,
      name: name,
      phone: phone,
      cardType: that.data.index,
      idCard: id_card,
      roomCount: that.data.stepper["stepper"],
      peopleCount: that.data.stepper2["stepper"],
      insurance: that.data.baoxian == '未使用' ? 0 : 1,
      openid: JSON.parse(wx.getStorageSync("userinfo")).open_id,
      formId: e.detail.formId
    }
    if (that.data.baoxian == '已使用') {
      data['insurance'] = wx.getStorageSync("baoxian_list");
    }
    that.setData({
      isDisabled: true
    });
    wxb.Post(wxb.api.create_order, data, function (data) {
      if (data) {
        that.openToast('提交订单成功！');
        setTimeout(function () {
          Toast.clear();
          wx.navigateTo({
            url: '../../order/pay/pay?order_id=' + data.order_id,
          });
          that.setData({
            isDisabled: false
          });
        }, 1000);
      }
    });
  },
  //弹出层显示转换
  togglePopup() {
    this.setData({
      isShow: !this.data.isShow
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
    })
  },
  //房屋数量stepper
  handleZanStepperChange({
    // stepper 代表操作后，应该要展示的数字，需要设置到数据对象里，才会更新页面展示
    detail: stepper
    }) {
    this.setData({
      'stepper.stepper': stepper,
      'stepper2.max': stepper * this.data.peopleCount,
    });
    if (this.data.stepper2.stepper>this.data.stepper * this.data.peopleCount){
      this.setData({
        'stepper2.stepper': stepper * this.data.peopleCount,
      })
    }
  },
  //入住人数stepper
  handleZanStepperChange2({
    // stepper 代表操作后，应该要展示的数字，需要设置到数据对象里，才会更新页面展示
    detail: stepper
    }) {
    this.setData({
      'stepper2.stepper': stepper
    });
  },
  //toast轻提示
  openToast(msg) {
    Toast({
      message: msg,
      selector: '#zan-toast-test'
    });
  },
  //跳转到房费明细页面
  navigatorToHouseCost(e){
    var that = this;
    wx.setStorageSync("houseCost", JSON.stringify({
      minsu_name: that.data.dataList.title,
      price: e.currentTarget.dataset.price,
      count: that.data.stepper.stepper
    }));
    wx.navigateTo({
      url: '../../order/houseCost/houseCost', 
    });
  },
  //跳转到填写保险信息页面
  navigatorToBaoxian(){
    wx.navigateTo({
      url: 'baoxian/baoxian',
    })
  },
  //获取入住人姓名
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  //获取省份证
  getIdCard(e) {
    this.setData({
      id_card: e.detail.value
    })
  },
  //获取手机号
  getPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    var that = this;
    var day = 1;
    if (wx.getStorageSync("wxb_bg_end_date")) {
      day = JSON.parse(wx.getStorageSync("wxb_bg_end_date")).day2
    }
    if (wxb.checkAuthLogin()){
      that.setData({
        phone: JSON.parse(wx.getStorageSync("userinfo")).mobile == 0 ? "" : JSON.parse(wx.getStorageSync("userinfo")).mobile
      });
    }
    // 请求相关房屋信息
    wxb.Post(wxb.api.house_detail, { room_id: options.room_id }, function (data) {
      if (data.room_number){
        that.setData({
          dataList:  {
            room_id: data.room_id,
            imgUrl: data.ImageList[0].path,
            title: data.introduction.minsu_name,
            price1: options.price * that.data.days+'.00',
            is_deposit: data.is_deposit,
            depositMoney: data.depositMoney,
            bg_date: JSON.parse(wx.getStorageSync("wxb_bg_end_date")).bg_date,
            end_date: JSON.parse(wx.getStorageSync("wxb_bg_end_date")).end_date,
            room_number: data.room_number,
            recommendedGuests: data.recommendedGuests
          },
          days: day,
          price: options.price * day,
          "stepper.max": data.room_number,
          "stepper2.max": data.recommendedGuests,
          peopleCount: data.recommendedGuests
        });
      }
    });
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(wx.getStorageSync("baoxian_list")){
      this.setData({
        baoxian: '已使用'
      })
    }
    else{
      this.setData({
        baoxian: '未使用'
      })
    }
  },

})