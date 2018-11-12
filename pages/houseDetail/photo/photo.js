// pages/houseDetail/photo/photo.js
let imgUrlsList_origin = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoList: [
      {
        id: 0,
        title: '全部'
      },
      {
        id: 1,
        title: '客厅'
      }, {
        id: 2,
        title: '卧室'
      }, {
        id: 3,
        title: '厨房'
      }, {
        id: 4,
        title: '卫生间'
      }, {
        id: 5,
        title: '外景'
      }, {
        id: 6,
        title: '周边'
      }
    ],
    imgUrlsList: [
    ],
    selectedId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var imgUrlsList = JSON.parse(options.imgUrlsList);
    imgUrlsList_origin = imgUrlsList;
    this.setData({
      imgUrlsList: imgUrlsList
    });
  },
  //切换图片分类
  changeSelect(e){ 
    var imgUrlsList1 = JSON.parse(JSON.stringify(imgUrlsList_origin));
    var imgUrlsList2 = [];
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    if(title == '全部'){
      imgUrlsList2 = imgUrlsList1;
    }
    else{
      for(let i = 0; i<imgUrlsList1.length;i++){
        if(imgUrlsList1[i].images_name == title){
          imgUrlsList2.push(imgUrlsList1[i]);
        }
      }
    }
    this.setData({
      selectedId: id,
      imgUrlsList: imgUrlsList2
    })
  },
  // 查看图片
  prevImg: function(){
    var that = this;
    var arr = [];
    if(that.data.imgUrlsList != []){
      for(let i in that.data.imgUrlsList)
        arr.push(that.data.imgUrlsList[i].path);
    }
    wx.previewImage({
      urls: arr,
    })
  },
  
})