var apis = {
  index_banner: '/api/minsu.data/getBanner',    //首页背景图
  minsu_index: '/api/minsu.index/index',    //房间列表
  house_detail: '/api/minsu.index/detail',    //房屋详情
  create_order: '/api/minsu.order/create',   //创建订单
  order_detail: '/api/minsu.order/orderDetail',    //订单详情
  order_list: '/api/minsu.order/geTorder',    //订单列表
  captcha: '/api/login/captcha',    //获取验证码
  getLocation: '/api/minsu.index/getCityName',    //获取定位城市
  query_place: '/api/minsu.index/searchMap',  //位置查询
  getConfig: '/api/minsu.index/getConfig',   //首页小程序配置信息
  login: '/api/login/index',  //登录
  pay: '/api/minsu.order/getPayment',   //支付
  bindPicture: '/api/login/bind',  // 绑定用户头像
  cancle: '/api/minsu.order/cancel',    //取消订单
  getPhone: '/api/login/getPhone',  //获取用户手机号码
  getSMS: '/api/login/sendSms',   //获取短信验证码
  bindPhone: '/api/login/bind',   //绑定用户手机
  upload: '/api/upload/upload',   //上传图片
  delImage: '/api/upload/delImage',    //删除上传图片
  comment: '/api/minsu.order/comment',    //提交评论
  getComment: '/api/minsu.index/getComment',   //获取评论信息
}

module.exports = apis;