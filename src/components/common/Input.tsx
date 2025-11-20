import { Input as TaroInput, View, Text } from '@tarojs/components'
import { CSSProperties } from 'react'
import './Input.scss'

export interface InputProps {
  value: string | number
  placeholder?: string
  type?: 'text' | 'number' | 'digit' | 'idcard' | 'tel'
  disabled?: boolean
  maxlength?: number
  label?: string
  error?: string
  required?: boolean
  onChange: (value: string) => void
  onBlur?: () => void
  onFocus?: () => void
  className?: string
  style?: CSSProperties
}

export default function Input({
  value,
  placeholder,
  type = 'text',
  disabled = false,
  maxlength,
  label,
  error,
  required = false,
  onChange,
  onBlur,
  onFocus,
  className = '',
  style
}: InputProps) {
  const classes = [
    'jz-input',
    disabled && 'jz-input--disabled',
    error && 'jz-input--error',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <View className={classes} style={style}>
      {label && (
        <View className="jz-input__label">
          <Text>{label}</Text>
          {required && <Text className="jz-input__required">*</Text>}
        </View>
      )}
      <TaroInput
        className="jz-input__field"
        value={String(value)}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        maxlength={maxlength}
        onInput={(e) => onChange(e.detail.value)}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {error && <Text className="jz-input__error-text">{error}</Text>}
    </View>
  )
}
