//app.js
App({   
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log("进入小程序");
    //请求登录
    wx.getSetting({
      success: res => {
        this.userLogin(res);
      }
    })
  },
  globalData: {
    userInfo: null,
    url:'https://guide.sxkemao.com',
    //url:"192.168.14.69:888",
    session_id: "",
    isLoad:false,
  },
  // 用户登录
  userLogin: function(res){
    var self = this;
    if (res.authSetting['scope.userInfo']) {
      wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            console.log("登录->code:"+res.code);
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
                        var data = res.data;
                        //用户信息保存到全局变量
                        self.globalData.userInfo={
                          wxName:data.user.wxName,
                          wxOpenid:data.user.wxOpenid,
                          name:data.user.name,
                          glod:data.user.gold,
                          payGlod:data.user.payGold,
                          withdrawGlod:data.user.withdrawGold,
                        };
                        console.log("用户信息："+JSON.stringify(self.globalData.userInfo));
                      } else {
                        console.log('解密失败')
                      }            
                    },
                    fail: function () {
                      console.log('系统错误')
                    }
                  })
                },
                fail: function () {
                  console.log('获取用户信息失败')
                }
              })
            } else {
              console.log('获取用户登录态失败！' + r.errMsg)
            }
          },
          fail: function () {
            console.log('登陆失败')
          }
        })
    } else {
        console.log('获取用户信息失败')
    }
  },

  //获取hand参数
  getHead:function(obj){
    wx.getUserInfo({
      success: function (res) {
          obj.setData({
            url: res.userInfo.avatarUrl,
            gold: 100
          })
      },
      fail: function () {
        console.log('获取用户信息失败')
      }
    })
  },
})
