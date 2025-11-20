import { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'

import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
    
    // Initialize WeChat Cloud (only for WeChat mini-program)
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        // Replace with your environment ID
        env: 'YOUR_ENV_ID',
        traceUser: true,
      })
    }
  })

  // children 是将要会渲染的页面
  return children
}
  


export default App
