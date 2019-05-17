//app.js
App({
  onLaunch: function() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    });
  },
  globalData: {
    ExpenditureList: [{
      id: '0',
      name: '餐饮',
      icon: 'icon-canyin'
    }, {
      id: '1',
      name: '购物',
      icon: 'icon-gouwudai'
    }, {
      id: '2',
      name: '日用',
      icon: 'icon-riyongbaihuo'
    }, {
      id: '3',
      name: '交通',
      icon: 'icon-traffic'
    }, {
      id: '4',
      name: '蔬菜',
      icon: 'icon-xinxianshucai'
    }, {
      id: '5',
      name: '水果',
      icon: 'icon-shuiguo'
    }, {
      id: '6',
      name: '零食',
      icon: 'icon-lingshi'
    }, {
      id: '7',
      name: '运动',
      icon: 'icon-cycleqiche'
    }, {
      id: '8',
      name: '娱乐',
      icon: 'icon-shiliangzhinengduixiang'
    }, {
      id: '9',
      name: '通讯',
      icon: 'icon-tongxunlu'
    }, {
      id: '10',
      name: '服饰',
      icon: 'icon-fushixiebao'
    }, {
      id: '11',
      name: '美容',
      icon: 'icon-shouye1'
    }, {
      id: '12',
      name: '住房',
      icon: 'icon-zhufang'
    }, {
      id: '13',
      name: '居家',
      icon: 'icon-jujiayongpin'
    }, {
      id: '14',
      name: '孩子',
      icon: 'icon-haizi'
    }, {
      id: '15',
      name: '长辈',
      icon: 'icon-changbei'
    }, {
      id: '16',
      name: '社交',
      icon: 'icon-shejiao'
    }, {
      id: '17',
      name: '服饰',
      icon: 'icon-fushixiebao'
    }, {
      id: '18',
      name: '旅行',
      icon: 'icon-lvxing'
    }, {
      id: '19',
      name: '烟酒',
      icon: 'icon-yanjiu'
    }, {
      id: '20',
      name: '数码',
      icon: 'icon-shujuxian'
    }, {
      id: '21',
      name: '汽车',
      icon: 'icon-qiche'
    }, {
      id: '22',
      name: '医疗',
      icon: 'icon-icon2'
    }, {
      id: '23',
      name: '书籍',
      icon: 'icon-book_icon'
    }, {
      id: '24',
      name: '学习',
      icon: 'icon-xuexi'
    }, {
      id: '25',
      name: '宠物',
      icon: 'icon-chongwu'
    }, {
      id: '26',
      name: '礼金',
      icon: 'icon-lijin'
    }, {
      id: '27',
      name: '礼物',
      icon: 'icon-liwu'
    }, {
      id: '28',
      name: '办公',
      icon: 'icon-bangong'
    }, {
      id: '29',
      name: '维修',
      icon: 'icon-weixiu'
    }, {
      id: '30',
      name: '捐赠',
      icon: 'icon-aixinjuanzeng'
    }, {
      id: '31',
      name: '彩票',
      icon: 'icon-caipiao'
    }, {
      id: '32',
      name: '快递',
      icon: 'icon-kuaidi'
    }, {
      id: '33',
      name: '工资',
      icon: 'icon-gongzi'
    }, {
      id: '34',
      name: '兼职',
      icon: 'icon-jianzhi'
    }, {
      id: '35',
      name: '理财',
      icon: 'icon-Finance'
    }, {
      id: '36',
      name: '礼金',
      icon: 'icon-lijin'
    }, {
      id: '37',
      name: '其他',
      icon: 'icon-qita'
    }]
  }
})