import { View, Text } from '@tarojs/components';

interface CategoryIconProps {
  icon: string;
  size?: 'small' | 'medium' | 'large';
  active?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  small: 'w-12 h-12 text-2xl',
  medium: 'w-16 h-16 text-3xl',
  large: 'w-20 h-20 text-4xl',
};

const CategoryIcon = ({
  icon,
  size = 'medium',
  active = false,
  onClick
}: CategoryIconProps) => {
  const sizeClass = sizeClasses[size];
  const activeClasses = active
    ? 'border-brutal-neon glow-yellow'
    : 'border-brutal-sm bg-brutal-white';

  return (
    <View
      className={`${sizeClass} ${activeClasses} flex items-center justify-center active-brutal active-brutal-shadow`}
      onClick={onClick}
    >
      <Text>{icon}</Text>
    </View>
  );
};

export default CategoryIcon;
