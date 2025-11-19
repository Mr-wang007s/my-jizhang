import { View, Text } from '@tarojs/components'
import { FC, memo } from 'react'

interface Props {
  fullPage?: boolean
  hide?: boolean
  text?: string
}

const CLoading: FC<Props> = ({ fullPage = false, hide = false, text = 'LOADING...' }) => {
  if (hide) return null;

  const containerClass = fullPage
    ? 'fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <View className={containerClass}>
      <View className="flex flex-col items-center gap-4">
        {/* iOS Spinner */}
        <View className="w-12 h-12 border-4 border-gray-200 border-t-ios-blue rounded-full animate-spin"></View>
        {text && (
          <Text className="text-base font-medium text-gray-600">{text}</Text>
        )}
      </View>
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
