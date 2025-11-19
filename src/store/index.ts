import { legacy_createStore as createStore, applyMiddleware, compose } from 'redux'
import { thunk } from 'redux-thunk'
import rootReducer from '../reducers'

const composeEnhancers =
  typeof window === 'object' &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose

const middlewares = [thunk]

const enhancer = composeEnhancers(applyMiddleware(...middlewares))

export default function configStore() {
  const store = createStore(rootReducer, enhancer)
  return store
}
