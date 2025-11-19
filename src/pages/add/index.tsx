import { useState, useEffect, useMemo } from 'react'
import { View, Text, Input } from '@tarojs/components'
import { useDispatch, useSelector } from 'react-redux'
import Taro, { useRouter } from '@tarojs/taro'
import { addTransaction, updateTransaction } from '../../actions/transaction'
import { ITransaction, ICategory } from '../../constants/commonType'
import { TransactionType } from '../../constants/transaction'
import { generateId } from '../../utils/common'
import { formatDate } from '../../utils/date'
import TypeToggle from '../../components/TypeToggle'
import Modal from '../../components/Modal'
import CategoryIcon from '../../components/CategoryIcon'
import dayjs from 'dayjs'

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

  const currentDayDisplay = dayjs(date).format('YYYY.MM.DD // dddd')

  return (
    <View className="min-h-screen p-6 pb-32 flex flex-col gap-6">
      {/* Header */}
      <View className="animate-fade-slide-up">
        <Text className="text-3xl font-bold text-gray-900 mb-1">
          {isEdit ? '编辑记录' : '新增记录'}
        </Text>
        <Text className="text-sm text-gray-500">
          {currentDayDisplay}
        </Text>
      </View>

      {/* Type Toggle */}
      <View className="flex justify-center animate-fade-slide-up delay-100">
        <TypeToggle value={type} onChange={handleTypeChange} />
      </View>

      {/* Amount Input - iOS Glass Card */}
      <View className="gradient-card rounded-3xl p-8 animate-fade-slide-up delay-200">
        <Text className="text-sm text-white/80 mb-4">输入金额</Text>
        <View className="flex items-center">
          <Text className="text-7xl font-bold text-white mr-2">¥</Text>
          <Input
            className="text-7xl font-bold text-white w-full border-none outline-none bg-transparent"
            style={{ caretColor: '#fff' }}
            type="digit"
            placeholder="0.00"
            placeholderStyle="color: rgba(255, 255, 255, 0.5); font-size: 72px;"
            value={amount}
            onInput={handleAmountChange}
            focus
          />
        </View>
      </View>

      {/* Category Selection */}
      <View className="glass-card rounded-3xl p-6 animate-fade-slide-up delay-300">
        <Text className="text-base font-semibold text-gray-900 mb-4">选择分类</Text>
        <View className="grid grid-cols-4 gap-4 mb-4">
          {featuredCategories.map((cat: ICategory) => (
            <View
              key={cat.id}
              className="flex flex-col items-center gap-2"
              onClick={() => setCategory(cat)}
            >
              <CategoryIcon
                icon={cat.icon}
                size="large"
                active={category?.id === cat.id}
              />
              <Text className={`text-xs text-center ${category?.id === cat.id ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                {cat.name}
              </Text>
            </View>
          ))}
        </View>
        <View className="border-t border-gray-100 pt-4">
          <View
            className="glass-bg rounded-xl p-3 text-center active:scale-98 transition-transform"
            onClick={() => setShowCategoryPicker(true)}
          >
            <Text className="text-sm font-medium text-ios-blue">查看全部</Text>
          </View>
        </View>
      </View>

      {/* Date Selection */}
      <View className="glass-card rounded-3xl p-6 animate-fade-slide-up delay-400">
        <Text className="text-base font-semibold text-gray-900 mb-4">选择日期</Text>
        <View className="grid grid-cols-4 gap-3">
          {QUICK_DATE_OPTIONS.map((option) => {
            const isActive = dayjs(date).isSame(dayjs().add(option.offset, 'day'), 'day')
            return (
              <View
                key={option.label}
                className={`p-3 rounded-xl text-center transition-all ${isActive ? 'bg-ios-blue shadow-sm' : 'bg-gray-50'}`}
                onClick={() => handleQuickDateSelect(option.offset)}
              >
                <Text className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>{option.label}</Text>
              </View>
            )
          })}
          <View
            className="p-3 rounded-xl text-center bg-gray-50 active:scale-95 transition-transform"
            onClick={() => setShowDatePicker(true)}
          >
            <Text className="text-sm font-semibold text-gray-700">更多</Text>
          </View>
        </View>
      </View>

      {/* Note Input */}
      <View className="glass-card rounded-3xl p-6 animate-fade-slide-up delay-500">
        <Text className="text-base font-semibold text-gray-900 mb-3">备注</Text>
        <Input
          className="text-base w-full border-none outline-none bg-transparent text-gray-900"
          placeholder="添加备注（可选）"
          placeholderStyle="color: #9CA3AF;"
          value={note}
          onInput={(e) => setNote(e.detail.value)}
        />
      </View>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        title="选择分类"
        position="bottom"
      >
        <View className="grid grid-cols-4 gap-6 max-h-96 overflow-y-auto">
          {filteredCategories.map((cat: ICategory) => (
            <View
              key={cat.id}
              className="flex flex-col items-center gap-2"
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
              <Text className={`text-xs text-center ${category?.id === cat.id ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                {cat.name}
              </Text>
            </View>
          ))}
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title="选择日期"
        position="bottom"
      >
        <View className="grid grid-cols-3 gap-4">
          <View
            className="glass-card rounded-2xl p-6 text-center active:scale-95 transition-transform"
            onClick={() => {
              setDate(formatDate(new Date()))
              setShowDatePicker(false)
            }}
          >
            <Text className="text-base font-semibold text-gray-900">今天</Text>
          </View>
          <View
            className="glass-card rounded-2xl p-6 text-center active:scale-95 transition-transform"
            onClick={() => {
              setDate(formatDate(dayjs().subtract(1, 'day').toDate()))
              setShowDatePicker(false)
            }}
          >
            <Text className="text-base font-semibold text-gray-900">昨天</Text>
          </View>
          <View
            className="glass-card rounded-2xl p-6 text-center active:scale-95 transition-transform"
            onClick={() => {
              setDate(formatDate(dayjs().subtract(2, 'day').toDate()))
              setShowDatePicker(false)
            }}
          >
            <Text className="text-base font-semibold text-gray-900">前天</Text>
          </View>
        </View>
      </Modal>

      {/* Save Button */}
      <View className="fixed left-6 right-6 bottom-8 z-10">
        <View
          className="gradient-card-blue rounded-2xl p-5 text-center active:scale-98 transition-transform shadow-floating"
          onClick={handleSave}
        >
          <Text className="text-xl font-bold text-white">
            {isEdit ? '保存修改' : '保存记录'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default AddTransaction
