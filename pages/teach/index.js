// pages/teach/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classFlag:true,//课程选择
    details:true,//详情展示
    flagLoad:true,
    teacherDetailsImg:"",
    list:[],
    detailsWidth:200,
    teachContentWidth:100,
    teachBodyHeight: 500, //tbody滚动高度

    imgList: ['../../image/tb1.jpg', '../../image/tb2.jpg', '../../image/tb3.jpg', '../../image/tb4.jpg'],
    indicatorDots: true,  //小点

    autoplay: true,  //是否自动轮播

    interval: 3000,  //间隔时间

    duration: 3000,  //滑动时间
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {         //
        var height = (res.windowHeight - 87.5) * 2;
        that.setData({
          teachBodyHeight: height,
          teachContentWidth: res.windowWidth - 100,
          detailsWidth: res.windowWidth-56,
        })
      }
    });
    that.requestData("1")
  },
  /**
   * 请求数据
   */
  requestData: function (e) {
    var that = this;
      wx.request({
        url: 'https://173ca97752.51mypc.cn:443/teacher/getAllTeacher',
        data: {
        },
        method: 'post',
        success: function (res) {
          console.log(res)
          that.setData({
            list: res.data.result.result,
            pageSize: res.data.result.pageSize,
            pageNo: res.data.result.pageNo,
            pageCount: res.data.result.pageCount
          })
        }
    }); 
  },
  /**
   * 下拉加载
   */
  bindscrolltolower:function(){
    var that = this;
      if (that.data.flagLoad){
      that.setData({
        flagLoad:false
      });
      setTimeout(that.getDataLoad,1500);
    }
  },
  getDataLoad:function(){
    this.requestData("1");
    this.setData({
      flagLoad: true
    })
  },
  /**点击查看详情 */
  showDetails:function(e){
      wx.request({
        url: 'https://173ca97752.51mypc.cn:443/teacher/getTeacherInfo', 
        method: 'post',
        data: {
          "id": '1'
        },
        success: function (res) {
          console.log(res)
          var v = res.data.result;
          if(res.data.code != '200'){
            wx.showToast({
              title: 'error',
              icon: 'loading',
              duration: 1000
            })
            return;
          }
          this.setData({            
            name: v.name,
            sex:v.sex,
            teachTime: v.teachTime,
            language: v.language,
            explain: v.explain,
            registTime: v.registTime,
            details: false,
            teacherDetailsImg: "../../image/teacher.jpg",
          })
        }
      })
  },
  closeTeachDeatils:function(){
    this.setData({
      details: true,
      teacherDetailsImg: "",
      teacherDetailsText: ""
    })
  },
  /**课程选择 */
  showClass:function(e){
    var that =this;
    that.setData({
      classFlag:false
    })
  },
  closeClass:function(){
    var that = this;
    that.setData({
      classFlag: true
    })
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