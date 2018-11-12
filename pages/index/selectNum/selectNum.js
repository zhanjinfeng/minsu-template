// pages/index/pages/selectNum/selectNum.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        value: '1',
        name: '1人',
      },
      {
        value: '2',
        name: '2人',
      },
      {
        value: '3',
        name: '3人',
      },
      {
        value: '4',
        name: '4人',
      },
      {
        value: '5',
        name: '5人',
      },
      {
        value: '6',
        name: '6人',
      },
      {
        value: '7',
        name: '7人',
      },
      {
        value: '8',
        name: '8人',
      },
      {
        value: '9',
        name: '9人',
      },
      {
        value: '10',
        name: '10人以上',
      },
      {
        value: '0',
        name: '不限人数'
      }
    ],
    selectValue: '0'
  },
  handleSelectChange(e) {
    this.setData({
      selectValue: e.currentTarget.dataset.value
    })
    wx.setStorageSync("selectNum", e.currentTarget.dataset.num)
    let pages = getCurrentPages
    let back = pages.length - 2
    wx.navigateBack({
      delta: back
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var num = '';
    if(options.num == '不限人数'){
      num = 0
    }
    else{
      if(options.num == '10人以上'){
        num = 10
      }
      else{
        num = options.num.slice(0,1)
      }
    }
    this.setData({
      selectValue: num
    })
  },

})