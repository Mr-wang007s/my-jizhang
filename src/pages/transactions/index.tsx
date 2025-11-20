import { View, Button } from '@tarojs/components';
import Taro, { useLoad, usePullDownRefresh } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import TransactionList from '../../components/TransactionList';
import { TransactionService } from '../../services/transaction.service';
import { CategoryService } from '../../services/category.service';
import { useStore } from '../../store';
import type { Transaction, Category } from '../../types';
import './index.scss';

export default function Transactions() {
  const { transactions, setTransactions, deleteTransaction } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useLoad(() => {
    loadData();
  });

  usePullDownRefresh(() => {
    loadData().then(() => {
      Taro.stopPullDownRefresh();
    });
  });

  const loadData = async () => {
    try {
      setLoading(true);

      // Load categories
      const cats = await CategoryService.list();
      setCategories(cats);

      // Load transactions
      const result = await TransactionService.list({ limit: 100 });
      setTransactions(result.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      Taro.showToast({ title: '加载失败', icon: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    Taro.navigateTo({ url: '/pages/add-transaction/index' });
  };

  const handleEdit = (transaction: Transaction) => {
    Taro.showActionSheet({
      itemList: ['编辑', '删除'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // Edit
          Taro.navigateTo({ url: `/pages/add-transaction/index?id=${transaction._id}` });
        } else if (res.tapIndex === 1) {
          // Delete
          handleDelete(transaction._id);
        }
      },
    });
  };

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await TransactionService.delete(id);
            deleteTransaction(id);
            Taro.showToast({ title: '删除成功', icon: 'success' });
          } catch (error) {
            Taro.showToast({ title: '删除失败', icon: 'error' });
          }
        }
      },
    });
  };

  return (
    <View className="transactions-page">
      <TransactionList
        transactions={transactions}
        categories={categories}
        onEdit={handleEdit}
        emptyText="还没有记账记录，点击下方按钮开始记账吧"
      />

      <View className="fab-container">
        <Button className="fab-button" onClick={handleAdd}>
          +
        </Button>
      </View>
    </View>
  );
}
