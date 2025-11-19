import { useState, useEffect } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { useDispatch, useSelector } from 'react-redux'
import Taro, { useRouter } from '@tarojs/taro'
import { Button, Picker } from '@nutui/nutui-react-taro'
import { addTransaction, updateTransaction } from '../../actions/transaction'
import { ITransaction, ICategory } from '../../constants/commonType'
import { TransactionType } from '../../constants/transaction'
import { generateId } from '../../utils/common'
import { formatDate } from '../../utils/date'
import dayjs from 'dayjs'
import './index.scss'

function AddTransaction() {
  const router = useRouter()
  const dispatch = useDispatch()
  const transactions = useSelector((state: any) => state.transaction.list)
  const categories = useSelector((state: any) => state.category.list)

  const editId = router.params.id
  const isEdit = !!editId

  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ICategory | null>(null)
  const [note, setNote] = useState('')
  const [date, setDate] = useState(formatDate(new Date()))
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    if (isEdit) {
      const transaction = transactions.find((t: ITransaction) => t.id === editId)
      if (transaction) {
        setType(transaction.type)
        setAmount(transaction.amount.toString())
        setNote(transaction.note)
        setDate(formatDate(transaction.date))

        const cat = categories.find((c: ICategory) => c.id === transaction.categoryId)
        if (cat) {
          setCategory(cat)
        }
      }
    }
  }, [isEdit, editId, transactions, categories])

  const filteredCategories = categories.filter(
    (cat: ICategory) => cat.type === type
  )

  useEffect(() => {
    // Reset category when type changes
    if (category && category.type !== type) {
      setCategory(null)
    }
  }, [type])

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType)
  }

  const handleAmountChange = (e: any) => {
    const value = e.detail.value
    // Only allow numbers and decimal point
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value)
    }
  }

  const handleSave = async () => {
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      Taro.showToast({
        title: '请输入金额',
        icon: 'none',
      })
      return
    }

    if (!category) {
      Taro.showToast({
        title: '请选择分类',
        icon: 'none',
      })
      return
    }

    const transaction: ITransaction = {
      id: isEdit ? editId : generateId(),
      type,
      amount: parseFloat(amount),
      categoryId: category.id,
      categoryName: category.name,
      categoryIcon: category.icon,
      note,
      date: dayjs(date).toISOString(),
      createdAt: isEdit
        ? transactions.find((t: ITransaction) => t.id === editId)?.createdAt || dayjs().toISOString()
        : dayjs().toISOString(),
    }

    try {
      if (isEdit) {
        await dispatch(updateTransaction(transaction) as any)
        Taro.showToast({
          title: '更新成功',
          icon: 'success',
        })
      } else {
        await dispatch(addTransaction(transaction) as any)
        Taro.showToast({
          title: '添加成功',
          icon: 'success',
        })
      }
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    } catch (error) {
      Taro.showToast({
        title: isEdit ? '更新失败' : '添加失败',
        icon: 'none',
      })
    }
  }

  return (
    <View className="add-page">
      {/* Type Selector */}
      <View className="type-selector">
        <View
          className={`type-item ${type === TransactionType.EXPENSE ? 'active expense' : ''}`}
          onClick={() => handleTypeChange(TransactionType.EXPENSE)}
        >
          <Text>支出</Text>
        </View>
        <View
          className={`type-item ${type === TransactionType.INCOME ? 'active income' : ''}`}
          onClick={() => handleTypeChange(TransactionType.INCOME)}
        >
          <Text>收入</Text>
        </View>
      </View>

      {/* Amount Input */}
      <View className="amount-section">
        <Text className="currency-symbol">¥</Text>
        <Input
          className="amount-input"
          type="digit"
          placeholder="0.00"
          value={amount}
          onInput={handleAmountChange}
          focus
        />
      </View>

      {/* Form Fields */}
      <View className="form-section">
        {/* Category */}
        <View className="form-item" onClick={() => setShowCategoryPicker(true)}>
          <Text className="form-label">分类</Text>
          <View className="form-value">
            {category ? (
              <View className="category-display">
                <Text className="category-icon">{category.icon}</Text>
                <Text>{category.name}</Text>
              </View>
            ) : (
              <Text className="placeholder">请选择分类</Text>
            )}
            <Text className="arrow">›</Text>
          </View>
        </View>

        {/* Date */}
        <View className="form-item" onClick={() => setShowDatePicker(true)}>
          <Text className="form-label">日期</Text>
          <View className="form-value">
            <Text>{formatDate(date, 'YYYY年MM月DD日')}</Text>
            <Text className="arrow">›</Text>
          </View>
        </View>

        {/* Note */}
        <View className="form-item note-item">
          <Text className="form-label">备注</Text>
          <Input
            className="note-input"
            placeholder="添加备注（可选）"
            value={note}
            onInput={(e) => setNote(e.detail.value)}
          />
        </View>
      </View>

      {/* Category Picker */}
      {showCategoryPicker && (
        <View className="picker-overlay" onClick={() => setShowCategoryPicker(false)}>
          <View className="picker-content" onClick={(e) => e.stopPropagation()}>
            <View className="picker-header">
              <Text className="picker-cancel" onClick={() => setShowCategoryPicker(false)}>
                取消
              </Text>
              <Text className="picker-title">选择分类</Text>
              <Text className="picker-confirm" onClick={() => setShowCategoryPicker(false)}>
                确定
              </Text>
            </View>
            <View className="category-grid">
              {filteredCategories.map((cat: ICategory) => (
                <View
                  key={cat.id}
                  className={`category-item ${category?.id === cat.id ? 'selected' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  <View className="category-icon" style={{ backgroundColor: cat.color }}>
                    {cat.icon}
                  </View>
                  <Text className="category-name">{cat.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Date Picker */}
      {showDatePicker && (
        <View className="picker-overlay" onClick={() => setShowDatePicker(false)}>
          <View className="picker-content" onClick={(e) => e.stopPropagation()}>
            <View className="picker-header">
              <Text className="picker-cancel" onClick={() => setShowDatePicker(false)}>
                取消
              </Text>
              <Text className="picker-title">选择日期</Text>
              <Text className="picker-confirm" onClick={() => setShowDatePicker(false)}>
                确定
              </Text>
            </View>
            <Picker
              value={[date]}
              onChange={(val) => setDate(val[0] as unknown as string)}
            >
              {/* Date picker would need more implementation */}
              <View className="date-quick-select">
                <View className="date-quick-item" onClick={() => setDate(formatDate(new Date()))}>
                  今天
                </View>
                <View className="date-quick-item" onClick={() => setDate(formatDate(dayjs().subtract(1, 'day').toDate()))}>
                  昨天
                </View>
                <View className="date-quick-item" onClick={() => setDate(formatDate(dayjs().subtract(2, 'day').toDate()))}>
                  前天
                </View>
              </View>
            </Picker>
          </View>
        </View>
      )}

      {/* Save Button */}
      <View className="save-button">
        <Button type="primary" block onClick={handleSave}>
          {isEdit ? '更新' : '保存'}
        </Button>
      </View>
    </View>
  )
}

export default AddTransaction
