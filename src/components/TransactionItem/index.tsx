import { View, Text } from '@tarojs/components'
import { FC, memo } from 'react'
import { ITransaction } from '../../constants/commonType'
import { TransactionType } from '../../constants/transaction'
import { formatCurrency } from '../../utils/calculation'
import { formatTime } from '../../utils/date'
import classnames from 'classnames'
import './index.scss'

interface Props {
  transaction: ITransaction
  onClick?: (transaction: ITransaction) => void
  onDelete?: (id: string) => void
}

const TransactionItem: FC<Props> = ({ transaction, onClick }) => {
  const handleClick = () => {
    onClick && onClick(transaction)
  }

  const isExpense = transaction.type === TransactionType.EXPENSE
  const amountClass = classnames('transaction-amount', {
    'transaction-amount-expense': isExpense,
    'transaction-amount-income': !isExpense,
  })

  return (
    <View className="transaction-item" onClick={handleClick}>
      <View className="transaction-left">
        <View className="transaction-icon">{transaction.categoryIcon}</View>
        <View className="transaction-info">
          <Text className="transaction-category">{transaction.categoryName}</Text>
          {transaction.note && (
            <Text className="transaction-note">{transaction.note}</Text>
          )}
        </View>
      </View>
      <View className="transaction-right">
        <Text className={amountClass}>
          {isExpense ? '-' : '+'}{formatCurrency(transaction.amount, false)}
        </Text>
        <Text className="transaction-time">{formatTime(transaction.date)}</Text>
      </View>
    </View>
  )
}

export default memo(TransactionItem, (prevProps, nextProps) => {
  return prevProps.transaction.id === nextProps.transaction.id &&
         prevProps.transaction.amount === nextProps.transaction.amount &&
         prevProps.transaction.note === nextProps.transaction.note
})
