import { ICategory } from '../constants/commonType'
import {
  ADD_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  SET_CATEGORIES,
} from '../constants/category'

interface CategoryState {
  list: ICategory[]
}

const INITIAL_STATE: CategoryState = {
  list: [],
}

export default function category(state = INITIAL_STATE, action: any): CategoryState {
  switch (action.type) {
    case ADD_CATEGORY:
      return {
        ...state,
        list: [...state.list, action.payload],
      }

    case UPDATE_CATEGORY:
      return {
        ...state,
        list: state.list.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      }

    case DELETE_CATEGORY:
      return {
        ...state,
        list: state.list.filter(item => item.id !== action.payload),
      }

    case SET_CATEGORIES:
      return {
        ...state,
        list: action.payload,
      }

    default:
      return state
  }
}
