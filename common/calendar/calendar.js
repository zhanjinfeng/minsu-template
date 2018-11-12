var app = getApp();
var utils = require('../../utils/util.js')

Page({
  data: {
    date: [],
    totalmonth: 5,//总共多少个月
    bgindex: 0,
    endindex: 0,
    bg_date: '',
    end_date: '',
    bg_date1: '',
    end_date1: '',
    day: 0, //一共几天
    day2: 0, //一共几晚
  },
  onLoad: function (options) {
    let a = 0
    var that = this;
    var r_fount_month = that.data.totalmonth;
    var monthdate = utils.getMonthDate();
    for(let i=0;i<monthdate.length;i++){
      for(let k=0;k<monthdate[i].day.length;k++){
        monthdate[i].day[k].select = a
        if (monthdate[i].day[k].day3){
          if (monthdate[i].day[k].day3.replace(/[^0-9]/ig, "") == options.bg_date.replace(/[^0-9]/ig, "")){      
            monthdate[i].day[k].select = 1
            a = 3
          }
          if (monthdate[i].day[k].day3.replace(/[^0-9]/ig, "") == options.end_date.replace(/[^0-9]/ig, "")){
            a = 0
            monthdate[i].day[k].select = 2
          }
       }
      }
    }
    if(options.alreadydate){
      for(let i=0;i<monthdate.length;i++){
        for(let j=0;j<monthdate[i].day.length;j++){
          for (let k = 0; k < JSON.parse(options.alreadydate).length;k++){
            if (monthdate[i].day[j].day1 == JSON.parse(options.alreadydate)[k]){
              monthdate[i].day[j]['already'] = true
            }
          }
        }
      }
    }
    that.setData({
      date: monthdate,
      bgindex: 0,
      endindex: 0,
      bg_date: options.bg_date,
      end_date: options.end_date
    });
  },
  dayClick: function (e) {
    var that = this;
    if(that.data.end_date){
      that.setData({
        end_date: ''
      })
    }
    var index = e.target.dataset.in;
    var type = e.target.dataset.type;
    if (type == 0) return;
    var bgindex = that.data.bgindex;
    var endindex = that.data.endindex;
    var bgdate = that.data.bg_date;
    var enddate = that.data.end_date;
    var bgdate1 = that.data.bg_date1;
    var enddate1 = that.data.end_date1;
    var date = that.data.date;
    if (endindex == index || bgindex == index) return; //这时候不用处理
    //重新选择时间
    if (bgindex == 0 && endindex == 0) {
      bgindex = index;
      for (var a in date) {
        for (var j in date[a].day) {
          if (date[a].day[j].dayIndex == index) {
            if (!date[a].day[j].already){
              date[a].day[j].select = 1;
              bgdate = date[a].day[j].day1;
              bgdate1 = date[a].day[j].day3;
            }
            else{
              that.setData({
                end_date: '111'
              });
              wx.showModal({
                showCancel: false,
                content: '很抱歉，您选择的时间段包含无房日期',
              })
              return
            }
          } else {
            date[a].day[j].select = 0;
          }
        }
      }
    } else if (endindex == 0) {
      if (bgindex > index) {
        bgindex = index;
        for (var a in date) {
          for (var j in date[a].day) {
            if (date[a].day[j].dayIndex == index) {
              if (date[a].day[j].already){
                wx.showModal({
                  showCancel: false,
                  content: '很抱歉，您选择的时间段包含无房日期',
                })
                return
              }
              else{
                date[a].day[j].select = 1;
                bgdate = date[a].day[j].day1;
                bgdate1 = date[a].day[j].day3;
              }
            } else {
              date[a].day[j].select = 0;
            }
          }
        }
        endindex = 0;
        enddate = '';
      } else {
        endindex = index;
        for(let i=0;i<date.length;i++){
          for(let j=0;j<date[i].day.length;j++){
            if (date[i].day[j].dayIndex > bgindex && date[i].day[j].dayIndex < endindex){
              if (date[i].day[j].already){
                wx.showModal({
                  showCancel: false,
                  content: '很抱歉，您选择的时间段包含无房日期',
                })
                return
              }
            }
          }
        }
        for (var a in date) {
          for (var j in date[a].day) {

            if (date[a].day[j].dayIndex == index) {
              date[a].day[j].select = 2;
              enddate = date[a].day[j].day1;
              enddate1 = date[a].day[j].day3;
            } else if (bgindex == date[a].day[j].dayIndex) {
              date[a].day[j].select = 1;
            } else if ((date[a].day[j].dayIndex < endindex) && (date[a].day[j].dayIndex > bgindex)) {
              date[a].day[j].select = 3;
            } else {
              date[a].day[j].select = 0;
            }
          }
        }
      }
    } else {
      if (index < bgindex || index > endindex) { //重新选择
        bgindex = index;
        for (var a in date) {
          for (var j in date[a].day) {
            if (date[a].day[j].dayIndex == index) {
              date[a].day[j].select = 1;
              bgdate = date[a].day[j].day1;
              bgdate1 = date[a].day[j].day3;
            } else {
              date[a].day[j].select = 0;
            }
          }
        }
        enddate = '';
        endindex = 0;
      } else if (index > bgindex && index < endindex) { //endindex重新选择了
        endindex = index;
        for (var a in date) {
          for (var j in date[a].day) {
            if (date[a].day[j].dayIndex == index) {
              date[a].day[j].select = 2;
              enddate = date[a].day[j].day1;
              enddate1 = date[a].day[j].day3;
            } else if (bgindex == date[a].day[j].dayIndex) {
              date[a].day[j].select = 1;
            } else if ((date[a].day[j].dayIndex < endindex) && (date[a].day[j].dayIndex > bgindex)) {
              date[a].day[j].select = 3;
            } else {
              date[a].day[j].select = 0;
            }
          }
        }
      }
    }
    var day = 0;
    that.setData({
      bgindex: bgindex,
      endindex: endindex,
      date: date,
      end_date: enddate,
      bg_date: bgdate,
      end_date1: enddate1,
      bg_date1: bgdate1,
    })
    if (enddate && bgdate) {
      day = utils.DateDiff(enddate, bgdate);
      this.setData({
        day: day + 1,
        day2: day,
      })
      setTimeout((function() {
        this.submit()
      }).bind(this),300)
    }
  },
  submit: function () {
    var dateinfo = {
      day: this.data.day,
      day2: this.data.day2,
      end_date: this.data.end_date,
      bg_date: this.data.bg_date,
      end_date1: this.data.end_date1,
      bg_date1: this.data.bg_date1,
    };
    var dateinfo2 = JSON.stringify(dateinfo);
    wx.setStorageSync('wxb_bg_end_date', dateinfo2);
    wx.setStorageSync("isQuery", true);
    wx.navigateBack();
  }
})

