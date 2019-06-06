import { combineReducers } from 'redux'
import GarbageReducer from './GarbageReducer'
import StatReducer from './StatReducer'

export default combineReducers({
  garbages: GarbageReducer,
  stats: StatReducer,
})
