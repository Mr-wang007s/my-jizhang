import { PropsWithChildren } from 'react';
import Taro, { useLaunch } from '@tarojs/taro';
import './app.scss';

function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    console.log('App launched.');

    // Initialize WeChat Cloud (only in WeChat mini-program environment)
    if (process.env.TARO_ENV === 'weapp') {
      try {
        Taro.cloud.init({
          // Replace with your WeChat Cloud environment ID
          env: 'your-cloud-env-id',
          traceUser: true,
        });
        console.log('WeChat Cloud initialized');
      } catch (error) {
        console.error('Failed to initialize WeChat Cloud:', error);
      }
    }
  });

  return children;
}

export default App;
