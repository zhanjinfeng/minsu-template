// pages/order/order.js
const Toast = require('../../components/dist/toast/toast');
var wxb = require('../../utils/wxb.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        id: 8,
        title: '全部'
      }, 
      {
        id: 0,
        title: '待支付'
      }, 
      {
        id: 1,
        title: '待入住'
      }
    ],
    orderList: [],
    selectedId: 8,
    curr_page: 1,
    isLogin: false,
    total: '',
    isHideLoadMore: true
  },
  // 跳转至登录界面
  toLogin: function(){
    wx.navigateTo({
      url: '../login/login?isOrder=1',
    });
  },
  //tab导航条订单状态选择切换
  handleTabChange(e){
    var that = this;
    that.setData({
      selectedId: e.detail,
      orderList: []
    });
    that.openToast();
    that.getOrder(e.detail);
  },
  //跳转到支付页面
  navigatorToPay(e){
    var that = this;
    wx.navigateTo({
      url: 'pay/pay?order_id=' + e.currentTarget.dataset.value,
    });
  },
  //跳转到订单详情
  navigatorToOrderDetail(e){
    wx.navigateTo({
      url: 'orderdetail/orderdetail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 跳转到评价页面
  toComment: function(e){
    wx.navigateTo({
      url: 'comment/comment?id=' + e.currentTarget.dataset.id,
    });
  },
  //totast请提示加载中
  openToast() {
    Toast.loading({
      message: '加载中',
      selector: '#zan-toast-test',
      timeout: 500
    });
  },
  // 获取订单数据
  getOrder: function(val,page=1){
    var that = this;
    wxb.Post(wxb.api.order_list, { type: val,openid: JSON.parse(wx.getStorageSync("userinfo")).open_id, current_page: page }, function (data) {
      that.setData({
        orderList: that.data.orderList.concat(data.data),
        total: data.total,
        curr_page: data.current_page,
        isHideLoadMore: true
      });
      Toast.clear();
    },"GET"); 
  },
  // 联系房东
  contactOwner: function(e){
    var pho = e.currentTarget.dataset.pho;
    wx.makePhoneCall({
      phoneNumber: pho,
    });
  },
  // 取消订单
  cancleOrder: function(e){
    wx.showModal({
      title: '提示',
      content: '请确认是否取消订单',
      cancelColor: "#FD8238",
      confirmColor: '#ccc',
      confirmText: '确认',
      cancelText: '点错了',
      success: function(res){
        if (res.confirm) {
          console.log(e.target.dataset.id);
          wxb.Post(wxb.api.cancle, { order_id: e.target.dataset.id, openid: JSON.parse(wx.getStorageSync("userinfo")).open_id }, function (data) {

          });
        }
      }
    })
    
  },
  onLoad: function(options){
    var that = this;
    that.setData({
      isLogin: wxb.checkAuthLogin(),
      orderList: []
    });
    if (wxb.checkAuthLogin()) {
      that.openToast();
      that.getOrder(that.data.selectedId);
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      isLogin: wxb.checkAuthLogin()
    });
    if(wx.getStorageSync("isOrder")){
      that.getOrder(that.data.selectedId);
      wx.removeStorageSync("isOrder");
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if(that.data.total == that.data.orderList.length) return;
    that.setData({
      isHideLoadMore: false
    });
    that.getOrder(that.data.selectedId, parseInt(that.data.curr_page) + 1);
  },
})