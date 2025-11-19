import { View, Text } from '@tarojs/components'
import { FC, memo } from 'react'
import { Swipe, Button } from '@nutui/nutui-react-taro'
import { ITransaction } from '../../constants/commonType'
import { TransactionType } from '../../constants/transaction'
import { formatCurrency } from '../../utils/calculation'
import { formatTime } from '../../utils/date'

interface Props {
  transaction: ITransaction
  onClick?: (transaction: ITransaction) => void
  onDelete?: (id: string) => void
}

const TransactionItem: FC<Props> = ({ transaction, onClick, onDelete }) => {
  const handleClick = () => {
    onClick && onClick(transaction)
  }

  const handleDelete = (e: any) => {
    e.stopPropagation()
    onDelete && onDelete(transaction.id)
  }

  const isExpense = transaction.type === TransactionType.EXPENSE

  const renderRight = () => (
    <Button
      type="danger"
      shape="square"
      style={{ height: '100%', borderRadius: 0 }}
      onClick={handleDelete}
    >
      删除
    </Button>
  )

  return (
    <Swipe rightAction={renderRight()}>
      <View
        className="glass-card rounded-2xl p-4 mb-3 active:scale-98 transition-all flex items-center gap-4"
        onClick={handleClick}
      >
        {/* Icon Badge */}
        <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
          <Text className="text-3xl">{transaction.categoryIcon}</Text>
        </View>

        {/* Info */}
        <View className="flex-1 flex flex-col gap-1">
          <Text className="text-lg font-semibold text-gray-900">{transaction.categoryName}</Text>
          {transaction.note && (
            <Text className="text-sm text-gray-500 mt-1">{transaction.note}</Text>
          )}
          <Text className="text-xs text-gray-400 mt-1">{formatTime(transaction.date)}</Text>
        </View>

        {/* Amount */}
        <View className="text-right">
          <Text className={`text-2xl font-bold ${isExpense ? 'text-expense' : 'text-income'}`}>
            {isExpense ? '-' : '+'}{formatCurrency(transaction.amount, false)}
          </Text>
        </View>
      </View>
    </Swipe>
  )
}

export default memo(TransactionItem, (prevProps, nextProps) => {
  return prevProps.transaction.id === nextProps.transaction.id &&
         prevProps.transaction.amount === nextProps.transaction.amount &&
         prevProps.transaction.note === nextProps.transaction.note
})
