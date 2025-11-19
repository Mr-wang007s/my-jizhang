import { View, Text } from '@tarojs/components';

interface CategoryIconProps {
  icon: string;
  size?: 'small' | 'medium' | 'large';
  active?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  small: 'w-12 h-12 text-2xl rounded-xl',
  medium: 'w-16 h-16 text-3xl rounded-2xl',
  large: 'w-20 h-20 text-4xl rounded-2xl',
};

const CategoryIcon = ({
  icon,
  size = 'medium',
  active = false,
  onClick
}: CategoryIconProps) => {
  const sizeClass = sizeClasses[size];
  const activeClasses = active
    ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg scale-105'
    : 'bg-gradient-to-br from-gray-50 to-gray-100';

  return (
    <View
      className={`${sizeClass} ${activeClasses} flex items-center justify-center transition-all active:scale-95`}
      onClick={onClick}
    >
      <Text className={active ? 'animate-bounce-subtle' : ''}>{icon}</Text>
    </View>
  );
};

export default CategoryIcon;
