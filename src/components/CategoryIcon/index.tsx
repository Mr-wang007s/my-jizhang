import { View, Text } from '@tarojs/components';
import './index.scss';

interface CategoryIconProps {
  icon: string;
  size?: 'small' | 'medium' | 'large';
  active?: boolean;
  onClick?: () => void;
}

const CategoryIcon = ({
  icon,
  size = 'medium',
  active = false,
  onClick
}: CategoryIconProps) => {
  return (
    <View
      className={`category-icon category-icon-${size} ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      <Text className="category-icon-emoji">{icon}</Text>
    </View>
  );
};

export default CategoryIcon;
