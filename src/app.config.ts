export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/orders/index',
    'pages/install/index',
    'pages/mine/index',
    'pages/tombstone-detail/index',
    'pages/typesetting/index',
    'pages/font-select/index',
    'pages/order-detail/index',
    'pages/order-create/index',
    'pages/schedule/index',
    'pages/install-detail/index',
    'pages/porcelain-photo/index',
    'pages/repair/index',
    'pages/cemetery/index',
    'pages/settlement/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2c3e50',
    navigationBarTitleText: '碑刻作坊',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f7f6f2'
  },
  tabBar: {
    color: '#95a5a6',
    selectedColor: '#2c3e50',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '碑型'
      },
      {
        pagePath: 'pages/orders/index',
        text: '订单'
      },
      {
        pagePath: 'pages/install/index',
        text: '安装'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
