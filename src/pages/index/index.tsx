import { View, Text, Button } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { useState } from 'react';
import { CategoryService } from '../../services/category.service';
import { TransactionService } from '../../services/transaction.service';
import { useStore } from '../../store';
import { formatCurrency } from '../../utils/currency';
import './index.scss';

export default function Index() {
  const { setCategories, transactions, setTransactions, balance, setBalance } = useStore();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  useLoad(() => {
    initializeApp();
  });

  const initializeApp = async () => {
    try {
      setLoading(true);

      // Check if categories exist
      let categories = await CategoryService.list();

      // Initialize default categories if none exist
      if (categories.length === 0) {
        categories = await CategoryService.initializeDefaults();
        Taro.showToast({ title: '初始化成功', icon: 'success', duration: 1000 });
      }

      setCategories(categories);

      // Load transactions
      const result = await TransactionService.list({ limit: 100 });
      setTransactions(result.data);

      // Calculate balance
      const totalBalance = result.data.reduce((sum, t) => {
        return sum + (t.type === 'income' ? t.amount : -t.amount);
      }, 0);
      setBalance(totalBalance);

      setInitialized(true);
    } catch (error) {
      console.error('Failed to initialize:', error);
      Taro.showToast({ title: '初始化失败', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = () => {
    Taro.navigateTo({ url: '/pages/add-transaction/index' });
  };

  const handleViewTransactions = () => {
    Taro.switchTab({ url: '/pages/transactions/index' });
  };

  if (loading) {
    return (
      <View className="index loading">
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <View className="index">
      <View className="balance-section">
        <Text className="balance-label">当前余额</Text>
        <Text className={`balance-value ${balance < 0 ? 'negative' : ''}`}>
          {formatCurrency(balance)}
        </Text>
        <Text className="balance-subtitle">
          {transactions.length} 条记录
        </Text>
      </View>

      <View className="quick-actions">
        <Button className="action-button primary" onClick={handleAddTransaction}>
          记一笔
        </Button>
        <Button className="action-button secondary" onClick={handleViewTransactions}>
          查看账单
        </Button>
      </View>

      {transactions.length === 0 && (
        <View className="welcome-section">
          <Text className="welcome-title">欢迎使用记账本</Text>
          <Text className="welcome-text">开始记录您的收支，让财务管理更轻松</Text>
        </View>
      )}
    </View>
  );
}
