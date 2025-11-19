import { View, Text, Input } from '@tarojs/components';
import { ReactNode } from 'react';
import './index.scss';

interface FormItemProps {
  label: string;
  value?: string | number;
  placeholder?: string;
  icon?: ReactNode;
  onClick?: () => void;
  showArrow?: boolean;
  type?: 'text' | 'input';
  onInput?: (value: string) => void;
  align?: 'left' | 'right';
}

const FormItem = ({
  label,
  value,
  placeholder,
  icon,
  onClick,
  showArrow = true,
  type = 'text',
  onInput,
  align = 'right'
}: FormItemProps) => {
  return (
    <View className="form-item" onClick={type === 'text' ? onClick : undefined}>
      <View className="form-item-label">
        {icon && <View className="form-item-icon">{icon}</View>}
        <Text className="form-item-label-text">{label}</Text>
      </View>
      <View className="form-item-value">
        {type === 'input' ? (
          <Input
            className={`form-item-input align-${align}`}
            value={value?.toString() || ''}
            placeholder={placeholder}
            onInput={(e) => onInput?.(e.detail.value)}
          />
        ) : (
          <Text className={`form-item-value-text ${!value ? 'placeholder' : ''}`}>
            {value || placeholder}
          </Text>
        )}
        {showArrow && type === 'text' && (
          <Text className="form-item-arrow">›</Text>
        )}
      </View>
    </View>
  );
};

export default FormItem;
