import { useEffect, useState } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import { loadTransactions, deleteTransaction } from '../../actions/transaction'
import { loadCategories } from '../../actions/category'
import { ITransaction } from '../../constants/commonType'
import { TransactionType } from '../../constants/transaction'
import TransactionItem from '../../components/TransactionItem'
import CLoading from '../../components/CLoading'
import { formatCurrency, calculateTotal, calculateBalance } from '../../utils/calculation'
import { getDateDisplay, formatDate } from '../../utils/date'
import dayjs from 'dayjs'
import './index.scss'

interface GroupedTransactions {
  [date: string]: ITransaction[]
}

function Index() {
  const dispatch = useDispatch()
  const transactions = useSelector((state: any) => state.transaction.list)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        dispatch(loadTransactions() as any),
        dispatch(loadCategories() as any),
      ])
    } catch (error) {
      console.error('Failed to load data:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'none',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const handleAddClick = () => {
    Taro.navigateTo({
      url: '/pages/add/index',
    })
  }

  const handleItemClick = (transaction: ITransaction) => {
    Taro.navigateTo({
      url: `/pages/add/index?id=${transaction.id}`,
    })
  }

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      success: (res) => {
        if (res.confirm) {
          dispatch(deleteTransaction(id) as any)
            .then(() => {
              Taro.showToast({
                title: '删除成功',
                icon: 'success',
              })
            })
            .catch(() => {
              Taro.showToast({
                title: '删除失败',
                icon: 'none',
              })
            })
        }
      },
    })
  }

  // Group transactions by date
  const groupedTransactions: GroupedTransactions = transactions
    .sort((a: ITransaction, b: ITransaction) =>
      dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
    )
    .reduce((groups: GroupedTransactions, transaction: ITransaction) => {
      const date = formatDate(transaction.date)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
      return groups
    }, {})

  // Calculate totals
  const totalIncome = calculateTotal(transactions, TransactionType.INCOME)
  const totalExpense = calculateTotal(transactions, TransactionType.EXPENSE)
  const balance = calculateBalance(transactions)

  if (loading) {
    return <CLoading fullPage text="加载中..." />
  }

  return (
    <View className="index-page">
      {/* Summary Card */}
      <View className="summary-card">
        <View className="summary-item">
          <Text className="summary-label">总支出</Text>
          <Text className="summary-value expense">{formatCurrency(totalExpense)}</Text>
        </View>
        <View className="summary-divider"></View>
        <View className="summary-item">
          <Text className="summary-label">总收入</Text>
          <Text className="summary-value income">{formatCurrency(totalIncome)}</Text>
        </View>
        <View className="summary-divider"></View>
        <View className="summary-item">
          <Text className="summary-label">结余</Text>
          <Text className="summary-value balance">{formatCurrency(balance)}</Text>
        </View>
      </View>

      {/* Transaction List */}
      <ScrollView
        className="transaction-list"
        scrollY
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {Object.keys(groupedTransactions).length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">暂无记录</Text>
            <Text className="empty-hint">点击下方按钮开始记账</Text>
          </View>
        ) : (
          Object.entries(groupedTransactions).map(([date, items]) => (
            <View key={date} className="transaction-group">
              <View className="transaction-date">
                <Text className="date-text">{getDateDisplay(date)}</Text>
                <Text className="date-full">{formatDate(date, 'YYYY年MM月DD日')}</Text>
              </View>
              <View className="transaction-items">
                {items.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onClick={handleItemClick}
                    onDelete={handleDelete}
                  />
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <View className="add-button" onClick={handleAddClick}>
        <Text className="add-icon">+</Text>
      </View>
    </View>
  )
}

export default Index
