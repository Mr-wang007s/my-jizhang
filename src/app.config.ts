export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/add/index',
    'pages/statistics/index',
    'pages/settings/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '记账本',
    navigationBarTextStyle: 'black'
  },
  // TODO: Add tab bar icons to enable tabBar
  // Uncomment after adding icon images to src/assets/images/
  // tabBar: {
  //   color: '#999999',
  //   selectedColor: '#007AFF',
  //   backgroundColor: '#ffffff',
  //   borderStyle: 'black',
  //   list: [
  //     {
  //       pagePath: 'pages/index/index',
  //       text: '记账',
  //       iconPath: 'assets/images/tab-home.png',
  //       selectedIconPath: 'assets/images/tab-home-active.png'
  //     },
  //     {
  //       pagePath: 'pages/statistics/index',
  //       text: '统计',
  //       iconPath: 'assets/images/tab-stats.png',
  //       selectedIconPath: 'assets/images/tab-stats-active.png'
  //     },
  //     {
  //       pagePath: 'pages/settings/index',
  //       text: '设置',
  //       iconPath: 'assets/images/tab-settings.png',
  //       selectedIconPath: 'assets/images/tab-settings-active.png'
  //     }
  //   ]
  // }
})
