import { Picker, View, Text } from '@tarojs/components'
import { CSSProperties } from 'react'
import { toDateString } from '../../utils/date-utils'
import './DatePicker.scss'

export interface DatePickerProps {
  value: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  onChange: (value: string) => void
  className?: string
  style?: CSSProperties
}

export default function DatePicker({
  value,
  label,
  placeholder = '请选择日期',
  required = false,
  disabled = false,
  onChange,
  className = '',
  style
}: DatePickerProps) {
  const classes = [
    'jz-date-picker',
    disabled && 'jz-date-picker--disabled',
    className
  ]
    .filter(Boolean)
    .join(' ')

  const displayValue = value ? toDateString(value) : placeholder

  return (
    <View className={classes} style={style}>
      {label && (
        <View className="jz-date-picker__label">
          <Text>{label}</Text>
          {required && <Text className="jz-date-picker__required">*</Text>}
        </View>
      )}
      <Picker
        mode="date"
        value={value ? toDateString(value) : ''}
        disabled={disabled}
        onChange={(e) => onChange(e.detail.value)}
      >
        <View className="jz-date-picker__field">
          <Text className={value ? '' : 'jz-date-picker__placeholder'}>
            {displayValue}
          </Text>
        </View>
      </Picker>
    </View>
  )
}
