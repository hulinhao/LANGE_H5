// pages/teach/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proPlate : null,
    isShow:null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.userLogin().then(res => {
      console.log("promise回调后的数据：");
      console.log(app.globalData.userInfo);
      var that = this;
      wx.getSystemInfo({
        success: function (res) {         //
          that.setData({
            projectBodyHeight: res.windowHeight - (res.windowWidth / 750) * 94,
            projectContentWidth: res.windowWidth - 100,
            detailsWidth: res.windowWidth-56-80,
          })
        }
      });
      //加载head参数
      app.getHead(that); 
      that.requestData();
     })
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
            var proPlate = res.data.data;
            that.setData({
              proPlate : proPlate
            })
            // 储存盘口显示的标志
            var show = new Map();
            proPlate.forEach(element => {
              show[element.project.id] = 'none';
            });
            that.setData({
              
              isShow:show
            })
          }
        }
    }); 
  },
  showPlate:function(e){
    var that = this;
    var id = e.currentTarget.id;
    var show = that.data.isShow;
    var flag = show[id+''];
    
    if(flag == 'none'){
      show[id+''] = 'display';
    }else if(flag == 'display'){
      show[id+''] = 'none';
    }
    that.setData({
      isShow:show
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