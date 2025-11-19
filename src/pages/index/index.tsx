import { useEffect, useState, useMemo } from 'react'
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

  const today = dayjs()
  const todayKey = today.format('YYYY-MM-DD')
  const currentMonthKey = today.format('YYYY-MM')
  const lastMonthKey = today.subtract(1, 'month').format('YYYY-MM')

  const monthStats = useMemo(() => {
    const currentMonthTransactions = transactions.filter((t: ITransaction) =>
      dayjs(t.date).format('YYYY-MM') === currentMonthKey
    )
    const lastMonthTransactions = transactions.filter((t: ITransaction) =>
      dayjs(t.date).format('YYYY-MM') === lastMonthKey
    )

    const sumByType = (list: ITransaction[], type: TransactionType) =>
      list
        .filter((t) => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0)

    const monthExpense = sumByType(currentMonthTransactions, TransactionType.EXPENSE)
    const monthIncome = sumByType(currentMonthTransactions, TransactionType.INCOME)
    const lastMonthExpense = sumByType(lastMonthTransactions, TransactionType.EXPENSE)
    const lastMonthIncome = sumByType(lastMonthTransactions, TransactionType.INCOME)

    return {
      monthExpense,
      monthIncome,
      lastMonthExpense,
      lastMonthIncome,
    }
  }, [transactions, currentMonthKey, lastMonthKey])

  const todayStats = useMemo(() => {
    const todayTransactions = transactions.filter((t: ITransaction) =>
      dayjs(t.date).format('YYYY-MM-DD') === todayKey
    )
    const todayExpense = todayTransactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0)
    const todayCount = todayTransactions.length

    return {
      todayExpense,
      todayCount,
      average: todayCount ? todayExpense / todayCount : 0,
    }
  }, [transactions, todayKey])

  const getMonthTrendText = (current: number, previous: number) => {
    if (!previous) return '暂无对比'
    const diff = current - previous
    const direction = diff >= 0 ? '多' : '少'
    return `较上月${direction}${formatCurrency(Math.abs(diff))}`
  }

  if (loading) {
    return <CLoading fullPage text="加载中..." />
  }

  return (
    <View className="index-page">
      {/* Overview Section */}
      <View className="overview-section">
        <View className="balance-card">
          <View>
            <Text className="balance-label">当前结余</Text>
            <Text className="balance-value">{formatCurrency(balance)}</Text>
          </View>
          <View className="balance-tags">
            <Text className="balance-tag expense">总支出 {formatCurrency(totalExpense)}</Text>
            <Text className="balance-tag income">总收入 {formatCurrency(totalIncome)}</Text>
          </View>
          <Text className="balance-date">{today.format('MM月DD日 dddd')}</Text>
        </View>

        <View className="metric-grid">
          <View className="metric-card expense">
            <Text className="metric-label">本月支出</Text>
            <Text className="metric-value">{formatCurrency(monthStats.monthExpense)}</Text>
            <Text className="metric-trend">{getMonthTrendText(monthStats.monthExpense, monthStats.lastMonthExpense)}</Text>
          </View>
          <View className="metric-card income">
            <Text className="metric-label">本月收入</Text>
            <Text className="metric-value">{formatCurrency(monthStats.monthIncome)}</Text>
            <Text className="metric-trend">{getMonthTrendText(monthStats.monthIncome, monthStats.lastMonthIncome)}</Text>
          </View>
          <View className="metric-card neutral">
            <Text className="metric-label">今日支出</Text>
            <Text className="metric-value">{formatCurrency(todayStats.todayExpense)}</Text>
            <Text className="metric-trend">
              {todayStats.todayCount
                ? `${todayStats.todayCount} 笔 · 平均 ${formatCurrency(todayStats.average)}`
                : '今天还没有记账'}
            </Text>
          </View>
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

      <View className="action-bar">
        <View className="action-info">
          <Text className="action-title">随时记录每一笔</Text>
          <Text className="action-subtitle">
            今日 {todayStats.todayCount} 笔 · {formatCurrency(todayStats.todayExpense)}
          </Text>
        </View>
        <View className="action-button" onClick={handleAddClick}>
          <Text className="action-text">+ 记一笔</Text>
        </View>
      </View>
    </View>
  )
}

export default Index
