import { ITransaction, IFilter } from '../constants/commonType'
import {
  ADD_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
  SET_TRANSACTIONS,
  SET_FILTER,
} from '../constants/transaction'

interface TransactionState {
  list: ITransaction[]
  filter: IFilter
}

const INITIAL_STATE: TransactionState = {
  list: [],
  filter: {
    type: 'all',
    categoryId: '',
    startDate: '',
    endDate: '',
    searchText: '',
  },
}

export default function transaction(state = INITIAL_STATE, action: any): TransactionState {
  switch (action.type) {
    case ADD_TRANSACTION:
      return {
        ...state,
        list: [...state.list, action.payload],
      }

    case UPDATE_TRANSACTION:
      return {
        ...state,
        list: state.list.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      }

    case DELETE_TRANSACTION:
      return {
        ...state,
        list: state.list.filter(item => item.id !== action.payload),
      }

    case SET_TRANSACTIONS:
      return {
        ...state,
        list: action.payload,
      }

    case SET_FILTER:
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      }

    default:
      return state
  }
}
