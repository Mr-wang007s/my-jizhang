import { View, Text } from '@tarojs/components'
import { useDispatch, useSelector } from 'react-redux'
import Taro from '@tarojs/taro'
import storageService from '../../services/storage'
import { loadTransactions } from '../../actions/transaction'
import { loadCategories } from '../../actions/category'
import './index.scss'

function Settings() {
  const dispatch = useDispatch()
  const transactions = useSelector((state: any) => state.transaction.list)
  const categories = useSelector((state: any) => state.category.list)

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
    <View className="settings-page">
      {/* Stats Card */}
      <View className="stats-card">
        <View className="stats-item">
          <Text className="stats-value">{transactions.length}</Text>
          <Text className="stats-label">记录总数</Text>
        </View>
        <View className="stats-divider"></View>
        <View className="stats-item">
          <Text className="stats-value">{categories.length}</Text>
          <Text className="stats-label">分类总数</Text>
        </View>
      </View>

      {/* Settings List */}
      <View className="settings-section">
        <View className="section-title">
          <Text>数据管理</Text>
        </View>
        <View className="settings-list">
          <View className="settings-item" onClick={handleExportData}>
            <View className="item-left">
              <Text className="item-icon">📤</Text>
              <Text className="item-text">导出数据</Text>
            </View>
            <Text className="item-arrow">›</Text>
          </View>
          <View className="settings-item" onClick={handleBackup}>
            <View className="item-left">
              <Text className="item-icon">💾</Text>
              <Text className="item-text">备份数据</Text>
            </View>
            <Text className="item-arrow">›</Text>
          </View>
          <View className="settings-item" onClick={handleClearData}>
            <View className="item-left">
              <Text className="item-icon">🗑️</Text>
              <Text className="item-text">清空数据</Text>
            </View>
            <Text className="item-arrow">›</Text>
          </View>
        </View>
      </View>

      <View className="settings-section">
        <View className="section-title">
          <Text>关于</Text>
        </View>
        <View className="settings-list">
          <View className="settings-item">
            <View className="item-left">
              <Text className="item-icon">ℹ️</Text>
              <Text className="item-text">版本号</Text>
            </View>
            <Text className="item-value">1.0.0</Text>
          </View>
          <View className="settings-item">
            <View className="item-left">
              <Text className="item-icon">👨‍💻</Text>
              <Text className="item-text">开发者</Text>
            </View>
            <Text className="item-value">Taro + React</Text>
          </View>
        </View>
      </View>

      {/* App Info */}
      <View className="app-info">
        <Text className="app-name">个人记账本</Text>
        <Text className="app-description">iOS 风格记账应用</Text>
        <Text className="app-copyright">© 2025 All Rights Reserved</Text>
      </View>
    </View>
  )
}

export default Settings
