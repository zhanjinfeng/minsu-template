var api = require("apis.js");
const Toast = require('../components/dist/toast/toast');

//授权登陆登陆
function login(callback) {
  wx.login({
    success: function (res) {
      if (res.code) {
        Post(api.login, {
          code: res.code
        }, function (data2) {
          wx.setStorageSync("userinfo", JSON.stringify(data2));
          callback(data2);
        });
      } else {
        wx.showToast({
          title: '拒绝了授权',
        })
      }
    }
  });
}

//检查用户是否是管理员
function checkManage() {
  var info = wx.getStorageSync('userinfo');
  var userinfo = info ? JSON.parse(info) : {};
  if (!userinfo.open_id) return false;
  var time = Date.parse(new Date());
  //console.log(time / 1000 - userinfo.last_time );
  if (time / 1000 - userinfo.last_time > 86400) {
    return false;//大于一天了
  }
  if (!userinfo.is_manage) return false;
  return true;
}

//检查是否授权登陆了  不使用微信的 checksession来判断 type 等于true 的时候代表需要 SETDATA
function checkAuthLogin(type) {
  var info = wx.getStorageSync('userinfo');
  var userinfo = info ? JSON.parse(info) : {};
  if (!userinfo.open_id) return false;
  var time = Date.parse(new Date());
  //console.log(time / 1000 - userinfo.last_time );
  if (time / 1000 - userinfo.last_time > 86400) {
    return false;//大于一天了
  }
  if (type == true) {
    module.exports.that.setData({
      userinfo: userinfo
    });
  }
  return true;
}
//检查是否手机号登陆
function checkLogin() {
  var info = wx.getStorageSync('userinfo');
  var userinfo = JSON.parse(info);
  if (!userinfo.mobile) return false;
  module.exports.that.setData({
    userinfo: userinfo
  });
  return true;
}

//获取OPENID
function getOpenId() {
  var info = wx.getStorageSync('userinfo');
  var userinfo = info ? JSON.parse(info) : {};
  if (!userinfo.open_id) return 0;
  return userinfo.open_id;
}

//定位当前的城市 会把当前的城市返回给callback
function dingWei(cityList, callback) {
  var city = wx.getStorageSync('city');
  var cityinfo = city ? JSON.parse(city) : {};
  if (!cityinfo.city_id) { //如果缓存里面解析不到城市ID
    for (var a in cityList) {
      if (cityList[a].default == 1) {
        cityinfo = {
          city_id: cityList[a].city_id,
          city_name: cityList[a].city_name,
          city_lat: cityList[0].lat,
          city_lng: cityList[0].lng
        };
        break;
      }
    }
    if (!cityinfo.city_id) { //标识没有定位到默认城市
      cityinfo = {
        city_id: cityList[0].city_id,
        city_name: cityList[0].city_name,
        city_lat: cityList[0].lat,
        city_lng: cityList[0].lng
      };
    }
    module.exports.setCity(cityinfo.city_id, cityinfo.city_name);
    if (callback != undefined) {
      callback(cityinfo);
    }
  } else {
    var is_city = 0;
    for (var a in cityList) {
      if (cityList[a].city_id == cityinfo.city_id) {
        cityinfo = {
          city_id: cityList[a].city_id,
          city_name: cityList[a].city_name,
          city_lat: cityList[a].lat,
          city_lng: cityList[a].lng
        };
        is_city = 1;
        break;
      }
    }
    if (is_city == 0) {
      cityinfo = {
        city_id: cityList[0].city_id,
        city_name: cityList[0].city_name,
        city_lat: cityList[0].lat,
        city_lng: cityList[0].lng
      };
    }
    module.exports.setCity(cityinfo.city_id, cityinfo.city_name);
    if (callback != undefined) {
      callback(cityinfo);
    }
  }
}

//获取所有的城市
function getCityList(callback) {
  Post('/api/city/getCityList', {}, function (cityList) {
    callback(cityList);
  });
}

function getCity() {
  var city = wx.getStorageSync('city');
  var cityinfo = city ? JSON.parse(city) : {};
  return cityinfo;
}

//设置当前的城市
function setCity(city_id, city_name, city_lat, city_lng) {
  var city = {
    city_id: city_id,
    city_name: city_name,
    city_lat: city_lat,
    city_lng: city_lng
  };
  var cityinfo = JSON.stringify(city);
  wx.setStorageSync('city', cityinfo);
}


//获取日期
function getDateStr(AddDayCount, type) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期 
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1;//获取当前月份的日期 
  var d = dd.getDate();

  if (m < 10) {
    m = "0" + m;
  }
  if (d < 10) {
    d = "0" + d;
  }
  if (type == 1) {
    return m + "月" + d + "日";
  }
  return y + "-" + m + "-" + d;
}

//获得选择的开始结束时间日期
function getBgEndDate() {
  var date = wx.getStorageSync('wxb_bg_end_date');
  // console.log(date);
  var bg_date = getDateStr(0);
  //console.log(bg_date);
  if (date) {
    var dateobj = JSON.parse(date);
    console.log(dateobj.bg_date);
    console.log(bg_date);
    if (dateobj.bg_date && dateobj.bg_date >= bg_date) {
      return dateobj;
    }
  }
  var dateobj = {
    day: 2,
    day2: 1,
    bg_date: getDateStr(0),
    end_date: getDateStr(1),
    bg_date1: getDateStr(0, 1),
    end_date1: getDateStr(1, 1),
  };
  return dateobj;
}
//全部用POST
function Post(api, params, callback,types = "POST") {
  if (!module.exports.globalData.apiurl) {
    wx.getExtConfig({
      success: function (res) {
        module.exports.globalData = res.extConfig;
        PostMain(api, params, callback, types);
      }
    })
  } else {
    PostMain(api, params, callback, types);
  }
}

function PostMain(api, params, callback, types) {
  var apiurl = module.exports.globalData.apiurl + api + '?appid=' + module.exports.globalData.appid
    + '&appkey=' + module.exports.globalData.appkey;
  wx.request({
    url: apiurl,
    data: params,
    method: types,
    dataType: 'json',
    success: function (data) {
      //wx.hideLoading();
      switch (data.data.code) {
        case 100:
          break;
        case 101:
          break;
        case 200:
          callback(data.data.data);
          break
        default:
          Toast({
            message: data.data.msg,
            selector: '#zan-toast-test'
          });
          break;
      }
    },
    fail: function (data) {
      wx.hideLoading();
      wx.showToast({
        title: '请求接口超时',
      })
    }
  })
}


//上传图片 
// param img 图片；
function fileupload(mdl = '', callback) {
  var datas = [];
  wx.chooseImage({
    count: 9, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      console.log('filePath',res);
      var tempFilePaths = res.tempFilePaths;
      wx.showLoading({
        title: '图片上传中..',
      });
      for(let i in tempFilePaths){
        wx.uploadFile({
          url: module.exports.globalData.apiurl + api.upload, //仅为示例，非真实的接口地址 本地：'http://w7.com/'
          filePath: tempFilePaths[i],
          name: 'file',
          formData: {
            'mdl': mdl
          },
          success: function (res) {
            wx.hideLoading();
            var data = JSON.parse(res.data);//你大爷的强制返回字符串；强制转json
            callback(data.data);
          },
          fail: function (res) {
            wx.showToast({
              title: '图片上传中',
            });
          }
        });
        wx.showToast({
          title: '上传成功',
        });
      }   
    }
  });

}

//检查商户的登录情况 登录状态返回CODE 
function getStoreCode() {
  var info = wx.getStorageSync('storeinfo');
  var storeinfo = info ? JSON.parse(info) : {};
  if (!storeinfo.code) return false;
  var time = Date.parse(new Date());
  if (time / 1000 - storeinfo.last_time > 86400) {
    return false;//大于一天了
  }
  return storeinfo.code;
}

function setStoreCode(code) {
  var store = {
    code: code,
    last_time: Date.parse(new Date()) / 1000
  };
  wx.setStorageSync('storeinfo', JSON.stringify(store));
  return true;
}

function getStyle(data) {
  var data = JSON.parse(data);
  var skin = !data.skin ? '#009966' : data.skin;
  module.exports.that.setData({
    color: skin,
    setting: data,
  });
  if (data.app_name) {
    wx.setNavigationBarTitle({ title: data.app_name });
  }
  wx.setNavigationBarColor({ backgroundColor: skin, frontColor: '#ffffff' });
}


//设置网站风格
function style() {

  var skin = wx.getStorageSync('wxb_skin');
  var data = skin ? JSON.parse(skin) : [];
  var _time = data.last_time ? data.last_time : Date.parse(new Date()) / 1000;
  var this_time = Date.parse(new Date()) / 1000;
  if (!skin || this_time >= _time) {
    Post('/api/data/getSkinSetting', {}, function (data) {
      wx.setStorageSync('wxb_skin', JSON.stringify(data));
      module.exports.getStyle(JSON.stringify(data));
    });
  } else {
    module.exports.getStyle(skin);
  }

}

// 判断是否


module.exports = {
  userinfo: '',
  getStyle: getStyle,
  checkManage: checkManage,
  style: style,
  login: login,
  checkAuthLogin: checkAuthLogin,
  checkLogin: checkLogin,
  getOpenId: getOpenId,
  dingWei: dingWei,
  setCity: setCity,
  getCityList: getCityList,
  getCity: getCity,
  getBgEndDate: getBgEndDate,
  getStoreCode: getStoreCode,
  setStoreCode: setStoreCode,
  fileupload: fileupload,
  Post: Post,
  globalData: [],
  that: null,
  api: api,
  lock: 0,//用于其他的锁定
}
