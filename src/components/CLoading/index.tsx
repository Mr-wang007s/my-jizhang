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
    ? 'fixed inset-0 bg-brutal-black/90 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <View className={containerClass}>
      <View className="flex flex-col items-center gap-4">
        {/* Brutal Loading Animation */}
        <View className="relative w-20 h-20 border-brutal-neon bg-neon-yellow">
          <View className="absolute inset-2 bg-brutal-black animate-blink"></View>
        </View>
        {text && (
          <Text className="font-mono-brutal text-lg text-brutal-white glitch">{text}</Text>
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
