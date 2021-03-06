//index.js
//获取应用实例
const app = getApp()
var log = require('../../log.js');
//js
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null,
    userInfoPageHeight: 0,
    loading:false,
    myname:null
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
  //按钮的点击事件
  bindGetUserInfo: function (res) {
  var that = this;
    let info = res;
    if (info.detail.userInfo) {
      that.userLogin(res.userInfo);
    } else {
      log.info('拒绝授权')
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '拒绝了授权',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {
               log.info('用户点击了“返回授权”')
            }
          }
        })
  }
  },
  /**
   * 登录
   */
  userLogin:function(){
    var self = app;
    var that = this;
    //登录样式
    that.setData({
      loading : !that.data.loading
    })
    wx.getSetting({
      success(res){
        if (res.authSetting['scope.userInfo']) {
          wx.login({
              success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                var Params = {
                  code: res.code, //临时登录凭证
                  //明文,加密数据
                  encryptedData: '',
                  //加密算法的初始向量
                  iv:''
                };
                if(res.code){
                //获取用户信息
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      Params.encryptedData =  res.encryptedData;
                      Params.iv = res.iv;
                      wx.request({
                        url: self.globalData.url + '/winxin/decodeUserInfo', //请求后台接口获取openid
                        data:Params,
                        header: {
                          'content-type': 'application/json'
                        },
                        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                        success: function(res) {
                          if(res.data.status == 1){ //接口请求成功
                            var user = res.data.user;
                            log.info('登陆成功，微信名：'+user.wxName+';type：'+user.type);
                            console.log('登陆成功，微信名：'+user.wxName+';type：'+user.type);
                            //用户信息保存到全局变量
                            self.globalData.userInfo={
                              userId:user.id,
                              wxName:user.wxName,
                              wxOpenid:user.wxOpenid,
                              avatarUrl:user.avatarUrl,
                              name:user.name,
                              type:user.type,
                              gold:user.gold,
                              payGold:user.payGold,
                              withdrawGold:user.withdrawGold,
                            };
                            that.setData({
                              userInfo : {
                                userId:user.id,
                                wxName:user.wxName,
                                avatarUrl:user.avatarUrl,
                                name:user.name,
                                type:user.type,
                                gold:user.gold,
                                payGold:user.payGold,
                                withdrawGold:user.withdrawGold,
                              }
                            })
                          } else {
                            wx.showToast({
                              title: '登录失败',
                              icon: 'none',
                              duration: 1500
                            })
                            log.info('解密失败')
                          }            
                          that.setData({
                            loading : !that.data.loading
                          })
                        },
                        fail: function () {
                            wx.showToast({
                              title: '系统错误',
                              icon: 'none',
                              duration: 1500
                            })
                            log.info('系统错误！')
                            that.setData({
                              loading : !that.data.loading
                            })
                        }
                      })
                    },
                    fail: function () {
                      log.info('获取用户信息失败')
                      that.setData({
                        loading : !that.data.loading
                      })
                    }
                  })
                } else {
                  log.info('获取用户登录态失败！' + r.errMsg)
                  that.setData({
                    loading : !that.data.loading
                  })
                }
              },
              fail: function () {
                log.info('登陆失败')
                //console.log('登陆失败')
                that.setData({
                  loading : !that.data.loading
                })
              }
            })
        } else {          
          log.info('获取用户信息失败')
          //console.log('获取用户信息失败')
        }
      }
    })
    
  },
  /**我的订单 */
  myOrders:function(e){
      wx.navigateTo({
        url: '../myOrders/index'
      })
  },
  /**赔率管理 */
  odds: function (e) {
    wx.navigateTo({
      url: '../odds/index'
    })
  },
  /**接单 */
  takeOrder: function (e) {
    wx.navigateTo({
      url: '../takeOrder/index'
    })
  },
    /** 所有订单 */
    orders: function (e) {
      wx.navigateTo({
        url: '../orders/index'
      })
    },
    inputName:function(e){
      var name = e.detail.value;
      this.setData({
        myname:name
      });
    },
    setName:function(){
      var that = this;
      var name = that.data.myname;
      var userInfo = that.data.userInfo;
      if(name == null || name == '' || name =='undefined'){
        wx.showToast({
          title: '请输入姓名',
          icon: 'none',
          duration: 1200
        })
        return;
      }
      wx.request({
        url: app.globalData.url +"user/setName",
        method:'POST',
        data:{
          userId:userInfo.userId,
          name :name
        },
        success:function(res){
          if(res.data.code == 200){
            wx.showToast({
              title: '设置成功',
              icon: 'none',
              duration: 1200
            })
            userInfo.name = res.data.data.name;
            that.setData({
              userInfo:userInfo
            });
          }
        }
      })
    },
    payOrder:function(){
      console.log('支付开始');
      console.log('支付结束');
    },
})

