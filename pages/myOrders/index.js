//index.js
//获取应用实例
const app = getApp()

//js
Page({
  data: {
    orderList:null,
    userInfoPageHeight: 0,
  },
  onLoad: function () {
    var that =this;
    wx.getSystemInfo({
      success: function (res) {         //
        var height = res.windowHeight;
        that.setData({
          userInfoPageHeight: height
        })
      }
    });
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'order/getUserOrders',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data:{
        userId : app.globalData.userInfo.userId
      },
      success:function(res){
        if(res.data.code = 200){
          that.setData({
             orderList : res.data.data
          })
        }
      },
      fail:function(res){
        console.log(res);
      }
    })
  },
})

