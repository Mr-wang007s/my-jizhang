import { View, Text } from '@tarojs/components';

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
    <View className="glass-card rounded-full p-1 flex gap-1 w-fit">
      <View
        className={`px-6 py-2 rounded-full transition-all ${
          value === 'expense'
            ? 'bg-white shadow-sm'
            : 'bg-transparent'
        }`}
        onClick={() => onChange('expense')}
      >
        <Text className={`font-semibold transition-colors ${
          value === 'expense' ? 'text-expense' : 'text-gray-500'
        }`}>
          {labels.expense}
        </Text>
      </View>
      <View
        className={`px-6 py-2 rounded-full transition-all ${
          value === 'income'
            ? 'bg-white shadow-sm'
            : 'bg-transparent'
        }`}
        onClick={() => onChange('income')}
      >
        <Text className={`font-semibold transition-colors ${
          value === 'income' ? 'text-income' : 'text-gray-500'
        }`}>
          {labels.income}
        </Text>
      </View>
    </View>
  );
};

export default TypeToggle;
