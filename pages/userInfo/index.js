//index.js
//获取应用实例
const app = getApp()

//js
Page({
  data: {
    id : '',
    wexinOpenid: '',
    name: '',
    phone: '',
    adress: '',
    sex: '',
    personalProfile: '',
    role: '',
    signature: '',
    photo: '',
    level: ''
  },
  requestData: function (userId) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/user/getUserInfo',
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      data: {
        userId: userId
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == '200' && res.data.result != null) {
          that.setData({
            id: res.data.result.id,
            wexinOpenid: res.data.result.wexinOpenid,
            name: res.data.result.name,
            phone: res.data.result.phone,
            adress: res.data.result.adress,
            sex: res.data.result.sex,
            personalProfile: res.data.result.personalProfile,
            role: res.data.result.role,
            signature: res.data.result.signature,
            photo: res.data.result.photo,
            level: res.data.result.level
          })
        }
      }
    });
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
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        that.userLogin(res);
      }
    });
    that.requestData("1")
  },
  bindGetUserInfo: function (event) {
    var that =this;
    //使用
    wx.getSetting({
      success: res => {
        that.userLogin(res);
      }
    })

  },
  userLogin: function(res){
    var that =this;

    if (res.authSetting['scope.userInfo']) {
      // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
      wx.login({
        success: function (res) {
          var code = res.code;//登录凭证

          if (code) {
            //2、调用获取用户信息接口
            wx.getUserInfo({
              success: function (res) {
                if (that.userInfo == null) {
                  that.setData({
                    userInfo: res.userInfo,
                  })
                }
                return;
                console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
                //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                wx.request({
                  url: 'https://xxxx.com/wxsp/decodeUserInfo',//自己的服务接口地址
                  method: 'post',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                  success: function (data) {

                    //4.解密成功后 获取自己服务器返回的结果
                    if (data.data.status == 1) {
                      var userInfo_ = data.data.userInfo;
                      console.log(userInfo_)
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
  }
})

