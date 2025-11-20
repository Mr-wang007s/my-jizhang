import { View } from '@tarojs/components'
import { ReactNode, CSSProperties } from 'react'
import './Button.scss'

export interface ButtonProps {
  children: ReactNode
  type?: 'primary' | 'secondary' | 'danger' | 'text'
  size?: 'small' | 'medium' | 'large'
  block?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  className?: string
  style?: CSSProperties
}

export default function Button({
  children,
  type = 'primary',
  size = 'medium',
  block = false,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  style
}: ButtonProps) {
  const classes = [
    'jz-button',
    `jz-button--${type}`,
    `jz-button--${size}`,
    block && 'jz-button--block',
    disabled && 'jz-button--disabled',
    loading && 'jz-button--loading',
    className
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick()
    }
  }

  return (
    <View className={classes} style={style} onClick={handleClick}>
      {loading && <View className="jz-button__loading">...</View>}
      <View className="jz-button__content">{children}</View>
    </View>
  )
}
