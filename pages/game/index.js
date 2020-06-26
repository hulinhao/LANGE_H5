// pages/main/index.jsteacher/getAllTeacherteacher/getAllTeacher
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    betParam:[],
    showModal:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("监听页面加载");
    var that = this; 
    wx.getStorage({ 
      key: 'dataDate', 
      success: function (res) { 
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("初次渲染完成");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("监听页面显示");
    //设置head数据

    if(app.globalData.userInfo != '' && app.globalData.userInfo != null){
      this.setData({
        url: app.globalData.userInfo.avatarUrl,
        gold: app.globalData.userInfo.gold
      })
    }else{

      this.setData({
        url: '/image/user.png',
        gold: '$'
      })
    }
    this.loadData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("监听页面隐藏");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("监听页面卸载");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("监听用户下拉动作");
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("页面上拉触底事件的处理函数");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("用户点击右上角分享");
  },
  //加载数据
  loadData:function(){
    var that = this;
    console.log("加载数据:game");
    wx.request({
      url: app.globalData.url + '/game/getGameList',
      data: {
      },
      method: 'post',
      success: function (res) {
        var info = res.data;
        if (info.code === '200') {
          that.setData({
            list: info.data
          })
        } else {
          console.log('接口访问失败！！！');
        }
      }
    });
  },
// 查看盘口 弹出模态框
  showPlate : function(e){
    var that = this;
    var gameId = e.currentTarget.id;
    wx.request({
      url: app.globalData.url + '/plate/getGamePlate',
      data: {
        gameId : gameId
      },
      method: 'post',
      success: function (res) {
        var info = res.data;
        if (info.code === '200') {
          if(info.data.frtPlateVos.length > 0){
            that.setData({
              game:info.data.gameVo,
              gameFrtPlateVo: info.data.frtPlateVos,
              betParam:[], // 打开盘口之前将下注参数清空
              showModal:true
            })
          }else{
            wx.showToast({
              title: '暂未开始竞猜',
              icon: 'none',
              duration: 1500
            })
          }
        } else {
          console.log('接口访问失败！！！');
        }
      }
    });
  },
//关闭模态框
closeDialog:function(){
    this.setData({
      showModal:false
    })
  },
  //提交下注
  submitOrder: function(){
    var that = this;
    var params = that.data.betParam;
    if(params.length<1){
      wx.showToast({
        title: '请输入下注金额',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var userInfo = app.globalData.userInfo;
    if(userInfo == '' || userInfo == null || userInfo == 'undefined'){
      wx.showToast({
        title: '请先授权登录',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var gold = app.globalData.userInfo.gold;
    if( gold == null || gold == 'undefined'){
      wx.showToast({
        title: '未获取到金币',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var countAmount = 0;
    params.forEach(element => {
      countAmount = countAmount + new Number(element.amount);
    });
    if(gold < countAmount){
      wx.showToast({
        title: '金币不足',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    wx.request({
      url: app.globalData.url + '/order/addOrderList',
      data: {
        userId:userInfo.userId,
        betParam : that.data.betParam,
        countAmount:countAmount
      },
      method: 'post',
      success: function (res) {
        var info = res.data;
        if (info.code == 200) {
          // 下单成功减去金币
          app.globalData.userInfo.gold = gold - countAmount;
          that.setData({
            gold:gold - countAmount,
            showModal:false
          })
        } else {
          console.log('接口访问失败！！！');
        }
      }
    });
  },
  //下注金额失去焦点
  amountBlu: function(e){
    var amount = e.detail.value;
    var plateId = e.currentTarget.id;
    var reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(!reg.test(amount)&&amount!=''){
        wx.showToast({
          title: '请输入正确的数字',
          icon: 'none',
          duration: 1500
        })
        return;
    }
    var param = {
      'plateId':plateId,
      'amount':amount
    }
    // 判断下注参数里面有没有当前盘口下注信息
    for (let i = 0; i < this.data.betParam.length; i++) {
      const element = this.data.betParam[i];
      if(element.plateId === plateId){
        if(amount >0){
          this.data.betParam[i] = param;
        }else{
          this.data.betParam.splice(i,1);
        }
        console.log(this.data.betParam);
        return;
      }
    }
    if(amount>0){
      this.data.betParam.push(param);
      //console.log(this.data.betParam);
    }
  }
})