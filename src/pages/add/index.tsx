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
    <View className="min-h-screen bg-brutal-white p-6 pb-32 flex flex-col gap-6 relative">
      {/* Grid Background */}
      <View className="absolute inset-0 bg-grid pointer-events-none opacity-20" />

      {/* Header */}
      <View className="slide-in-up">
        <Text className="text-4xl font-mono-brutal mb-2">
          {isEdit ? '[ EDIT ]' : '[ NEW_RECORD ]'}
        </Text>
        <Text className="text-sm font-mono text-brutal-gray">
          {'>'} {'>'} {currentDayDisplay}
        </Text>
      </View>

      {/* Type Toggle */}
      <View className="flex justify-between items-center slide-in-up stagger-1">
        <Text className="font-mono-brutal text-lg">TYPE:</Text>
        <TypeToggle value={type} onChange={handleTypeChange} />
      </View>

      {/* Amount Input - Bold Brutal */}
      <View className="border-brutal-neon bg-neon-yellow p-8 slide-in-up stagger-2">
        <Text className="text-xs font-mono-brutal mb-4">INPUT_AMOUNT:</Text>
        <View className="flex items-center">
          <Text className="text-8xl font-mono-brutal mr-2">¥</Text>
          <Input
            className="text-8xl font-mono-brutal w-full border-none outline-none bg-transparent"
            style={{ caretColor: '#000' }}
            type="digit"
            placeholder="0.00"
            placeholderStyle="color: rgba(0, 0, 0, 0.3); font-size: 80px;"
            value={amount}
            onInput={handleAmountChange}
            focus
          />
        </View>
      </View>

      {/* Category Selection */}
      <View className="border-brutal bg-brutal-white slide-in-up stagger-3">
        <View className="border-b-4 border-brutal-black p-4">
          <Text className="font-mono-brutal text-lg">{'>'} CATEGORY</Text>
        </View>
        <View className="p-6 grid grid-cols-4 gap-4">
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
              <Text className={`text-xs font-mono text-center ${category?.id === cat.id ? 'font-mono-brutal' : ''}`}>
                {cat.name}
              </Text>
            </View>
          ))}
        </View>
        <View className="border-t-4 border-brutal-black p-4">
          <View
            className="border-brutal-sm bg-brutal-white p-4 text-center active-brutal active-brutal-shadow"
            onClick={() => setShowCategoryPicker(true)}
          >
            <Text className="font-mono-brutal">VIEW_ALL</Text>
          </View>
        </View>
      </View>

      {/* Date Selection */}
      <View className="border-brutal bg-brutal-white slide-in-up stagger-4">
        <View className="border-b-4 border-brutal-black p-4">
          <Text className="font-mono-brutal text-lg">{'>'} DATE</Text>
        </View>
        <View className="p-6 grid grid-cols-4 gap-4">
          {QUICK_DATE_OPTIONS.map((option) => {
            const isActive = dayjs(date).isSame(dayjs().add(option.offset, 'day'), 'day')
            return (
              <View
                key={option.label}
                className={`p-4 text-center border-brutal-sm ${isActive ? 'bg-neon-yellow' : 'bg-brutal-white'} active-brutal active-brutal-shadow`}
                onClick={() => handleQuickDateSelect(option.offset)}
              >
                <Text className="font-mono-brutal">{option.label}</Text>
              </View>
            )
          })}
          <View
            className="p-4 text-center border-brutal-sm bg-brutal-white active-brutal active-brutal-shadow"
            onClick={() => setShowDatePicker(true)}
          >
            <Text className="font-mono-brutal">...</Text>
          </View>
        </View>
      </View>

      {/* Note Input */}
      <View className="border-brutal bg-brutal-white slide-in-up stagger-5">
        <View className="border-b-4 border-brutal-black p-4">
          <Text className="font-mono-brutal text-lg">{'>'} NOTE</Text>
        </View>
        <View className="p-4">
          <Input
            className="font-mono text-base w-full border-none outline-none bg-transparent p-2"
            placeholder="Add note (optional)..."
            placeholderStyle="color: #808080;"
            value={note}
            onInput={(e) => setNote(e.detail.value)}
          />
        </View>
      </View>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        title="SELECT_CATEGORY"
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
              <Text className={`text-xs font-mono text-center ${category?.id === cat.id ? 'font-mono-brutal' : ''}`}>
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
        title="SELECT_DATE"
        position="bottom"
      >
        <View className="flex gap-4">
          <View
            className="flex-1 p-6 border-brutal-sm bg-brutal-white text-center active-brutal active-brutal-shadow"
            onClick={() => {
              setDate(formatDate(new Date()))
              setShowDatePicker(false)
            }}
          >
            <Text className="font-mono-brutal">TODAY</Text>
          </View>
          <View
            className="flex-1 p-6 border-brutal-sm bg-brutal-white text-center active-brutal active-brutal-shadow"
            onClick={() => {
              setDate(formatDate(dayjs().subtract(1, 'day').toDate()))
              setShowDatePicker(false)
            }}
          >
            <Text className="font-mono-brutal">YESTERDAY</Text>
          </View>
          <View
            className="flex-1 p-6 border-brutal-sm bg-brutal-white text-center active-brutal active-brutal-shadow"
            onClick={() => {
              setDate(formatDate(dayjs().subtract(2, 'day').toDate()))
              setShowDatePicker(false)
            }}
          >
            <Text className="font-mono-brutal">2_DAYS_AGO</Text>
          </View>
        </View>
      </Modal>

      {/* Save Button */}
      <View className="fixed left-6 right-6 bottom-8 z-10">
        <View
          className="bg-neon-yellow border-brutal p-6 text-center active-brutal active-brutal-shadow"
          onClick={handleSave}
        >
          <Text className="font-mono-brutal text-2xl">
            {isEdit ? '[ SAVE_CHANGES ]' : '[ SAVE_RECORD ]'}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default AddTransaction
