import { useState, useEffect, useMemo } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { useDispatch, useSelector } from 'react-redux'
import Taro, { useRouter } from '@tarojs/taro'
import { Button } from '@nutui/nutui-react-taro'
import { addTransaction, updateTransaction } from '../../actions/transaction'
import { ITransaction, ICategory } from '../../constants/commonType'
import { TransactionType } from '../../constants/transaction'
import { generateId } from '../../utils/common'
import { formatDate } from '../../utils/date'
import TypeToggle from '../../components/TypeToggle'
import Modal from '../../components/Modal'
import FormItem from '../../components/FormItem'
import CategoryIcon from '../../components/CategoryIcon'
import dayjs from 'dayjs'
import './index.scss'

const QUICK_DATE_OPTIONS = [
  { label: '今天', offset: 0 },
  { label: '昨天', offset: -1 },
  { label: '前天', offset: -2 },
]

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

  const featuredCategories = useMemo(() => filteredCategories.slice(0, 4), [filteredCategories])

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

  const handleQuickDateSelect = (offset: number) => {
    const target = dayjs().add(offset, 'day')
    setDate(formatDate(target.toDate()))
  }

  const currentDayDisplay = dayjs(date).format('YYYY年MM月DD日 dddd')

  return (
    <View className="add-page">
      <View className="hero-card">
        <View className="hero-header">
          <View>
            <Text className="hero-title">{isEdit ? '编辑账单' : '快速记一笔'}</Text>
            <Text className="hero-subtitle">{currentDayDisplay}</Text>
          </View>
          <View className="hero-toggle">
            <TypeToggle
              value={type}
              onChange={handleTypeChange}
            />
          </View>
        </View>
        <View className="hero-amount">
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
        <View className="hero-meta">
          <View className="meta-block" onClick={() => setShowCategoryPicker(true)}>
            <Text className="meta-label">分类</Text>
            <View className="meta-value">
              {category ? (
                <>
                  <CategoryIcon icon={category.icon} size="small" />
                  <Text className="meta-text">{category.name}</Text>
                </>
              ) : (
                <Text className="meta-placeholder">请选择</Text>
              )}
            </View>
          </View>
          <View className="meta-divider" />
          <View className="meta-block" onClick={() => setShowDatePicker(true)}>
            <Text className="meta-label">日期</Text>
            <Text className="meta-text">{formatDate(date, 'MM月DD日')}</Text>
          </View>
        </View>
      </View>

      <View className="section-card">
        <View className="section-header">
          <Text className="section-title">详细信息</Text>
          <Text className="section-desc">补全分类、日期与备注</Text>
        </View>
        <View className="form-stack">
          <FormItem
            label="分类"
            value={category?.name}
            placeholder="请选择分类"
            icon={category ? <CategoryIcon icon={category.icon} size="small" /> : null}
            onClick={() => setShowCategoryPicker(true)}
          />
          <FormItem
            label="日期"
            value={formatDate(date, 'YYYY年MM月DD日')}
            onClick={() => setShowDatePicker(true)}
          />
          <FormItem
            label="备注"
            value={note}
            placeholder="添加备注（可选）"
            type="input"
            onInput={setNote}
            showArrow={false}
            align="left"
          />
        </View>
      </View>

      {featuredCategories.length > 0 && (
        <View className="section-card compact">
          <View className="section-header">
            <Text className="section-title">常用分类</Text>
            <Text className="section-desc">轻点快速选择</Text>
          </View>
          <View className="quick-category-row">
            {featuredCategories.map((cat: ICategory) => (
              <View
                key={cat.id}
                className={`quick-category ${category?.id === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                <CategoryIcon icon={cat.icon} size="medium" active={category?.id === cat.id} />
                <Text className="quick-category-name">{cat.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="section-card compact">
        <View className="section-header">
          <Text className="section-title">日期快捷键</Text>
          <Text className="section-desc">常用记账场景</Text>
        </View>
        <View className="quick-date-row">
          {QUICK_DATE_OPTIONS.map((option) => (
            <View
              key={option.label}
              className={`quick-date-item ${dayjs(date).isSame(dayjs().add(option.offset, 'day'), 'day') ? 'active' : ''}`}
              onClick={() => handleQuickDateSelect(option.offset)}
            >
              <Text>{option.label}</Text>
            </View>
          ))}
          <View className="quick-date-item outline" onClick={() => setShowDatePicker(true)}>
            <Text>更多日期</Text>
          </View>
        </View>
      </View>

      {/* Category Picker */}
      <Modal
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        title="选择分类"
        position="bottom"
      >
        <View className="category-grid">
          {filteredCategories.map((cat: ICategory) => (
            <View
              key={cat.id}
              className="category-item"
              onClick={() => {
                setCategory(cat)
                setShowCategoryPicker(false)
              }}
            >
              <CategoryIcon
                icon={cat.icon}
                size="large"
                active={category?.id === cat.id}
              />
              <Text className="category-name">{cat.name}</Text>
            </View>
          ))}
        </View>
      </Modal>

      {/* Date Picker */}
      <Modal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title="选择日期"
        position="bottom"
      >
        <View className="date-quick-select">
          <View
            className="date-quick-item"
            onClick={() => {
              setDate(formatDate(new Date()))
              setShowDatePicker(false)
            }}
          >
            今天
          </View>
          <View
            className="date-quick-item"
            onClick={() => {
              setDate(formatDate(dayjs().subtract(1, 'day').toDate()))
              setShowDatePicker(false)
            }}
          >
            昨天
          </View>
          <View
            className="date-quick-item"
            onClick={() => {
              setDate(formatDate(dayjs().subtract(2, 'day').toDate()))
              setShowDatePicker(false)
            }}
          >
            前天
          </View>
        </View>
      </Modal>

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
