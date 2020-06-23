//app.js
App({   
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log("进入小程序");
  },
  globalData: {
    userInfo: null,
    url:'http://localhost:80',
    //url:"192.168.14.69:888",
    session_id: "",
  },
  userLogin:function(){
    var self = this;
    let promise = new Promise((resolve, reject) => {
     // 登录
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
          //获取用户信息
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              Params.encryptedData =  res.encryptedData;
              Params.iv = res.iv;
              //生成加密key
              //Params.key = self.MD5(Params.code + "&" + self.getNowTime() + "&" + Params.key);
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
                    self.globalData.userInfo={
                      wxName:data.user.wxName,
                      wxOpenid:data.user.wxOpenid,
                      name:data.user.name,
                      glod:data.user.gold,
                      payGlod:data.user.payGold,
                      withdrawGlod:data.user.withdrawGold,
                    };
                    console.log("用户信息："+JSON.stringify(self.globalData.userInfo));
                  }            
                }
              })
            }
          })
        }
      })
    })
    return promise;
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     console.log("获取用户信息：");
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           console.log({encryptedData: res.encryptedData, iv: res.iv, code: res.code});
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             console.log("再次获取用户信息：");
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  }
})
