// pages/main/index.jsteacher/getAllTeacherteacher/getAllTeacher
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tbodyHeight: 500, //tbody滚动高度
    content:"",
    title:"",
    imgList:[],
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
    wx.getStorage({ 
      key: 'dataDate', 
      success: function (res) { 
        console.log(res.data); 
        that.createTable(res.data); 
      } 
    });
    wx.getSystemInfo({
      success: function (res) {         //
      var height = (res.windowHeight-160)*2;        
      that.setData({
        tbodyHeight: height
      })
      }
    });
    wx.request({
      url: app.globalData.url + '/index/getCompanyInfo',
      data: {
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        var list = res.data;
        that.setData({
          content: res.data.result.companyProfile,
          title: res.data.result.companyName,
          imgList: res.data.result.bannerUrl
        })
      }
    });
    

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