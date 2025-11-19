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
    <View className="min-h-screen bg-gradient-fade p-[32px_24px_160px] flex flex-col gap-xl">
      <View className="glass-card rounded-xxl p-xl flex flex-col gap-lg" style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', border: '1px solid rgba(255, 255, 255, 0.7)' }}>
        <View className="flex justify-between items-start gap-lg">
          <View>
            <Text className="text-2xl font-semibold text-text-primary">{isEdit ? '编辑账单' : '快速记一笔'}</Text>
            <Text className="text-base text-text-secondary mt-xs">{currentDayDisplay}</Text>
          </View>
          <View className="flex-shrink-0">
            <TypeToggle
              value={type}
              onChange={handleTypeChange}
            />
          </View>
        </View>
        <View className="flex items-center rounded-xl p-[24px_16px]" style={{ background: 'rgba(255, 255, 255, 0.6)', boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)' }}>
          <Text className="text-4xl text-text-secondary font-light mr-xs pt-sm">¥</Text>
          <Input
            className="text-4xl font-light text-text-primary w-full border-none outline-none bg-transparent"
            style={{ caretColor: '#007AFF' }}
            type="digit"
            placeholder="0.00"
            placeholderClass="text-text-tertiary font-extralight"
            value={amount}
            onInput={handleAmountChange}
            focus
          />
        </View>
        <View className="flex items-center justify-between gap-lg pt-md" style={{ borderTop: '1px solid rgba(0, 0, 0, 0.04)' }}>
          <View className="flex-1 flex flex-col gap-[6px]" onClick={() => setShowCategoryPicker(true)}>
            <Text className="text-xs uppercase text-text-tertiary" style={{ letterSpacing: '1px' }}>分类</Text>
            <View className="flex items-center gap-xs">
              {category ? (
                <>
                  <CategoryIcon icon={category.icon} size="small" />
                  <Text className="text-lg text-text-primary font-semibold">{category.name}</Text>
                </>
              ) : (
                <Text className="text-base text-text-secondary">请选择</Text>
              )}
            </View>
          </View>
          <View className="w-[1px] h-[36px]" style={{ background: 'rgba(0, 0, 0, 0.08)' }} />
          <View className="flex-1 flex flex-col gap-[6px]" onClick={() => setShowDatePicker(true)}>
            <Text className="text-xs uppercase text-text-tertiary" style={{ letterSpacing: '1px' }}>日期</Text>
            <Text className="text-lg text-text-primary font-semibold">{formatDate(date, 'MM月DD日')}</Text>
          </View>
        </View>
      </View>

      <View className="bg-card-solid rounded-xxl p-xl shadow-md flex flex-col gap-md" style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}>
        <View className="flex flex-col gap-[4px]">
          <Text className="text-lg font-semibold text-text-primary">详细信息</Text>
          <Text className="text-sm text-text-secondary">补全分类、日期与备注</Text>
        </View>
        <View className="flex flex-col">
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
        <View className="bg-card-solid rounded-xxl p-lg shadow-md flex flex-col gap-md" style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}>
          <View className="flex flex-col gap-[4px]">
            <Text className="text-lg font-semibold text-text-primary">常用分类</Text>
            <Text className="text-sm text-text-secondary">轻点快速选择</Text>
          </View>
          <View className="grid grid-cols-4 gap-md">
            {featuredCategories.map((cat: ICategory) => (
              <View
                key={cat.id}
                className={`rounded-xl p-[16px_12px] flex flex-col items-center gap-xs transition-all duration-fast ${category?.id === cat.id ? 'shadow-sm' : ''}`}
                style={{
                  background: category?.id === cat.id ? 'rgba(0, 122, 255, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                  border: `1px solid ${category?.id === cat.id ? 'rgba(0, 122, 255, 0.2)' : 'transparent'}`
                }}
                onClick={() => setCategory(cat)}
              >
                <CategoryIcon icon={cat.icon} size="medium" active={category?.id === cat.id} />
                <Text className="text-xs text-text-secondary text-center">{cat.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="bg-card-solid rounded-xxl p-lg shadow-md flex flex-col gap-md" style={{ border: '1px solid rgba(0, 0, 0, 0.04)' }}>
        <View className="flex flex-col gap-[4px]">
          <Text className="text-lg font-semibold text-text-primary">日期快捷键</Text>
          <Text className="text-sm text-text-secondary">常用记账场景</Text>
        </View>
        <View className="grid grid-cols-4 gap-sm">
          {QUICK_DATE_OPTIONS.map((option) => (
            <View
              key={option.label}
              className={`p-[16px_12px] text-center rounded-lg text-base font-semibold transition-all duration-fast active:scale-95 flex items-center justify-center ${
                dayjs(date).isSame(dayjs().add(option.offset, 'day'), 'day') ? 'text-primary' : 'text-text-secondary'
              }`}
              style={{
                background: dayjs(date).isSame(dayjs().add(option.offset, 'day'), 'day') ? 'rgba(0, 122, 255, 0.1)' : 'rgba(0, 0, 0, 0.02)',
                border: `1px solid ${dayjs(date).isSame(dayjs().add(option.offset, 'day'), 'day') ? 'rgba(0, 122, 255, 0.3)' : 'transparent'}`,
                minHeight: '36px'
              }}
              onClick={() => handleQuickDateSelect(option.offset)}
            >
              <Text>{option.label}</Text>
            </View>
          ))}
          <View
            className="p-[16px_12px] text-center text-base font-semibold text-text-secondary rounded-lg transition-all duration-fast active:scale-95 flex items-center justify-center"
            style={{ background: 'transparent', border: '1px solid rgba(0, 0, 0, 0.1)', minHeight: '36px' }}
            onClick={() => setShowDatePicker(true)}
          >
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
        <View className="grid grid-cols-4 gap-[32px_24px] p-0 overflow-y-auto max-h-[500px]" style={{ WebkitOverflowScrolling: 'touch' }}>
          {filteredCategories.map((cat: ICategory) => (
            <View
              key={cat.id}
              className="flex flex-col items-center gap-sm transition-transform duration-fast active:scale-95"
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
              <Text className="text-sm text-text-secondary text-center transition-all duration-fast">{cat.name}</Text>
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
        <View className="flex gap-md p-0">
          <View
            className="flex-1 p-[24px_16px] rounded-lg text-center text-base text-primary font-semibold transition-all duration-fast active:scale-[0.96] flex items-center justify-center"
            style={{
              background: 'rgba(0, 122, 255, 0.06)',
              border: '2px solid transparent',
              minHeight: '56px'
            }}
            onClick={() => {
              setDate(formatDate(new Date()))
              setShowDatePicker(false)
            }}
          >
            今天
          </View>
          <View
            className="flex-1 p-[24px_16px] rounded-lg text-center text-base text-primary font-semibold transition-all duration-fast active:scale-[0.96] flex items-center justify-center"
            style={{
              background: 'rgba(0, 122, 255, 0.06)',
              border: '2px solid transparent',
              minHeight: '56px'
            }}
            onClick={() => {
              setDate(formatDate(dayjs().subtract(1, 'day').toDate()))
              setShowDatePicker(false)
            }}
          >
            昨天
          </View>
          <View
            className="flex-1 p-[24px_16px] rounded-lg text-center text-base text-primary font-semibold transition-all duration-fast active:scale-[0.96] flex items-center justify-center"
            style={{
              background: 'rgba(0, 122, 255, 0.06)',
              border: '2px solid transparent',
              minHeight: '56px'
            }}
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
      <View className="fixed bottom-xl left-lg right-lg z-fixed">
        <Button type="primary" block onClick={handleSave} className="!h-button-lg !rounded-xl !text-lg !font-semibold !shadow-colored transition-all duration-normal active:!scale-[0.98]" style={{ background: 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)', border: 'none' }}>
          {isEdit ? '更新' : '保存'}
        </Button>
      </View>
    </View>
  )
}

export default AddTransaction
