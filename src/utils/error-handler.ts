/**
 * Error handling utilities
 */

import Taro from '@tarojs/taro'

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string, details?: any) {
    super(message, 'VALIDATION_ERROR', details)
    this.name = 'ValidationError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'DATABASE_ERROR', details)
    this.name = 'DatabaseError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: number | string) {
    super(
      id ? `${resource} with id ${id} not found` : `${resource} not found`,
      'NOT_FOUND',
      { resource, id }
    )
    this.name = 'NotFoundError'
  }
}

/**
 * Handle error and show user-friendly message
 */
export function handleError(error: any, context?: string): void {
  console.error(`[Error${context ? ` ${context}` : ''}]:`, error)

  let message = '操作失败，请重试'

  if (error instanceof ValidationError) {
    message = error.message
  } else if (error instanceof NotFoundError) {
    message = '数据不存在'
  } else if (error instanceof DatabaseError) {
    message = '数据库操作失败'
  } else if (error instanceof AppError) {
    message = error.message
  } else if (error instanceof Error) {
    message = error.message
  }

  Taro.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

/**
 * Show success message
 */
export function showSuccess(message: string): void {
  Taro.showToast({
    title: message,
    icon: 'success',
    duration: 1500
  })
}

/**
 * Show error message
 */
export function showError(message: string): void {
  Taro.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

/**
 * Show loading indicator
 */
export function showLoading(message: string = '加载中...'): void {
  Taro.showLoading({
    title: message,
    mask: true
  })
}

/**
 * Hide loading indicator
 */
export function hideLoading(): void {
  Taro.hideLoading()
}

/**
 * Confirm dialog
 */
export async function confirm(
  title: string,
  content?: string
): Promise<boolean> {
  try {
    const result = await Taro.showModal({
      title,
      content: content || '',
      showCancel: true,
      confirmText: '确定',
      cancelText: '取消'
    })
    return result.confirm
  } catch (error) {
    return false
  }
}
