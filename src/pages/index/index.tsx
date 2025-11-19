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
    const direction = diff >= 0 ? '多' : '少'
    return `较上月${direction}${formatCurrency(Math.abs(diff))}`
  }

  if (loading) {
    return <CLoading fullPage text="加载中..." />
  }

  return (
    <View className="min-h-screen bg-gradient-fade pb-[140px]">
      {/* Overview Section */}
      <View className="m-lg flex flex-col gap-lg">
        <View className="gradient-primary rounded-xxl p-xl shadow-lg text-white flex flex-col gap-md" style={{ boxShadow: '0 16px 32px rgba(0, 0, 0, 0.12), 0 20px 40px rgba(0, 122, 255, 0.25)' }}>
          <View>
            <Text className="text-base opacity-80 tracking-wide">当前结余</Text>
            <Text className="text-4xl font-light" style={{ letterSpacing: '-1px' }}>{formatCurrency(balance)}</Text>
          </View>
          <View className="flex gap-md flex-wrap">
            <Text className="px-md py-xs rounded-lg text-sm inline-flex gap-xs items-center" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>总支出 {formatCurrency(totalExpense)}</Text>
            <Text className="px-md py-xs rounded-lg text-sm inline-flex gap-xs items-center" style={{ background: 'rgba(255, 255, 255, 0.15)' }}>总收入 {formatCurrency(totalIncome)}</Text>
          </View>
          <Text className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{today.format('MM月DD日 dddd')}</Text>
        </View>

        <View className="grid gap-md" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <View className="bg-card-solid rounded-xl p-lg shadow-md flex flex-col gap-sm" style={{ border: '1px solid rgba(0, 0, 0, 0.04)', borderTop: '4px solid #FF3B30' }}>
            <Text className="text-sm text-text-secondary" style={{ letterSpacing: '0.5px' }}>本月支出</Text>
            <Text className="text-xl font-semibold text-text-primary">{formatCurrency(monthStats.monthExpense)}</Text>
            <Text className="text-sm text-text-secondary">{getMonthTrendText(monthStats.monthExpense, monthStats.lastMonthExpense)}</Text>
          </View>
          <View className="bg-card-solid rounded-xl p-lg shadow-md flex flex-col gap-sm" style={{ border: '1px solid rgba(0, 0, 0, 0.04)', borderTop: '4px solid #34C759' }}>
            <Text className="text-sm text-text-secondary" style={{ letterSpacing: '0.5px' }}>本月收入</Text>
            <Text className="text-xl font-semibold text-text-primary">{formatCurrency(monthStats.monthIncome)}</Text>
            <Text className="text-sm text-text-secondary">{getMonthTrendText(monthStats.monthIncome, monthStats.lastMonthIncome)}</Text>
          </View>
          <View className="bg-card-solid rounded-xl p-lg shadow-md flex flex-col gap-sm" style={{ border: '1px solid rgba(0, 0, 0, 0.04)', borderTop: '4px solid #8E8E93' }}>
            <Text className="text-sm text-text-secondary" style={{ letterSpacing: '0.5px' }}>今日支出</Text>
            <Text className="text-xl font-semibold text-text-primary">{formatCurrency(todayStats.todayExpense)}</Text>
            <Text className="text-sm text-text-secondary">
              {todayStats.todayCount
                ? `${todayStats.todayCount} 笔 · 平均 ${formatCurrency(todayStats.average)}`
                : '今天还没有记账'}
            </Text>
          </View>
        </View>
      </View>

      {/* Transaction List */}
      <ScrollView
        className="flex-1 pb-[200px]"
        scrollY
        refresherEnabled
        refresherTriggered={refreshing}
        onRefresherRefresh={handleRefresh}
      >
        {Object.keys(groupedTransactions).length === 0 ? (
          <View className="flex flex-col items-center justify-center p-[120px_16px] m-lg rounded-xl backdrop-blur-glass" style={{ background: 'rgba(255, 255, 255, 0.8)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(0, 0, 0, 0.04)' }}>
            <Text className="text-2xl text-text-secondary mb-md font-light">暂无记录</Text>
            <Text className="text-base text-text-tertiary">点击下方按钮开始记账</Text>
          </View>
        ) : (
          Object.entries(groupedTransactions).map(([date, items]) => (
            <View key={date} className="mb-lg">
              <View className="p-[12px_24px] flex items-baseline justify-between">
                <Text className="text-lg font-bold text-text-primary">{getDateDisplay(date)}</Text>
                <Text className="text-sm text-text-secondary font-medium">{formatDate(date, 'YYYY年MM月DD日')}</Text>
              </View>
              <View className="bg-card-solid mx-lg rounded-xl shadow-sm" style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}>
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

      <View className="fixed left-lg right-lg bottom-xl bg-card-solid rounded-xxl shadow-lg p-[16px_24px] flex items-center justify-between gap-md z-fixed" style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}>
        <View className="flex flex-col gap-[4px]">
          <Text className="text-lg font-semibold text-text-primary">随时记录每一笔</Text>
          <Text className="text-sm text-text-secondary">
            今日 {todayStats.todayCount} 笔 · {formatCurrency(todayStats.todayExpense)}
          </Text>
        </View>
        <View className="gradient-primary px-xl h-button-lg rounded-xl flex items-center justify-center text-white text-lg font-semibold shadow-colored transition-transform duration-fast active:scale-[0.97]" onClick={handleAddClick} style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          <Text className="text-white">+ 记一笔</Text>
        </View>
      </View>
    </View>
  )
}

export default Index
