export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/transactions/index',
    'pages/add-transaction/index',
    'pages/trends/index',
    'pages/settings/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '我的记账',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: '#999',
    selectedColor: '#3B82F6',
    backgroundColor: '#fff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png',
      },
      {
        pagePath: 'pages/transactions/index',
        text: '账单',
        iconPath: 'assets/icons/list.png',
        selectedIconPath: 'assets/icons/list-active.png',
      },
      {
        pagePath: 'pages/trends/index',
        text: '趋势',
        iconPath: 'assets/icons/chart.png',
        selectedIconPath: 'assets/icons/chart-active.png',
      },
      {
        pagePath: 'pages/settings/index',
        text: '设置',
        iconPath: 'assets/icons/settings.png',
        selectedIconPath: 'assets/icons/settings-active.png',
      },
    ],
  },
});
