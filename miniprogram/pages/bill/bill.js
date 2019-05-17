// pages/bill/bill.js
import {
  formatMonth
} from '../../utils/utils.js';

const db = wx.cloud.database();
const _ = db.command;

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultDate: '',
    date: '',
    billList: [],
    loadMoreFlag: false, //加载动画
    incomeMoney: 0, //收入金额
    expenditureMoney: 0, //支出金额
    balanceMoney: 0, //余额
    expenditureList: app.globalData.ExpenditureList,
  },
  //选择日期
  DateChange(e) {
    let _that = this;
    _that.setData({
      date: e.detail.value
    });
    _that.getBillListByMonth();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _that = this;
    _that.setData({
      date: formatMonth(),
      defaultDate: formatMonth(),
    });

    _that.getBillListByMonth();
  },
  //按月份获取信息列表
  getBillListByMonth() {
    let _that = this;
    this.setData({
      loadMoreFlag: true
    })
    db.collection("bill_list")
      .where({
        create_date: db.RegExp({
          regexp: _that.data.date,
          options: 'm',
        })
      })
      .orderBy('create_date', 'desc')
      .get()
      .then(res => {
        _that.formatBillList(res.data);
        this.setData({
          loadMoreFlag: false
        })
      })
      .catch(err => {
        this.setData({
          loadMoreFlag: false
        })
        _that.setData({
          //支出金额
          expenditureMoney: 0,
          //收入金额
          incomeMoney: 0,
          billList: []
        })
      })
  },
  //格式化数据
  formatBillList(params) {
    let _that = this,
      expenditure = 0,
      income = 0,
      createDateArray = [],
      billArray = [];
    params.forEach(item => {
      if (item.amount_type == 0) {
        expenditure = parseFloat(expenditure) + parseFloat(item.money || 0);
      } else {
        income = parseFloat(expenditure) + parseFloat(item.money || 0);
      }
      createDateArray.push(item.create_date);
    });

    createDateArray = Array.from(new Set(createDateArray));
    createDateArray.forEach(item => {
      let billitem = {};
      let bills = [];
      billitem.create_date = item;

      params.forEach(item1 => {
        if (item == item1.create_date) {
          bills.unshift(item1);
        }
        billitem.data = bills;
      })

      billArray.push(billitem)
    });

    _that.setData({
      //支出金额
      expenditureMoney: expenditure,
      //收入金额
      incomeMoney: income,
      billList: billArray
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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