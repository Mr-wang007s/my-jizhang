import { View, Text } from '@tarojs/components';
import './index.scss';

interface TypeToggleProps {
  value: 'expense' | 'income';
  onChange: (value: 'expense' | 'income') => void;
  labels?: {
    expense: string;
    income: string;
  };
}

const TypeToggle = ({
  value,
  onChange,
  labels = { expense: '支出', income: '收入' }
}: TypeToggleProps) => {
  return (
    <View className="type-toggle">
      <View className="type-toggle-track">
        <View
          className={`type-toggle-indicator ${value === 'expense' ? 'left' : 'right'}`}
        />
        <View
          className={`type-toggle-option ${value === 'expense' ? 'active' : ''}`}
          onClick={() => onChange('expense')}
        >
          <Text className="type-toggle-text">{labels.expense}</Text>
        </View>
        <View
          className={`type-toggle-option ${value === 'income' ? 'active' : ''}`}
          onClick={() => onChange('income')}
        >
          <Text className="type-toggle-text">{labels.income}</Text>
        </View>
      </View>
    </View>
  );
};

export default TypeToggle;
