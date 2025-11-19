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
      className="border-b-4 border-brutal-black p-4 flex items-center justify-between active-brutal bg-brutal-white"
      onClick={type === 'text' ? onClick : undefined}
    >
      <View className="flex items-center gap-2">
        {icon && <View className="flex items-center">{icon}</View>}
        <Text className="font-mono-brutal text-base">{label}</Text>
      </View>
      <View className="flex items-center gap-2">
        {type === 'input' ? (
          <Input
            className={`font-mono text-base border-none outline-none bg-transparent text-${align}`}
            value={value?.toString() || ''}
            placeholder={placeholder}
            onInput={(e) => onInput?.(e.detail.value)}
          />
        ) : (
          <Text className={`font-mono text-base ${!value ? 'text-brutal-gray' : 'text-brutal-black'}`}>
            {value || placeholder}
          </Text>
        )}
        {showArrow && type === 'text' && (
          <Text className="font-mono-brutal text-2xl">{'>'}›</Text>
        )}
      </View>
    </View>
  );
};

export default FormItem;
