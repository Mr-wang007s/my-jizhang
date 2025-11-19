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
  labels = { expense: 'EXPENSE', income: 'INCOME' }
}: TypeToggleProps) => {
  return (
    <View className="border-brutal-sm bg-brutal-white p-1 inline-flex">
      <View
        className={`p-4 ${value === 'expense' ? 'bg-neon-yellow border-brutal-sm' : ''} active-brutal active-brutal-shadow`}
        onClick={() => onChange('expense')}
      >
        <Text className="font-mono-brutal">{labels.expense}</Text>
      </View>
      <View
        className={`p-4 ${value === 'income' ? 'bg-neon-green border-brutal-sm' : ''} active-brutal active-brutal-shadow`}
        onClick={() => onChange('income')}
      >
        <Text className="font-mono-brutal">{labels.income}</Text>
      </View>
    </View>
  );
};

export default TypeToggle;
