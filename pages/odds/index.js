const app = getApp()
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
      url: app.globalData.url + 'order/paidOrders',
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
              element.disabled = false;
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
    var userId = e.currentTarget.id;
    var orderList = taht.data.orderList;
    wx.request({
      url: app.globalData.url + 'order/takePaidOrders',
      method:"POST",
      data:{
        userId:userId
      },
      success:function(res){
        var data = res.data;
        if(data.code == 200){
            wx.showToast({
              title: '已赔付',
              icon: 'none',
              duration: 1200
            })          
          if(orderList != null){
            orderList.forEach(element=>{
              if(element.userId == userId){
                element.disabled = true;
                element.color = "#ccc";
              }
            });
            taht.setData({
              orderList: orderList
            })
          }
        }else{
          wx.showToast({
            title: '赔付失败',
            icon: 'none',
            duration: 1200
          })
        }
      }
    })
  },
})

