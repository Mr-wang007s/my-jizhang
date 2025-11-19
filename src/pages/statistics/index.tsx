import { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { useSelector } from 'react-redux'
import { ITransaction, ICategoryStats } from '../../constants/commonType'
import { TransactionType } from '../../constants/transaction'
import { formatCurrency } from '../../utils/calculation'
import TypeToggle from '../../components/TypeToggle'
import CategoryIcon from '../../components/CategoryIcon'
import dayjs from 'dayjs'

type PeriodType = 'week' | 'month' | 'year'
type TrendRange = 7 | 15 | 30

interface ITrendPoint {
  date: string
  amount: number
}

const TREND_RANGE_OPTIONS: { label: string; value: TrendRange }[] = [
  { label: '7天', value: 7 },
  { label: '15天', value: 15 },
  { label: '30天', value: 30 },
]

function Statistics() {
  const transactions = useSelector((state: any) => state.transaction.list)
  const categories = useSelector((state: any) => state.category.list)
  const [period, setPeriod] = useState<PeriodType>('month')
  const [selectedType, setSelectedType] = useState<TransactionType>(TransactionType.EXPENSE)
  const [trendRange, setTrendRange] = useState<TrendRange>(7)

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

  const trendData: ITrendPoint[] = useMemo(() => {
    const endDate = dayjs().endOf('day')
    const startDate = endDate.subtract(trendRange - 1, 'day').startOf('day')

    const points: ITrendPoint[] = new Array(trendRange).fill(null).map((_, index) => {
      const date = startDate.add(index, 'day')
      return {
        date: date.format('YYYY-MM-DD'),
        amount: 0,
      }
    })

    const pointMap = points.reduce((map, point) => {
      map.set(point.date, point)
      return map
    }, new Map<string, ITrendPoint>())

    transactions.forEach((transaction: ITransaction) => {
      if (transaction.type !== selectedType) return
      const transactionDate = dayjs(transaction.date)
      if (transactionDate.isBefore(startDate) || transactionDate.isAfter(endDate)) return
      const key = transactionDate.format('YYYY-MM-DD')
      const target = pointMap.get(key)
      if (target) {
        target.amount += transaction.amount
      }
    })

    return points
  }, [transactions, selectedType, trendRange])

  const trendMaxAmount = useMemo(() => {
    return trendData.reduce((max, point) => (point.amount > max ? point.amount : max), 0)
  }, [trendData])

  const trendSummary = useMemo(() => {
    if (trendData.length === 0) {
      return {
        total: 0,
        average: 0,
        peak: { date: '', amount: 0 },
        rangeText: '--',
      }
    }

    const total = trendData.reduce((sum, point) => sum + point.amount, 0)
    const peak = trendData.reduce((prev, point) => (point.amount > prev.amount ? point : prev), trendData[0])
    const rangeText = `${dayjs(trendData[0].date).format('MM/DD')} - ${dayjs(trendData[trendData.length - 1].date).format('MM/DD')}`

    return {
      total,
      average: trendData.length ? total / trendData.length : 0,
      peak,
      rangeText,
    }
  }, [trendData])

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
    <View className="min-h-screen bg-gradient-fade pb-lg">
      {/* Hero Section */}
      <View className="px-lg pt-xl pb-md">
        <Text className="text-3xl font-light text-text-primary mb-xs">数据分析</Text>
        <Text className="text-sm text-text-secondary">深入了解你的财务状况</Text>
      </View>

      {/* Period & Type Selector */}
      <View className="px-lg mb-lg">
        <View className="bg-card-solid rounded-xxl shadow-lg p-md" style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}>
          <View className="flex justify-between items-center mb-md">
            <View className="flex gap-xs">
              {(['week', 'month', 'year'] as PeriodType[]).map((p) => (
                <View
                  key={p}
                  className={`px-lg py-sm rounded-lg transition-all duration-fast ${period === p ? 'bg-primary text-white' : 'bg-transparent text-text-secondary'}`}
                  onClick={() => setPeriod(p)}
                >
                  <Text className={period === p ? 'text-white font-semibold' : 'text-text-secondary'}>
                    {p === 'week' ? '周' : p === 'month' ? '月' : '年'}
                  </Text>
                </View>
              ))}
            </View>
            <TypeToggle
              value={selectedType as 'expense' | 'income'}
              onChange={(value) => setSelectedType(value as TransactionType)}
            />
          </View>

          {/* Quick Stats */}
          <View className="grid grid-cols-3 gap-md pt-md" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <View className="text-center">
              <Text className="text-xs text-text-tertiary mb-xs block">总额</Text>
              <Text className={`text-lg font-bold ${selectedType === TransactionType.EXPENSE ? 'text-expense' : 'text-income'}`}>
                {formatCurrency(totalAmount)}
              </Text>
            </View>
            <View className="text-center">
              <Text className="text-xs text-text-tertiary mb-xs block">笔数</Text>
              <Text className="text-lg font-bold text-text-primary">{filteredTransactions.length}</Text>
            </View>
            <View className="text-center">
              <Text className="text-xs text-text-tertiary mb-xs block">均值</Text>
              <Text className="text-lg font-bold text-text-primary">
                {filteredTransactions.length > 0 ? formatCurrency(totalAmount / filteredTransactions.length) : '¥0.00'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Trend Section */}
      <View className="trend-section">
        <View className="trend-header">
          <View className="trend-title-wrap">
            <Text className="trend-title">{selectedType === TransactionType.EXPENSE ? '消费趋势' : '收入趋势'}</Text>
            <Text className="trend-subtitle">{trendSummary.rangeText}</Text>
          </View>
          <View className="trend-range">
            {TREND_RANGE_OPTIONS.map((option) => (
              <View
                key={option.value}
                className={`trend-range-item ${trendRange === option.value ? 'active' : ''}`}
                onClick={() => setTrendRange(option.value)}
              >
                <Text>{option.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="trend-metrics">
          <View className="trend-metric">
            <Text className="metric-label">总额</Text>
            <Text className={`metric-value ${selectedType}`}>
              {formatCurrency(trendSummary.total)}
            </Text>
          </View>
          <View className="trend-metric">
            <Text className="metric-label">日均</Text>
            <Text className="metric-value">
              {formatCurrency(trendSummary.average)}
            </Text>
          </View>
          <View className="trend-metric">
            <Text className="metric-label">峰值日</Text>
            <Text className="metric-value">
              {trendSummary.peak.amount > 0 ? dayjs(trendSummary.peak.date).format('MM/DD') : '--'}
            </Text>
          </View>
        </View>

        <ScrollView className="trend-chart" scrollX enableFlex>
          <View className="trend-columns">
            {trendData.map((point) => {
              const height = trendMaxAmount > 0 ? (point.amount / trendMaxAmount) * 100 : 0
              return (
                <View key={point.date} className="trend-column">
                  <View className="trend-bar-wrapper">
                    <View
                      className={`trend-bar ${selectedType}`}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                  </View>
                  <Text className="trend-amount">
                    {point.amount === 0 ? '-' : formatCurrency(point.amount)}
                  </Text>
                  <Text className="trend-date">{dayjs(point.date).format('MM/DD')}</Text>
                </View>
              )
            })}
          </View>
        </ScrollView>
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
