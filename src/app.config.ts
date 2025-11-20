export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/transaction/create',
    'pages/transaction/detail',
    'pages/transaction/edit',
    'pages/bills/index',
    'pages/analytics/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '我的记账',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#0ea5e9',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/bills/index',
        text: '账单',
        iconPath: 'assets/icons/bills.png',
        selectedIconPath: 'assets/icons/bills-active.png'
      },
      {
        pagePath: 'pages/analytics/index',
        text: '统计',
        iconPath: 'assets/icons/analytics.png',
        selectedIconPath: 'assets/icons/analytics-active.png'
      }
    ]
  }
})
