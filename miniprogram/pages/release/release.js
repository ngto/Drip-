// miniprogram/pages/release/release.js
import {
  formatTime
} from '../../utils/utils.js';

//初始化数据库
const db = wx.cloud.database();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TabCur: "0",
    ButtonStatus: '',
    ListCurItem: app.globalData.ExpenditureList[0],
    date: '',
    defaultDate: "",
    Monetary: "",
    CalculationText: "完成",
    MonetaryArray: [],
    Remarks: "",
    NumKeyboard: [{
        id: '7',
        text: '7'
      }, {
        id: '8',
        text: '8'
      },
      {
        id: '9',
        text: '9'
      }, {
        id: '10',
        text: '+'
      },
      {
        id: '4',
        text: '4'
      },
      {
        id: '5',
        text: '5'
      },
      {
        id: '6',
        text: '6'
      },
      {
        id: '20',
        text: '-'
      },
      {
        id: '1',
        text: '1'
      },
      {
        id: '2',
        text: '2'
      },
      {
        id: '3',
        text: '3'
      },
      {
        id: '',
        text: ''
      },
      {
        id: '.',
        text: '.'
      },
      {
        id: '0',
        text: '0'
      },
      {
        id: '100',
        text: '清除'
      }
    ],
    ExpenditureList: app.globalData.ExpenditureList
  },
  /**
   * tab切换
   */
  tabSelect(e) {
    let id = e.currentTarget.dataset.id;
    if (id == 0) {
      this.setData({
        ListCurItem: app.globalData.ExpenditureList[0]
      });
    } else {
      this.setData({
        ListCurItem: app.globalData.ExpenditureList[33]
      });
      console.log(app.globalData.ExpenditureList[33])
    }
    this.setData({
      TabCur: id
    })
  },
  //选择日期
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 消费情况切换
   */
  listChange(e) {
    this.setData({
      ListCurItem: e.currentTarget.dataset.item
    });
  },
  /**
   * 点击数字按钮
   */
  numMoney(e) {
    let that = this,
      monetaryFrist = "",
      monetaryLast = "",
      number = e.currentTarget.dataset.num,
      monetary = that.data.Monetary;

    if (number == "10" || number == "20") {
      number = number == "10" ? "+" : "-";
      that.setData({
        CalculationText: "="
      });
      monetaryLast = monetary.substr(monetary.length - 1, 1);
      if (monetaryLast == "-" || monetaryLast == "+") {
        return;
      }
    }

    //点击清除按钮
    if (number == "100") {
      that.cleanUpNum();
      return;
    } else {
      monetary = monetary + number;
    }

    that.setData({
      Monetary: monetary
    });

  },
  //清除按钮点击执行
  cleanUpNum() {
    let that = this,
      monetary = that.data.Monetary + "";

    monetary = monetary.substring(0, monetary.length - 1);
    this.setData({
      Monetary: monetary
    });
  },
  //计算结果
  addition() {
    let that = this,
      totalNum = that.data.Monetary,
      totalNumLast = totalNum.substr(totalNum.length - 1, 1),
      totalNumFrist = totalNum.substr(0, 1),
      numArra = [],
      operatorArray = [];
    //判断最后一位是不是符号
    if (totalNumLast == "+" || totalNumLast == "-") {
      totalNum = totalNum.substring(0, totalNum.length - 1);
    }
    //判断第一位是不是符号
    if (totalNumFrist == "+" || totalNumFrist == "-") {
      totalNum = totalNum.substring(1, totalNum.length);
    }

    for (let codePoint of totalNum) {
      if (codePoint == "+" || codePoint == "-") {
        operatorArray.push(codePoint)
      }
    }
    numArra = totalNum.replace(/\+|\-/g, "#").split("#");
    totalNum = numArra[0];
    for (let i = 0; i < operatorArray.length; i++) {
      totalNum = operatorArray[i] == "+" ? parseFloat(totalNum) + parseFloat(numArra[i + 1]) : parseFloat(totalNum) - parseFloat(numArra[i + 1])
    }

    that.setData({
      Monetary: totalNum
    });

    that.setData({
      CalculationText: "完成"
    });
  },
  /**
   * 点击完成按钮
   */
  totalMoneyEnd(e) {
    let that = this;
    if (that.data.CalculationText == "=") {
      that.addition();
    } else {
      that.addBillToDb();
    }
  },
  //备注信息
  bindKeyInput(e) {
    this.setData({
      Remarks: e.detail.value
    })
  },
  //插入数据到数据库
  addBillToDb() {
    let that = this,
      data = {};
    if (that.data.Monetary == "") {
      wx.showToast({
        title: '请填写金额！',
        icon: "none",
        duration: 2000
      });
      return;
    }
    wx.showNavigationBarLoading();
    data = {
      amount_type: that.data.TabCur, //金额类型 支出/收入
      consumption_type: that.data.ListCurItem.id, // 消费类型 
      money: that.data.Monetary,
      create_date: that.data.date,
      remarks: that.data.Remarks
    };
    that.setData({
      ButtonStatus: true
    })
    db.collection("bill_list").add({
        data: data
      })
      .then(res => {
        wx.hideNavigationBarLoading();
        that.setData({
          ButtonStatus: false
        });
        wx.showToast({
          title: '记账成功！',
          success: true,
          duration: 1500,
          mask: true
        });
        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/bill/bill'
          })
        }, 1500);
      })
      .catch(err => {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '记账失败！',
          success: true,
          duration: 2000
        });
        that.setData({
          ButtonStatus: false
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      date: formatTime(),
      defaultDate: formatTime()
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
  onShow: function() {},

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