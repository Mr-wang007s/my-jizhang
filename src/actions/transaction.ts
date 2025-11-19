import { Dispatch } from 'redux'
import { ITransaction } from '../constants/commonType'
import {
  ADD_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
  SET_TRANSACTIONS,
  SET_FILTER,
} from '../constants/transaction'
import storageService from '../services/storage'

export const addTransaction = (transaction: ITransaction) => {
  return (dispatch: Dispatch) => {
    try {
      storageService.saveTransaction(transaction)
      dispatch({
        type: ADD_TRANSACTION,
        payload: transaction,
      })
      return Promise.resolve()
    } catch (error) {
      console.error('Add transaction failed:', error)
      return Promise.reject(error)
    }
  }
}

export const updateTransaction = (transaction: ITransaction) => {
  return (dispatch: Dispatch) => {
    try {
      storageService.saveTransaction(transaction)
      dispatch({
        type: UPDATE_TRANSACTION,
        payload: transaction,
      })
      return Promise.resolve()
    } catch (error) {
      console.error('Update transaction failed:', error)
      return Promise.reject(error)
    }
  }
}

export const deleteTransaction = (id: string) => {
  return (dispatch: Dispatch) => {
    try {
      storageService.deleteTransaction(id)
      dispatch({
        type: DELETE_TRANSACTION,
        payload: id,
      })
      return Promise.resolve()
    } catch (error) {
      console.error('Delete transaction failed:', error)
      return Promise.reject(error)
    }
  }
}

export const loadTransactions = () => {
  return (dispatch: Dispatch) => {
    try {
      const transactions = storageService.getTransactions()
      dispatch({
        type: SET_TRANSACTIONS,
        payload: transactions,
      })
      return Promise.resolve()
    } catch (error) {
      console.error('Load transactions failed:', error)
      return Promise.reject(error)
    }
  }
}

export const setFilter = (filter: any) => {
  return {
    type: SET_FILTER,
    payload: filter,
  }
}
