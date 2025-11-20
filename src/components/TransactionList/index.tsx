import { View, Text, ScrollView } from '@tarojs/components';
import type { Transaction, Category } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import './index.scss';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
  emptyText?: string;
}

export default function TransactionList({
  transactions,
  categories,
  onEdit,
  onDelete,
  emptyText = '暂无记录',
}: TransactionListProps) {
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((c) => c._id === categoryId);
    return category?.name || '未知';
  };

  const getCategoryIcon = (categoryId: string): string => {
    const category = categories.find((c) => c._id === categoryId);
    return category?.icon || '📁';
  };

  if (transactions.length === 0) {
    return (
      <View className="transaction-list-empty">
        <Text className="empty-text">{emptyText}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="transaction-list" scrollY>
      {transactions.map((transaction) => (
        <View
          key={transaction._id}
          className="transaction-item"
          onClick={() => onEdit?.(transaction)}
        >
          <View className="transaction-left">
            <View className="transaction-icon">{getCategoryIcon(transaction.categoryId)}</View>
            <View className="transaction-info">
              <Text className="transaction-category">{getCategoryName(transaction.categoryId)}</Text>
              {transaction.note && <Text className="transaction-note">{transaction.note}</Text>}
            </View>
          </View>

          <View className="transaction-right">
            <Text className={`transaction-amount ${transaction.type}`}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </Text>
            <Text className="transaction-date">{formatDate(transaction.date)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
