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
    const direction = diff >= 0 ? '↑' : '↓'
    return `${direction} ${formatCurrency(Math.abs(diff))}`
  }

  if (loading) {
    return <CLoading fullPage text="加载中..." />
  }

  return (
    <View className="min-h-screen pb-32 relative">
      {/* Header - iOS Glass */}
      <View className="px-6 pt-8 pb-4 animate-fade-slide-up">
        <Text className="text-3xl font-bold text-gray-900 mb-1">我的账本</Text>
        <Text className="text-sm text-gray-500">{today.format('YYYY年MM月DD日 dddd')}</Text>
      </View>

      {/* Balance Card - iOS Glass Gradient */}
      <View className="mx-6 mb-6 animate-fade-slide-up delay-100">
        <View className="gradient-card p-8 rounded-3xl relative overflow-hidden">
          <Text className="text-sm text-white/80 mb-2">当前余额</Text>
          <Text className="text-5xl font-bold text-white leading-none mb-6">{formatCurrency(balance)}</Text>
          <View className="flex gap-4">
            <View className="flex-1 glass-card rounded-2xl p-4">
              <Text className="text-xs text-gray-500 mb-1">支出</Text>
              <Text className="text-lg font-bold text-expense">{formatCurrency(totalExpense)}</Text>
            </View>
            <View className="flex-1 glass-card rounded-2xl p-4">
              <Text className="text-xs text-gray-500 mb-1">收入</Text>
              <Text className="text-lg font-bold text-income">{formatCurrency(totalIncome)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Grid - Floating Cards */}
      <View className="px-6 mb-8 grid grid-cols-2 gap-4 animate-fade-slide-up delay-200">
        <View className="floating-card p-5 rounded-2xl">
          <Text className="text-xs text-gray-500 mb-2">本月支出</Text>
          <Text className="text-2xl font-bold text-expense mb-1">{formatCurrency(monthStats.monthExpense)}</Text>
          <Text className="text-xs text-gray-400">{getMonthTrendText(monthStats.monthExpense, monthStats.lastMonthExpense)}</Text>
        </View>

        <View className="floating-card p-5 rounded-2xl">
          <Text className="text-xs text-gray-500 mb-2">本月收入</Text>
          <Text className="text-2xl font-bold text-income mb-1">{formatCurrency(monthStats.monthIncome)}</Text>
          <Text className="text-xs text-gray-400">{getMonthTrendText(monthStats.monthIncome, monthStats.lastMonthIncome)}</Text>
        </View>
      </View>

      <View className="px-6 mb-8 animate-fade-slide-up delay-300">
        <View className="glass-card p-5 rounded-2xl">
          <Text className="text-xs text-gray-500 mb-2">今日统计</Text>
          <Text className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(todayStats.todayExpense)}</Text>
          <Text className="text-sm text-gray-600">
            {todayStats.todayCount > 0 ? `${todayStats.todayCount} 笔记录 · 平均 ${formatCurrency(todayStats.average)}` : '暂无记录'}
          </Text>
        </View>
      </View>

      {/* Transaction List */}
      <ScrollView
        className="flex-1"
        scrollY
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {Object.keys(groupedTransactions).length === 0 ? (
          <View className="flex flex-col items-center justify-center p-16 mx-6 glass-card rounded-3xl animate-fade-slide-up delay-400">
            <Text className="text-5xl mb-4">📝</Text>
            <Text className="text-xl font-bold text-gray-900 mb-2">暂无记录</Text>
            <Text className="text-sm text-gray-500 text-center">
              点击下方按钮添加第一笔记录
            </Text>
          </View>
        ) : (
          <View className="px-6">
            {Object.entries(groupedTransactions).map(([date, items], index) => (
              <View key={date} className={`mb-6 animate-fade-slide-up delay-${Math.min((index + 4) * 100, 500)}`}>
                <View className="flex items-center gap-2 mb-3">
                  <Text className="text-base font-semibold text-gray-900">{getDateDisplay(date)}</Text>
                  <View className="flex-1 h-px divider-gradient" />
                </View>
                <View>
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
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB - iOS Glass Floating Button */}
      <View className="fixed left-6 right-6 bottom-8 z-10">
        <View
          className="gradient-card-blue p-6 rounded-2xl flex items-center justify-between active:scale-98 transition-transform shadow-floating"
          onClick={handleAddClick}
        >
          <View className="flex flex-col">
            <Text className="text-xl font-bold text-white">添加记录</Text>
            <Text className="text-sm text-white/80">
              今日 {todayStats.todayCount} 笔
            </Text>
          </View>
          <View className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Text className="text-3xl text-white font-light">+</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Index
