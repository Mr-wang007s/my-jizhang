import { Dispatch } from 'redux'
import { ICategory } from '../constants/commonType'
import {
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  SET_CATEGORIES,
} from '../constants/category'
import storageService from '../services/storage'

export const loadCategories = () => {
  return (dispatch: Dispatch) => {
    try {
      const categories = storageService.getCategories()
      dispatch({
        type: SET_CATEGORIES,
        payload: categories,
      })
      return Promise.resolve()
    } catch (error) {
      console.error('Load categories failed:', error)
      return Promise.reject(error)
    }
  }
}

export const addCategory = (category: ICategory) => {
  return (dispatch: Dispatch) => {
    try {
      storageService.saveCategory(category)
      dispatch({
        type: ADD_CATEGORY,
        payload: category,
      })
      return Promise.resolve()
    } catch (error) {
      console.error('Add category failed:', error)
      return Promise.reject(error)
    }
  }
}

export const updateCategory = (category: ICategory) => {
  return (dispatch: Dispatch) => {
    try {
      storageService.saveCategory(category)
      dispatch({
        type: UPDATE_CATEGORY,
        payload: category,
      })
      return Promise.resolve()
    } catch (error) {
      console.error('Update category failed:', error)
      return Promise.reject(error)
    }
  }
}

export const deleteCategory = (id: string) => {
  return (dispatch: Dispatch) => {
    try {
      storageService.deleteCategory(id)
      dispatch({
        type: DELETE_CATEGORY,
        payload: id,
      })
      return Promise.resolve()
    } catch (error) {
      console.error('Delete category failed:', error)
      return Promise.reject(error)
    }
  }
}
