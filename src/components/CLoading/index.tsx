import { View } from '@tarojs/components'
import { FC, memo } from 'react'
import classnames from 'classnames'
import './index.scss'

interface Props {
  fullPage?: boolean
  hide?: boolean
  text?: string
}

const CLoading: FC<Props> = ({ fullPage = false, hide = false, text = '加载中...' }) => {
  const cls = classnames({
    'loading-component': true,
    'loading-fullscreen': fullPage,
    'loading-hide': hide,
  })

  return (
    <View className={cls}>
      <View className="loading-spinner"></View>
      {text && <View className="loading-text">{text}</View>}
    </View>
  )
}

export default memo(CLoading, (prevProps, nextProps) => {
  return (
    prevProps.fullPage === nextProps.fullPage &&
    prevProps.hide === nextProps.hide &&
    prevProps.text === nextProps.text
  )
})
