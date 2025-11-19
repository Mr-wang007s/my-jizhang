import { ITransaction } from '../constants/commonType'
import { TransactionType } from '../constants/transaction'

export const calculateTotal = (transactions: ITransaction[], type: TransactionType): number => {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0)
}

export const calculateBalance = (transactions: ITransaction[]): number => {
  const income = calculateTotal(transactions, TransactionType.INCOME)
  const expense = calculateTotal(transactions, TransactionType.EXPENSE)
  return income - expense
}

export const formatAmount = (amount: number, showSign: boolean = false): string => {
  const formatted = amount.toFixed(2)
  if (showSign && amount > 0) {
    return `+${formatted}`
  }
  return formatted
}

export const formatCurrency = (amount: number, showSign: boolean = false): string => {
  return `¥${formatAmount(amount, showSign)}`
}
