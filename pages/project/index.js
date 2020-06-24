// pages/teach/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proPlate : null
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
          detailsWidth: res.windowWidth-56-80,
        })
      }
    });
    app.getHead(that); //head数据
    that.requestData();
  },
  /**
   * 请求数据
   */
  requestData: function (e) {
    var that = this;
      wx.request({
        url: app.globalData.url +'/plate/getProPlate',
        method: 'post',
        success: function (res) {
          if(res.data.code == 200 ){
            that.setData({
               proPlate : res.data.data
            })
            console.log(that.data.proPlate);
          }
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