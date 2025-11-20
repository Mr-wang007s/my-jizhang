/**
 * Transaction entity interface
 */

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: number
  amount: number
  type: TransactionType
  date: string // ISO 8601 format
  category_id: number
  note?: string
  created_at: string
  updated_at: string
}

export interface CreateTransactionInput {
  amount: number
  type: TransactionType
  date: string
  category_id: number
  note?: string
}

export interface UpdateTransactionInput {
  amount?: number
  type?: TransactionType
  date?: string
  category_id?: number
  note?: string
}

/**
 * Validate transaction input
 */
export function validateTransaction(input: CreateTransactionInput): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  // Amount validation
  if (input.amount === undefined || input.amount === null) {
    errors.amount = '金额不能为空'
  } else if (input.amount < 0) {
    errors.amount = '金额不能为负数'
  } else if (input.amount === 0) {
    errors.amount = '金额必须大于0'
  }

  // Type validation
  if (!input.type) {
    errors.type = '类型不能为空'
  } else if (input.type !== 'income' && input.type !== 'expense') {
    errors.type = '类型必须是收入或支出'
  }

  // Date validation
  if (!input.date) {
    errors.date = '日期不能为空'
  } else {
    const date = new Date(input.date)
    if (isNaN(date.getTime())) {
      errors.date = '日期格式无效'
    }
  }

  // Category validation
  if (!input.category_id) {
    errors.category_id = '分类不能为空'
  } else if (input.category_id <= 0) {
    errors.category_id = '分类ID无效'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}
