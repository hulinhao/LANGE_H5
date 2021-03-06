// pages/teach/index.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    proPlate : null,
    isShow:null,
    params : [],
    disabledSub:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  },
  /**
   * 请求数据
   */
  requestData: function (e) {
    console.log("加载数据：project")
    var that = this;
      wx.request({
        url: app.globalData.url +'/plate/getProPlate',
        method: 'post',
        success: function (res) {
          if(res.data.code == 200 ){
            var proPlate = res.data.data;
            // 储存盘口显示的标志
            var show = new Map();
            proPlate.forEach(element => {
              show[element.project.id] = 'none';
            });
            that.setData({   
              proPlate : proPlate,           
              isShow:show
            })
          }
        }
    }); 
  },
  /**
   * 显示/隐藏盘口
   */
  showPlate:function(e){
    var that = this;
    var id = e.currentTarget.id;
    var show = that.data.isShow;
    var flag = show[id+''];
    var proPlate = that.data.proPlate;
    proPlate.forEach(element => {
      if(element.project.id == id){
        if(element.frtPlateVos.length<1){
          wx.showToast({
            title: '当前赛事暂无比赛',
            icon: 'none',
            duration: 1500
          })
          return;
        }
      }
    });

    if(flag == 'none'){
      show[id+''] = 'display';
    }else if(flag == 'display'){
      show[id+''] = 'none';
    }
    that.setData({
      isShow:show
    })
  },
    //下注金额失去焦点
  plate_amountBlur: function(e){
      var amount = e.detail.value;
      var id  = e.currentTarget.id;
      //将value 设置到data  绑定到图片的orderAmount 属性
      var param = {
        id : id,
        amount : amount
      };
      var arrParam = this.data.params;
      if(arrParam){
        for (let i = 0; i < arrParam.length; i++) {
          const element = arrParam[i];
          if(element.id == id){
            arrParam.splice(i,1);
          }
        }
        arrParam.push(param);
      }else{
        arrParam = new Array();
        arrParam.push(param);
      }
      this.setData({
        params : arrParam
      });
    },
  submitOrder:function(e){
      var that = this;
      //防止重复提交
      that.setData({
        disabledSub:true
      });
      var plateId = e.currentTarget.id;
      var amount = 0;
      if(this.data.params){
        this.data.params.forEach(element =>{
          if(element.id == plateId){
            amount = element.amount;
          }
        })
      }
      var reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
      if(!reg.test(amount)&&amount!=''){
          wx.showToast({
            title: '请输入正确的数字',
            icon: 'none',
            duration: 1500
          })
          return;
      }
      if(new Number(amount)<=0 || amount == ''||amount == 'undefined'){
        wx.showToast({
          title: '请输入正确金额',
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
      // if( gold == null || gold == 'undefined'){
      //   wx.showToast({
      //     title: '未获取到金币',
      //     icon: 'none',
      //     duration: 1500
      //   })
      //   return;
      // }
      // if(gold - new Number(amount)<0){
      //   wx.showToast({
      //     title: '金币不足',
      //     icon: 'none',
      //     duration: 1500
      //   })
      //   return;
      // }
      wx.request({
        url: app.globalData.url + '/order/addOrder',
        data: {
          'plateId':plateId,
          'amount':amount,
          'userId':userInfo.userId
        },
        method: 'post',
        success: function (res) {
          var info = res.data;
          if (info.code == 200) {
            // 下单成功减去金币
            app.globalData.userInfo.gold = gold - amount;
            that.setData({
              gold:gold - amount
            })
            wx.showToast({
              title: '投注成功',
              icon: 'none',
              duration: 1500
            })
          } else {
            console.log('接口访问失败！！！');
          }
          that.setData({
            disabledSub:false
          });
        },fail:function(res){
          that.setData({
            disabledSub:false
          });
        }
      });

    },
  //修改赔率 弹框
  editOdds:function(e){
    var that = this;
    var id = e.currentTarget.id;
    var odds = e.currentTarget.dataset.odds;
    var editgameid = e.currentTarget.dataset.editgameid;
    var edit = {
      id:id,
      odds:odds,
    };
    that.setData({
      disabledEdit:true,
      editShow:true,
      editParam:edit,
      editgameid:editgameid, 
    })
  },
  canEditOdds:function(){
    var that = this;
    var editParam = {
      id:null,
      odds:null,
    };
    that.setData({
      disabledEdit:false,
      editShow:false,
      editParam:editParam,
      editgameid:null,
    })
  },
  setOdds:function(e){
    var that = this;
    var odds = e.detail.value;
    var editParam = that.data.editParam;
    var reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(!reg.test(odds)||odds==''){
        wx.showToast({
          title: '赔率格式错误',
          icon: 'none',
          duration: 1500
        })
        that.setData({
          editParam:{
            id:editParam.id,
            odds:null
          },
        });
        return;
    }
  editParam.odds = odds;
  that.setData({
    editParam : editParam
  });
  },
  submitEdit:function(){
    var that = this;
    var editParam = that.data.editParam;
    var editgameid = that.data.editgameid;
    var reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if(editParam ==null ||!reg.test(editParam.odds)||editParam.odds==''){
      wx.showToast({
        title: '赔率格式错误',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    wx.request({
      url: app.globalData.url +"/plate/editPlate",
      data:editParam,
      method:"POST",
      success:function(res){
        var data = res.data;
        if(data.code == 200){
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1500
          })
          //重新加载父框的数据
          wx.request({
            url: app.globalData.url +'/plate/getProPlate',
            method: 'post',
            success: function (res) {
                if(res.data.code == 200 ){
                  var proPlate = res.data.data;
                  // 储存盘口显示的标志
                  var show = new Map();
                  proPlate.forEach(element => {
                    if(element.project.id == editgameid){
                      show[element.project.id] = 'display';
                    }else{
                      show[element.project.id] = 'none';
                    }
                    
                  });
                  that.setData({   
                    proPlate : proPlate,           
                    isShow:show
                  })
                }
              }
            }); 
            that.canEditOdds();
        }else{
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 1500
          })
        }
      }
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
    //设置head数据
    if(app.globalData.userInfo != '' && app.globalData.userInfo != null){
      this.setData({
        url: app.globalData.userInfo.avatarUrl,
        gold: app.globalData.userInfo.gold,
        ismanager:app.globalData.userInfo.type == 2?true:false,
      })
    }else{
      this.setData({
        url: '/image/user.png',
        gold: '$'
      })
    }
    this.requestData();
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