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
        className="border-b-4 border-brutal-black p-4 active-brutal bg-brutal-white flex items-center gap-4"
        onClick={handleClick}
      >
        {/* Icon */}
        <View className="w-16 h-16 border-brutal-sm bg-neon-yellow flex items-center justify-center flex-shrink-0">
          <Text className="text-3xl">{transaction.categoryIcon}</Text>
        </View>

        {/* Info */}
        <View className="flex-1 flex flex-col gap-1">
          <Text className="font-mono-brutal text-base">{transaction.categoryName}</Text>
          {transaction.note && (
            <Text className="font-mono text-xs text-brutal-gray">{transaction.note}</Text>
          )}
        </View>

        {/* Amount */}
        <View className="flex flex-col items-end gap-1">
          <Text className={`text-2xl font-mono-brutal ${isExpense ? 'text-expense' : 'text-income'}`}>
            {isExpense ? '-' : '+'}{formatCurrency(transaction.amount, false)}
          </Text>
          <Text className="font-mono text-xs text-brutal-gray">{formatTime(transaction.date)}</Text>
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
