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

      {/* Trend Chart */}
      <View className="px-lg mb-lg">
        <View className="bg-card-solid rounded-xxl shadow-md p-lg" style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}>
          <View className="flex justify-between items-center mb-lg">
            <View>
              <Text className="text-xl font-bold text-text-primary">{selectedType === TransactionType.EXPENSE ? '消费趋势' : '收入趋势'}</Text>
              <Text className="text-xs text-text-secondary mt-xs">{trendSummary.rangeText}</Text>
            </View>
            <View className="flex gap-xs">
              {TREND_RANGE_OPTIONS.map((option) => (
                <View
                  key={option.value}
                  className={`px-md py-xs rounded-md text-xs font-medium transition-all duration-fast ${
                    trendRange === option.value
                      ? 'bg-primary text-white'
                      : 'bg-transparent text-text-secondary'
                  }`}
                  style={{ border: trendRange === option.value ? 'none' : '1px solid rgba(0, 0, 0, 0.1)' }}
                  onClick={() => setTrendRange(option.value)}
                >
                  <Text className={trendRange === option.value ? 'text-white' : 'text-text-secondary'}>{option.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Enhanced Bar Chart */}
          <ScrollView
            scrollX
            enableFlex
            className="overflow-hidden"
          >
            <View className="flex gap-md py-md" style={{ minWidth: `${trendRange * 60}px` }}>
              {trendData.map((point) => {
                const height = trendMaxAmount > 0 ? (point.amount / trendMaxAmount) * 100 : 0
                const isToday = dayjs(point.date).isSame(dayjs(), 'day')
                const isHighest = point.amount === trendMaxAmount && point.amount > 0

                return (
                  <View key={point.date} className="flex-1 flex flex-col items-center gap-xs min-w-[48px]">
                    {/* Amount Label */}
                    {point.amount > 0 && (
                      <Text className={`text-xs font-medium ${isHighest ? 'text-primary' : 'text-text-secondary'}`}>
                        {point.amount >= 1000 ? `${(point.amount / 1000).toFixed(1)}k` : point.amount.toFixed(0)}
                      </Text>
                    )}

                    {/* Bar */}
                    <View
                      className="w-full rounded-t-lg transition-all duration-300"
                      style={{
                        height: `${Math.max(height * 1.2, 8)}px`,
                        maxHeight: '120px',
                        background: point.amount > 0
                          ? selectedType === TransactionType.EXPENSE
                            ? isHighest ? '#FF3B30' : 'linear-gradient(180deg, rgba(255, 59, 48, 0.8) 0%, rgba(255, 59, 48, 0.4) 100%)'
                            : isHighest ? '#34C759' : 'linear-gradient(180deg, rgba(52, 199, 89, 0.8) 0%, rgba(52, 199, 89, 0.4) 100%)'
                          : 'rgba(0, 0, 0, 0.05)',
                        boxShadow: isHighest ? '0 4px 12px rgba(0, 122, 255, 0.3)' : 'none'
                      }}
                    />

                    {/* Date Label */}
                    <Text className={`text-xs ${isToday ? 'font-bold text-primary' : 'text-text-tertiary'}`}>
                      {dayjs(point.date).format('DD')}
                    </Text>
                  </View>
                )
              })}
            </View>
          </ScrollView>

          {/* Insights */}
          <View className="mt-lg pt-md flex gap-md" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <View className="flex-1 rounded-lg p-md" style={{ background: 'rgba(0, 122, 255, 0.06)' }}>
              <Text className="text-xs text-text-secondary">峰值</Text>
              <Text className="text-base font-bold text-primary mt-xs">
                {trendSummary.peak.amount > 0 ? formatCurrency(trendSummary.peak.amount) : '--'}
              </Text>
              <Text className="text-xs text-text-tertiary mt-xs">
                {trendSummary.peak.amount > 0 ? dayjs(trendSummary.peak.date).format('MM/DD') : '暂无'}
              </Text>
            </View>
            <View className="flex-1 rounded-lg p-md" style={{ background: 'rgba(0, 0, 0, 0.03)' }}>
              <Text className="text-xs text-text-secondary">日均</Text>
              <Text className="text-base font-bold text-text-primary mt-xs">
                {formatCurrency(trendSummary.average)}
              </Text>
              <Text className="text-xs text-text-tertiary mt-xs">
                {trendData.length}天数据
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Category Ranking */}
      <View className="px-lg">
        <View className="flex justify-between items-center mb-md">
          <Text className="text-xl font-bold text-text-primary">分类排行</Text>
          <Text className="text-xs text-text-secondary">共 {categoryStats.length} 个分类</Text>
        </View>

        {categoryStats.length === 0 ? (
          <View className="bg-card-solid rounded-xxl p-xl text-center" style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}>
            <Text className="text-4xl mb-md">📊</Text>
            <Text className="text-base text-text-secondary mb-xs">暂无数据</Text>
            <Text className="text-sm text-text-tertiary">开始记账后这里会显示分类统计</Text>
          </View>
        ) : (
          <View className="flex flex-col gap-md">
            {categoryStats.map((stat, index) => {
              const isTop3 = index < 3
              const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']

              return (
                <View
                  key={stat.categoryId}
                  className="bg-card-solid rounded-xl p-lg shadow-sm relative overflow-hidden"
                  style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}
                >
                  {/* Background Progress Bar */}
                  <View
                    className="absolute left-0 top-0 bottom-0 transition-all duration-500"
                    style={{
                      width: `${stat.percentage}%`,
                      background: selectedType === TransactionType.EXPENSE
                        ? 'linear-gradient(90deg, rgba(255, 59, 48, 0.08) 0%, rgba(255, 59, 48, 0.02) 100%)'
                        : 'linear-gradient(90deg, rgba(52, 199, 89, 0.08) 0%, rgba(52, 199, 89, 0.02) 100%)',
                      borderRadius: '16px'
                    }}
                  />

                  <View className="flex items-center justify-between relative z-10">
                    <View className="flex items-center gap-md flex-1">
                      {/* Rank Badge */}
                      {isTop3 ? (
                        <View
                          className="w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-white"
                          style={{ background: rankColors[index] }}
                        >
                          <Text className="text-white font-bold">{index + 1}</Text>
                        </View>
                      ) : (
                        <View
                          className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-text-secondary"
                          style={{ background: 'rgba(0, 0, 0, 0.05)' }}
                        >
                          <Text className="text-text-secondary text-sm">{index + 1}</Text>
                        </View>
                      )}

                      {/* Category Info */}
                      <CategoryIcon icon={stat.categoryIcon} size="medium" />
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-text-primary">{stat.categoryName}</Text>
                        <Text className="text-xs text-text-secondary mt-xs">{stat.count} 笔交易</Text>
                      </View>
                    </View>

                    {/* Amount & Percentage */}
                    <View className="text-right">
                      <Text className={`text-lg font-bold ${selectedType === TransactionType.EXPENSE ? 'text-expense' : 'text-income'}`}>
                        {formatCurrency(stat.amount)}
                      </Text>
                      <View
                        className="px-md py-xs rounded-full mt-xs inline-flex"
                        style={{
                          background: selectedType === TransactionType.EXPENSE
                            ? 'rgba(255, 59, 48, 0.1)'
                            : 'rgba(52, 199, 89, 0.1)'
                        }}
                      >
                        <Text className={`text-xs font-semibold ${selectedType === TransactionType.EXPENSE ? 'text-expense' : 'text-income'}`}>
                          {stat.percentage.toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        )}
      </View>
    </View>
  )
}

export default Statistics
