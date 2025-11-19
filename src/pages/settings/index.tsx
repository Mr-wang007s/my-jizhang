import { View, Text } from '@tarojs/components'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import storageService from '../../services/storage'
import { loadTransactions } from '../../actions/transaction'
import { loadCategories } from '../../actions/category'
import dayjs from 'dayjs'

function Settings() {
  const dispatch = useDispatch()
  const transactions = useSelector((state: any) => state.transaction.list)
  const categories = useSelector((state: any) => state.category.list)

  // Calculate some useful stats
  const totalExpense = transactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0)
  const totalIncome = transactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0)
  const firstRecord = transactions.length > 0 ? dayjs(transactions[transactions.length - 1].createdAt) : null
  const daysUsed = firstRecord ? dayjs().diff(firstRecord, 'day') + 1 : 0

  const handleClearData = () => {
    Taro.showModal({
      title: '确认清空',
      content: '此操作将清空所有记录数据，且无法恢复，确定要继续吗？',
      confirmText: '确定清空',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          try {
            storageService.clearAll()
            dispatch(loadTransactions() as any)
            dispatch(loadCategories() as any)
            Taro.showToast({
              title: '清空成功',
              icon: 'success',
            })
          } catch (error) {
            Taro.showToast({
              title: '清空失败',
              icon: 'none',
            })
          }
        }
      },
    })
  }

  const handleExportData = () => {
    Taro.showToast({
      title: '导出功能开发中',
      icon: 'none',
    })
  }

  const handleBackup = () => {
    Taro.showToast({
      title: '备份功能开发中',
      icon: 'none',
    })
  }

  return (
    <View className="min-h-screen bg-gradient-fade pb-xl">
      {/* Profile Header */}
      <View className="px-lg pt-xl pb-lg">
        <View className="gradient-primary rounded-xxl p-xl shadow-lg text-white" style={{ boxShadow: '0 16px 32px rgba(0, 0, 0, 0.12), 0 20px 40px rgba(0, 122, 255, 0.25)' }}>
          <View className="flex items-center gap-lg mb-lg">
            <View className="w-[80px] h-[80px] rounded-full flex items-center justify-center text-4xl" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
              <Text>💰</Text>
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-semibold text-white mb-xs">记账达人</Text>
              <Text className="text-sm opacity-80">已使用 {daysUsed} 天</Text>
            </View>
          </View>

          <View className="grid grid-cols-3 gap-md pt-md" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <View className="text-center">
              <Text className="text-xs opacity-80 block mb-xs">总记录</Text>
              <Text className="text-xl font-bold text-white">{transactions.length}</Text>
            </View>
            <View className="text-center">
              <Text className="text-xs opacity-80 block mb-xs">总支出</Text>
              <Text className="text-xl font-bold text-white">¥{(totalExpense / 1000).toFixed(1)}k</Text>
            </View>
            <View className="text-center">
              <Text className="text-xs opacity-80 block mb-xs">总收入</Text>
              <Text className="text-xl font-bold text-white">¥{(totalIncome / 1000).toFixed(1)}k</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-lg mb-lg">
        <Text className="text-base font-semibold text-text-primary mb-md">快捷操作</Text>
        <View className="grid grid-cols-3 gap-md">
          <View
            className="bg-card-solid rounded-xl p-lg shadow-sm text-center active-scale"
            style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}
            onClick={handleExportData}
          >
            <Text className="text-3xl mb-sm">📤</Text>
            <Text className="text-sm text-text-primary font-medium">导出数据</Text>
          </View>
          <View
            className="bg-card-solid rounded-xl p-lg shadow-sm text-center active-scale"
            style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}
            onClick={handleBackup}
          >
            <Text className="text-3xl mb-sm">💾</Text>
            <Text className="text-sm text-text-primary font-medium">备份数据</Text>
          </View>
          <View
            className="bg-card-solid rounded-xl p-lg shadow-sm text-center active-scale"
            style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}
            onClick={() => {
              Taro.showToast({ title: '分享功能开发中', icon: 'none' })
            }}
          >
            <Text className="text-3xl mb-sm">📱</Text>
            <Text className="text-sm text-text-primary font-medium">分享应用</Text>
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View className="px-lg mb-lg">
        <Text className="text-base font-semibold text-text-primary mb-md">数据管理</Text>
        <View className="bg-card-solid rounded-xl shadow-md overflow-hidden" style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}>
          <View className="flex items-center justify-between p-lg" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <View className="flex items-center gap-md">
              <View className="w-[44px] h-[44px] rounded-full flex items-center justify-center" style={{ background: 'rgba(0, 122, 255, 0.1)' }}>
                <Text className="text-xl">📊</Text>
              </View>
              <View>
                <Text className="text-base font-medium text-text-primary">数据统计</Text>
                <Text className="text-xs text-text-secondary mt-xs">{transactions.length} 条记录 · {categories.length} 个分类</Text>
              </View>
            </View>
          </View>

          <View className="flex items-center justify-between p-lg" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <View className="flex items-center gap-md">
              <View className="w-[44px] h-[44px] rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 149, 0, 0.1)' }}>
                <Text className="text-xl">🔒</Text>
              </View>
              <View>
                <Text className="text-base font-medium text-text-primary">隐私保护</Text>
                <Text className="text-xs text-text-secondary mt-xs">本地存储，数据安全</Text>
              </View>
            </View>
          </View>

          <View
            className="flex items-center justify-between p-lg active-scale"
            onClick={handleClearData}
          >
            <View className="flex items-center gap-md">
              <View className="w-[44px] h-[44px] rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 59, 48, 0.1)' }}>
                <Text className="text-xl">🗑️</Text>
              </View>
              <View>
                <Text className="text-base font-medium text-expense">清空所有数据</Text>
                <Text className="text-xs text-text-secondary mt-xs">谨慎操作，不可恢复</Text>
              </View>
            </View>
            <Text className="text-text-tertiary">›</Text>
          </View>
        </View>
      </View>

      {/* About */}
      <View className="px-lg mb-lg">
        <Text className="text-base font-semibold text-text-primary mb-md">关于应用</Text>
        <View className="bg-card-solid rounded-xl shadow-md overflow-hidden" style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}>
          <View className="flex items-center justify-between p-lg" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Text className="text-base text-text-primary">版本号</Text>
            <Text className="text-base text-text-secondary font-medium">v1.0.0</Text>
          </View>
          <View className="flex items-center justify-between p-lg" style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Text className="text-base text-text-primary">技术栈</Text>
            <Text className="text-base text-text-secondary font-medium">Taro + React + Tailwind</Text>
          </View>
          <View className="flex items-center justify-between p-lg">
            <Text className="text-base text-text-primary">开源协议</Text>
            <Text className="text-base text-text-secondary font-medium">MIT License</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="text-center px-lg py-xl">
        <Text className="text-2xl font-light text-text-primary mb-md">💰 个人记账本</Text>
        <Text className="text-sm text-text-secondary mb-xs">优雅简洁的 iOS 风格记账应用</Text>
        <Text className="text-xs text-text-tertiary">Made with ❤️ by Taro Team</Text>
        <Text className="text-xs text-text-tertiary mt-md">© 2025 All Rights Reserved</Text>
      </View>
    </View>
  )
}

export default Settings
