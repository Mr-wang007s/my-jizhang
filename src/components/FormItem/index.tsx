import { View, Text, Input } from '@tarojs/components';
import { ReactNode } from 'react';

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
    <View
      className="glass-card rounded-2xl p-4 mb-3 flex items-center justify-between active:scale-98 transition-all"
      onClick={type === 'text' ? onClick : undefined}
    >
      <View className="flex items-center gap-3">
        {icon && (
          <View className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            {icon}
          </View>
        )}
        <Text className="text-base font-medium text-gray-700">{label}</Text>
      </View>
      <View className="flex items-center gap-2">
        {type === 'input' ? (
          <Input
            className={`text-base border-none outline-none bg-transparent text-${align} text-gray-900 font-semibold`}
            value={value?.toString() || ''}
            placeholder={placeholder}
            onInput={(e) => onInput?.(e.detail.value)}
          />
        ) : (
          <Text className={`text-base font-semibold ${!value ? 'text-gray-400' : 'text-gray-900'}`}>
            {value || placeholder}
          </Text>
        )}
        {showArrow && type === 'text' && (
          <Text className="text-xl text-gray-300">›</Text>
        )}
      </View>
    </View>
  );
};

export default FormItem;
