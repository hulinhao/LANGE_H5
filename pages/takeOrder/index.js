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
    this.requestData();
  },
  requestData:function(){
    var that = this;
    wx.request({
      url: app.globalData.url + 'order/getTakeOrders',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        if(res.data.code == 200){
          var orders = res.data.data;
          if(orders != null){
            orders.forEach(element => {
              element.color = "#1AAD19";
            });
          }
          that.setData({
             orderList : orders,
          })
        }
      },
      fail:function(res){
        console.log(res);
      }
    })
  },
  editOrder:function(e){
    var taht = this;
    var id = e.currentTarget.id;
    var orderList = taht.data.orderList;
    wx.request({
      url: app.globalData.url + 'order/takeOrder',
      method:"POST",
      data:{
        id:id
      },
      success:function(res){
        var data = res.data;
        if(data.code == 200){
          if(data.data){
            wx.showToast({
              title: '已接单',
              icon: 'none',
              duration: 1200
            })
          }else{
            wx.showToast({
              title: '已取消',
              icon: 'none',
              duration: 1200
            })
          }
          if(orderList != null){
            orderList.forEach(element=>{
              if(element.userId == id){
                if(element.color == "#1AAD19"){
                   element.color = "#ccc";
                 }else if(element.color == "#ccc"){
                   element.color = "#1AAD19";
                 }
              }
            });
            taht.setData({
              orderList: orderList
            })
          }
        }else{
          wx.showToast({
            title: '失败！',
            icon: 'none',
            duration: 1200
          })
        }
      }
    })
  },
})

