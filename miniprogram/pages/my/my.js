// pages/my/my.js

const db = wx.cloud.database();
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalNum: 0,
    totalDay: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _that = this;
    wx.showNavigationBarLoading();
    _that.getTotalNum();
    _that.getTotalDay();
  },
  //获取计算天数
  getTotalNum() {
    let _that = this;
    db.collection("bill_list")
      .count()
      .then(res => {
        _that.setData({
          totalNum: res.total
        });
        wx.hideNavigationBarLoading();
      }).catch(res => {
        _that.setData({
          totalNum: 0
        });
        wx.hideNavigationBarLoading();
      });
  },
  //获取记账天数
  getTotalDay() {
    let _that = this;
    db.collection("bill_list")
      .get()
      .then(res => {
        _that.formatData(res.data);
        wx.hideNavigationBarLoading();
      }).catch(err => {
        _that.setData({
          totalDay: 0
        });
        wx.hideNavigationBarLoading();
      });
  },
  formatData(params) {
    let _that = this,
      dateArray = [];
    params.forEach(item => {
      dateArray.push(item.create_date);
    });
    dateArray = Array.from(new Set(dateArray));

    _that.setData({
      totalDay: dateArray.length
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})