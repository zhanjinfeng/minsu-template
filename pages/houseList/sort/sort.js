// pages/search/pages/sort/sort.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        value: '1',
        // 选项文案
        name: '推荐排序',
      },
      {
        value: '2',
        name: '距离排序',
      },
      {
        value: '3',
        name: '价格低到高',
      },
      {
        value: '4',
        name: '价格高到低',
      },
      {
        value: '5',
        name: '好评排序'
      }
    ],
    checkedValue: 1,
    activeColor: '#ff8008'
  },
  handleSelectChange({ detail }) {
    wx.setStorageSync("search_sort_value", detail.value);
    wx.setStorageSync("isQuery", true);
    wx.navigateBack();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.value){
      if(options.value==0) options.value++
      this.setData({
        checkedValue: options.value
      });
    }
  },

})