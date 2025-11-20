import { View } from '@tarojs/components'
import { ReactNode, CSSProperties } from 'react'
import './MainLayout.scss'

export interface MainLayoutProps {
  children: ReactNode
  title?: string
  showHeader?: boolean
  className?: string
  style?: CSSProperties
}

export default function MainLayout({
  children,
  title,
  showHeader = false,
  className = '',
  style
}: MainLayoutProps) {
  const classes = ['jz-layout', className].filter(Boolean).join(' ')

  return (
    <View className={classes} style={style}>
      {showHeader && title && (
        <View className="jz-layout__header">
          <View className="jz-layout__title">{title}</View>
        </View>
      )}
      <View className="jz-layout__content">{children}</View>
    </View>
  )
}
