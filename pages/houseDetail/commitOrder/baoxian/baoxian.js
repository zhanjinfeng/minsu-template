// pages/houseDetail/commitOrder/baoxian/baoxian.js
const Toast = require('../../../../components/dist/toast/toast');
let utils = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFinshed: false,
    list: {},
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
    date: '请选择您的出生日期',
    name: '',
    id_card: '',
    isSelected_man: true,
    isSelected_woman: false
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  selectSex(e){
    let id = e.currentTarget.dataset.id
    if(id=='man'){
      this.setData({
        isSelected_man: true,
        isSelected_woman: false
      })
    }
    else{
      this.setData({
        isSelected_man: false,
        isSelected_woman: true
      })
    }
  },
  name(e){
    this.setData({
      name: e.detail.value
    })
  },
  id_card(e){
    this.setData({
      id_card: e.detail.value
    })
  },
  submit(){
    let name = this.data.name
    let id_card = this.data.id_card
    if(name==''){
      this.handleClick('姓名不能为空')
      return
    }
    else if(id_card == ''){
      this.handleClick('证件号码不能为空')
      return
    }
    else {
      if(this.data.index==0){
        if(utils.isCardID(id_card)==true){
          //console.log('身份证阔以')  
        }
        else{
          this.handleClick(utils.isCardID(id_card))
          return
        }
      }
      if(this.data.index==1){
        var filter_jg = /^[a-zA-Z0-9]{7,21}$/  //军官证
        if(filter_jg.test(id_card)==false){
          this.handleClick('证件格式不正确')
          return
        }
      }
      if (this.data.index == 2) {
        var filter_hz = /^[a-zA-Z0-9]{3,21}$/  //军官证
        if (!filter_hz.test(id_card)) {
          this.handleClick('证件格式不正确')
          return
        }
      }
    }
    if(this.data.index!=0){
      if(this.data.date=='请选择您的出生日期'){
        this.handleClick('生日不能为空')
        return
      }
    }
    var list = {
      name: this.data.name,
      card_num: this.data.id_card,
      card_type: this.data.index
    }
    wx.setStorageSync("baoxian_list", list)
    console.log(list)
    wx.navigateBack({
      delta: -1
    })
  },
  handleClick(msg) {
    Toast({
      message: msg,
      selector: '#zan-toast-test'
    });
  },
  deleteBaoxian(){
    wx.clearStorageSync("baoxian_list")
    wx.navigateBack({
      delta: -1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync("baoxian_list")){
      this.setData({
        isFinshed: true,
        list: wx.getStorageSync("baoxian_list")
      })
      wx.setNavigationBarTitle({
        title: '保险信息',
      })
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