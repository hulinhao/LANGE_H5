//index.js
//获取应用实例
const app = getApp()

//js
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: null,
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

    wx.getUserInfo({
      success: function (res) {
        if (that.userInfo == null) {
          that.setData({
            userInfo: res.userInfo,
          })
        }
        return;
      },
      fail: function () {
        console.log('获取用户信息失败')
      }
    })
  },
  /**个人信息详情 */
  clickUserInfo:function(e){
      wx.navigateTo({
        url: '../userInfo/index'
      })
  },
  /**个人课程 */
  clickCourse: function (e) {
    wx.navigateTo({
      url: '../course/index'
    })
  },
  /**公司平台信息 */
  clickCompany: function (e) {
    wx.navigateTo({
      url: '../company/index'
    })
  },
})

