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
    return <CLoading fullPage text="LOADING..." />
  }

  return (
    <View className="min-h-screen bg-brutal-white pb-32 font-sans relative">
      {/* Grid Background */}
      <View className="absolute inset-0 bg-grid pointer-events-none opacity-30" />

      {/* Scanlines */}
      <View className="absolute inset-0 scanlines pointer-events-none" />

      {/* Header - Neo-Brutal */}
      <View className="px-6 pt-8 pb-4 slide-in-up">
        <Text className="text-4xl font-mono-brutal mb-2">{'[ MY_WALLET ]'}</Text>
        <Text className="text-sm font-mono text-brutal-gray">{'>'} {'>'} {today.format('YYYY.MM.DD // dddd')}</Text>
      </View>

      {/* Balance Card - Bold Brutal */}
      <View className="mx-6 mb-6 slide-in-up stagger-1">
        <View className="bg-neon-yellow border-brutal p-8 relative overflow-hidden">
          <View className="absolute top-2 right-2 text-xs font-mono text-brutal-black opacity-30">
            <Text>█ BALANCE</Text>
          </View>
          <Text className="text-sm font-mono-brutal mb-2">CURRENT_BALANCE:</Text>
          <Text className="text-6xl font-mono-brutal leading-none mb-4 glitch">{formatCurrency(balance)}</Text>
          <View className="flex gap-4">
            <View className="flex-1">
              <Text className="text-xs font-mono text-brutal-black opacity-60">↓ OUT</Text>
              <Text className="text-lg font-mono-brutal text-expense">{formatCurrency(totalExpense)}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs font-mono text-brutal-black opacity-60">↑ IN</Text>
              <Text className="text-lg font-mono-brutal text-income">{formatCurrency(totalIncome)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Grid - Asymmetric */}
      <View className="px-6 mb-8 flex gap-4 slide-in-up stagger-2">
        <View className="flex-1 bg-brutal-white border-brutal-sm p-5 skew-brutal-reverse transform active-brutal active-brutal-shadow">
          <Text className="text-xs font-mono mb-2 opacity-60">MONTH_OUT</Text>
          <Text className="text-2xl font-mono-brutal text-expense mb-1">{formatCurrency(monthStats.monthExpense)}</Text>
          <Text className="text-xs font-mono">{getMonthTrendText(monthStats.monthExpense, monthStats.lastMonthExpense)}</Text>
        </View>

        <View className="flex-1 bg-brutal-black border-4 border-brutal-black shadow-brutal-green p-5 skew-brutal transform active-brutal active-brutal-shadow">
          <Text className="text-xs font-mono mb-2 text-neon-green">MONTH_IN</Text>
          <Text className="text-2xl font-mono-brutal text-neon-green mb-1">{formatCurrency(monthStats.monthIncome)}</Text>
          <Text className="text-xs font-mono text-brutal-white opacity-70">{getMonthTrendText(monthStats.monthIncome, monthStats.lastMonthIncome)}</Text>
        </View>
      </View>

      <View className="px-6 mb-8 slide-in-up stagger-3">
        <View className="bg-brutal-white border-brutal-sm p-5 active-brutal active-brutal-shadow">
          <Text className="text-xs font-mono mb-2 opacity-60">TODAY_STATS</Text>
          <Text className="text-3xl font-mono-brutal mb-2">{formatCurrency(todayStats.todayExpense)}</Text>
          <Text className="text-sm font-mono">
            {todayStats.todayCount > 0 ? `${todayStats.todayCount} RECORDS // AVG: ${formatCurrency(todayStats.average)}` : 'NO RECORDS TODAY'}
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
          <View className="flex flex-col items-center justify-center p-16 mx-6 border-brutal-lg bg-brutal-white slide-in-up stagger-4">
            <Text className="text-5xl mb-4">📝</Text>
            <Text className="text-2xl font-mono-brutal mb-2">NO_RECORDS</Text>
            <Text className="text-sm font-mono text-brutal-gray text-center">
              Click the button below to add your first transaction
            </Text>
          </View>
        ) : (
          <View className="px-6">
            {Object.entries(groupedTransactions).map(([date, items], index) => (
              <View key={date} className={`mb-6 slide-in-up stagger-${Math.min(index + 4, 5)}`}>
                <View className="flex items-center gap-2 mb-2">
                  <Text className="font-mono-brutal text-lg">{'>'} {'>'} {getDateDisplay(date)}</Text>
                  <View className="flex-1 h-0.5 bg-brutal-black opacity-20" />
                </View>
                <View className="bg-brutal-white border-brutal overflow-hidden">
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

      {/* FAB - Brutal Style */}
      <View className="fixed left-6 right-6 bottom-8 z-10">
        <View
          className="bg-neon-yellow border-brutal p-6 flex items-center justify-between active-brutal active-brutal-shadow"
          onClick={handleAddClick}
        >
          <View className="flex flex-col">
            <Text className="font-mono-brutal text-xl">ADD_RECORD</Text>
            <Text className="font-mono text-xs text-brutal-black opacity-60">
              Today: {todayStats.todayCount} {' records'}
            </Text>
          </View>
          <Text className="text-4xl font-mono-brutal">+</Text>
        </View>
      </View>
    </View>
  )
}

export default Index
