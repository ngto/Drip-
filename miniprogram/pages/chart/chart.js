// pages/chart/chart.js
import * as echarts from '../../ec-canvas/echarts';

import {
  getMonthLength,
  getFormatDay,
  formatTime,
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
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    defaultDate: '',
    date: '',
    expenditureList: app.globalData.ExpenditureList,
    isLoaded: false,
    isDisposed: false,
    billList: [],
    cTypeRankList: [],
    tabCur: "0",
    monthTotal: 0,
    monthAverage: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      date: formatMonth(),
      defaultDate: formatMonth()
    });
    this.getBillListByMonth();
  },
  /**
   * tab切换
   */
  tabSelect(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      tabCur: id
    });
    this.getBillListByMonth();
  },
  //选择日期
  DateChange(e) {
    this.setData({
      date: e.detail.value,
      tabCur: "0",
    });
    this.getBillListByMonth();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  //按月份获取信息列表
  getBillListByMonth() {
    let _that = this;
    this.setData({
      loadMoreFlag: true
    })
    db.collection("bill_list")
      .where({
        amount_type: _that.data.tabCur,
        create_date: db.RegExp({
          regexp: _that.data.date,
          options: 'm',
        })
      })
      .orderBy('create_date', 'desc')
      .get()
      .then(res => {
        _that.formatGetFlag(res.data);
        this.setData({
          loadMoreFlag: false
        })
      })
      .catch(err => {
        this.setData({
          loadMoreFlag: false
        })
        _that.setData({
          billList: []
        });
      })
  },
  formatGetFlag(params) {
    this.formatBillList(params);
    this.getPayRanks(params);
  },
  getPayRanks(params) {
    let consumptionTypeArr = [],
      consumptionTypelist = [];
    if (params.length == 0) {
      this.setData({
        monthTotal: 0,
        monthAverage: 0
      });
      return;
    }
    params.forEach(item => {
      consumptionTypeArr.push(item.consumption_type);
    });
    consumptionTypeArr = Array.from(new Set(consumptionTypeArr));
    consumptionTypeArr.forEach(item => {
      let consumptionType = {
          consumption_type: item
        },
        totalMoney = 0;
      params.forEach(item1 => {
        if (item == item1.consumption_type) {
          totalMoney = totalMoney + parseFloat(item1.money);
        }
      })
      consumptionType.totalMoney = totalMoney;
      consumptionTypelist.push(consumptionType);
    });
    consumptionTypelist = consumptionTypelist.sort((a, b) => {
      let x = a.totalMoney;
      let y = b.totalMoney;
      if (x < y) {
        return 1;
      } else if (x > y) {
        return -1;
      } else {
        return 0;
      }
    })
    this.setData({
      cTypeRankList: consumptionTypelist
    })
  },
  //格式化数据
  formatBillList(params) {
    let _that = this,
      create_date_first = "",
      expenditure = 0,
      income = 0,
      createDateArray = [],
      billArray = [],
      monthTotal = 0;
    if (params.length == 0) {
      _that.setData({
        billList: billArray
      });
      this.initChart();
      return;
    }

    create_date_first = params[0].create_date;
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
      let totalMoney = 0;
      billitem.create_date = item;

      params.forEach(item1 => {
        if (item == item1.create_date) {
          bills.unshift(item1);
          totalMoney = parseFloat(totalMoney) + parseFloat(item1.money);
        }
        billitem.data = bills;
      })

      billitem.money = totalMoney;
      monthTotal = monthTotal + totalMoney;
      billArray.unshift(billitem)
    });
    _that.setData({
      monthTotal: monthTotal,
      monthAverage: (monthTotal / getMonthLength(formatTime())).toFixed(2),
      billList: billArray
    });

    this.initChart();
  },
  //初始化图表
  initChart() {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });

      this.setOption(chart);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  setOption(chart) {
    let _that = this,
      dayList = [],
      moneyList = [];
    for (let i = 1; i <= getMonthLength(formatTime()); i++) {
      let j = i < 10 ? "0" + i : "" + i;
      let money = 0;
      _that.data.billList.forEach(item => {
        if (getFormatDay(item.create_date) == j) {
          money = item.money;
        }
      });
      dayList.push(j);
      moneyList.push(money);
      //console.log(moneyList);
    }
    let option = {
      dataZoom: [{
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 50,
        orient: "horizontal",
        zoomLock: true, //锁定区域禁止缩放
      }, { //Y轴固定,让内容滚动
        show: false,
      }],
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          textStyle: {
            color: '#666',
            fontSize: 16
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#999"
          }
        },
        axisTick: {
          show: true
        },
        z: 10,
        data: dayList
      },
      yAxis: {
        show: false,
        type: 'value'
      },
      series: [{
        data: moneyList,
        type: 'line',
        label: true,
        tooltip: {
          trigger: "axis",
          foramtter: function(params) {
            console.log(params)
          }
        },
        itemStyle: {
          normal: {
            borderWidth: 2,
            borderColor: '#39b54a',
            color: '#39b54a'
          }
        },
        lineStyle: {
          color: "#333",
          width: 1,
        }
      }]
    };

    chart.setOption(option);
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