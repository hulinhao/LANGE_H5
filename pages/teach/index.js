// pages/teach/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classFlag:true,//课程选择
    details:true,//详情展示
    flagLoad:true,
    teacherDetailsImg:"",
    list:[],
    detailsWidth:200,
    teachContentWidth:100,
    teachBodyHeight: 500, //tbody滚动高度

    imgList: [],
    indicatorDots: true,  //小点

    autoplay: true,  //是否自动轮播

    interval: 3000,  //间隔时间

    duration: 3000,  //滑动时间
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {         //
        var height = (res.windowHeight - 87.5) * 2;
        that.setData({
          teachBodyHeight: height,
          teachContentWidth: res.windowWidth - 100,
          detailsWidth: res.windowWidth-56,
        })
      }
    });
    that.requestData("1")
  },
  /**
   * 请求数据
   */
  requestData: function (e) {
    var that = this;
      wx.request({
        url: 'https://173ca97752.51mypc.cn:443/teacher/getAllTeacher',
        data: {
        },
        method: 'post',
        success: function (res) {
          console.log(res)
          var list = res.data;
          that.setData({
            list: that.data.list.concat(list)
          })
        }
    }); 
  },
  /**
   * 下拉加载
   */
  bindscrolltolower:function(){
    var that = this;
      if (that.data.flagLoad){
      that.setData({
        flagLoad:false
      });
      setTimeout(that.getDataLoad,1500);
    }
  },
  getDataLoad:function(){
    this.requestData("1");
    this.setData({
      flagLoad: true
    })
  },
  /**点击查看详情 */
  showDetails:function(e){
    var that = this,content="";
    for(var u of this.data.list){
      if(u.id==e.target.dataset.id){
        content=u.content;
        break;
      }
    }
    that.setData({
      details:false,
      teacherDetailsImg:"../../image/teacher.jpg",
      teacherDetailsText: content
    })
  },
  closeTeachDeatils:function(){
    this.setData({
      details: true,
      teacherDetailsImg: "",
      teacherDetailsText: ""
    })
  },
  /**课程选择 */
  showClass:function(e){
    var that =this;
    that.setData({
      classFlag:false
    })
  },
  closeClass:function(){
    var that = this;
    that.setData({
      classFlag: true
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