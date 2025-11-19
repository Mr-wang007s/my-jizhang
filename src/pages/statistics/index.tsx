import { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { ITransaction, ICategoryStats } from '../../constants/commonType'
import { TransactionType } from '../../constants/transaction'
import { formatCurrency } from '../../utils/calculation'
import TypeToggle from '../../components/TypeToggle'
import CategoryIcon from '../../components/CategoryIcon'
import dayjs from 'dayjs'
import './index.scss'

type PeriodType = 'week' | 'month' | 'year'

function Statistics() {
  const transactions = useSelector((state: any) => state.transaction.list)
  const categories = useSelector((state: any) => state.category.list)
  const [period, setPeriod] = useState<PeriodType>('month')
  const [selectedType, setSelectedType] = useState<TransactionType>(TransactionType.EXPENSE)

  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    const now = dayjs()
    let startDate: dayjs.Dayjs

    switch (period) {
      case 'week':
        startDate = now.startOf('week')
        break
      case 'month':
        startDate = now.startOf('month')
        break
      case 'year':
        startDate = now.startOf('year')
        break
      default:
        startDate = now.startOf('month')
    }

    return transactions.filter((t: ITransaction) =>
      dayjs(t.date).isAfter(startDate) && t.type === selectedType
    )
  }, [transactions, period, selectedType])

  // Calculate category statistics
  const categoryStats: ICategoryStats[] = useMemo(() => {
    const stats = new Map<string, ICategoryStats>()
    const total = filteredTransactions.reduce(
      (sum: number, t: ITransaction) => sum + t.amount,
      0
    )

    filteredTransactions.forEach((t: ITransaction) => {
      const existing = stats.get(t.categoryId)
      if (existing) {
        existing.amount += t.amount
        existing.count += 1
      } else {
        const category = categories.find((c: any) => c.id === t.categoryId)
        stats.set(t.categoryId, {
          categoryId: t.categoryId,
          categoryName: t.categoryName,
          categoryIcon: t.categoryIcon,
          categoryColor: category?.color || '#999999',
          amount: t.amount,
          count: 1,
          percentage: 0,
        })
      }
    })

    const result = Array.from(stats.values()).map(stat => ({
      ...stat,
      percentage: total > 0 ? (stat.amount / total) * 100 : 0,
    }))

    return result.sort((a, b) => b.amount - a.amount)
  }, [filteredTransactions, categories])

  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce((sum: number, t: ITransaction) => sum + t.amount, 0)
  }, [filteredTransactions])

  const getPeriodText = () => {
    switch (period) {
      case 'week':
        return '本周'
      case 'month':
        return '本月'
      case 'year':
        return '本年'
      default:
        return '本月'
    }
  }

  return (
    <View className="statistics-page">
      {/* Period Selector */}
      <View className="period-selector">
        <View
          className={`period-item ${period === 'week' ? 'active' : ''}`}
          onClick={() => setPeriod('week')}
        >
          <Text>周</Text>
        </View>
        <View
          className={`period-item ${period === 'month' ? 'active' : ''}`}
          onClick={() => setPeriod('month')}
        >
          <Text>月</Text>
        </View>
        <View
          className={`period-item ${period === 'year' ? 'active' : ''}`}
          onClick={() => setPeriod('year')}
        >
          <Text>年</Text>
        </View>
      </View>

      {/* Type Selector */}
      <TypeToggle
        value={selectedType as 'expense' | 'income'}
        onChange={(value) => setSelectedType(value as TransactionType)}
      />

      {/* Summary Card */}
      <View className="summary-card">
        <Text className="summary-label">{getPeriodText()}{selectedType === TransactionType.EXPENSE ? '支出' : '收入'}</Text>
        <Text className={`summary-amount ${selectedType}`}>
          {formatCurrency(totalAmount)}
        </Text>
        <Text className="summary-count">共 {filteredTransactions.length} 笔</Text>
      </View>

      {/* Category Statistics */}
      <ScrollView className="stats-list" scrollY>
        {categoryStats.length === 0 ? (
          <View className="empty-state">
            <Text className="empty-text">暂无数据</Text>
          </View>
        ) : (
          categoryStats.map((stat) => (
            <View key={stat.categoryId} className="stat-item">
              <View className="stat-left">
                <CategoryIcon icon={stat.categoryIcon} size="medium" />
                <View className="stat-info">
                  <Text className="stat-name">{stat.categoryName}</Text>
                  <Text className="stat-count">{stat.count} 笔</Text>
                </View>
              </View>
              <View className="stat-right">
                <Text className={`stat-amount ${selectedType}`}>
                  {formatCurrency(stat.amount)}
                </Text>
                <Text className="stat-percentage">
                  {stat.percentage.toFixed(1)}%
                </Text>
              </View>
              <View className="stat-bar-bg">
                <View
                  className={`stat-bar ${selectedType}`}
                  style={{ width: `${stat.percentage}%` }}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

export default Statistics
