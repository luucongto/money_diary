
import { createActions, createReducer } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import Utils from '../Utils/Utils'
/* ------------- Types and Action Creators ------------- */
const actions = {
  transactionFailure: ['error']
}

actions.transactionRequest = ['params']
actions.transactionSuccess = ['data']

actions.transactionCreateRequest = ['params']
actions.transactionCreateSuccess = ['data']

actions.transactionUpdateRequest = ['params']
actions.transactionUpdateSuccess = ['data']

actions.transactionDeleteRequest = ['params']
actions.transactionDeleteSuccess = ['data']
const { Types, Creators } = createActions(actions)

export const TransactionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  params: null,
  data: [],
  updateObjects: {},
  deleteObjects: {},
  objects: {},
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

export const transactionRequest = (state, { params }) => state.merge({ fetching: true, params: params })
export const transactionSuccess = (state, { data }) => {
  state = state.setIn(['fetching'], false)
  state = state.setIn(['error'], null)

  if (Array.isArray(data)) {
    data.forEach(element => {
      state = state.setIn(['objects', element.id], element)
    })
  } else if (data && data.id) {
    state = state.setIn(['objects', data.id], data)
  }
  state = state.setIn(['data'], data)

  return state
}

export const transactionCreateRequest = (state, { params }) => state.merge({ fetching: true, params: params })
export const transactionCreateSuccess = (state, { data }) => {
  state = state.setIn(['fetching'], false)
  state = state.setIn(['error'], null)
  if (Array.isArray(data)) {
    data.forEach(element => {
      state = state.setIn(['objects', element.id], element)
    })
  } else if (data && data.id) {
    state = state.setIn(['objects', data.id], data)
  }
  return state
}

export const transactionUpdateRequest = (state, { params }) => state.merge({ fetching: true, params: params, updateObjects: {} })
export const transactionUpdateSuccess = (state, { data }) => {
  state = state.setIn(['fetching'], false)
  state = state.setIn(['error'], null)
  Utils.log('update', JSON.stringify(data), Array.isArray(data))
  if (Array.isArray(data)) {
    data.forEach(element => {
      state = state.setIn(['objects', element.id], element)
      state = state.setIn(['updateObjects', element.id], element)
    })
  } else if (data && data.id) {
    state = state.setIn(['objects', data.id], data)
    state = state.setIn(['updateObjects', data.id], data)
  }

  return state
}

export const transactionDeleteRequest = (state, { params }) => state.merge({ fetching: true, params: params, deleteObjects: {} })
export const transactionDeleteSuccess = (state, { data }) => {
  state = state.setIn(['fetching'], false)
  state = state.setIn(['error'], null)
  Utils.log('transactionDeleteSuccess', JSON.stringify(data), Array.isArray(data))
  if (Array.isArray(data)) {
    data.forEach(element => {
      state = state.setIn(['objects', element.id], element)
      state = state.setIn(['deleteObjects', element.id], element)
    })
  } else if (data && data.id) {
    state = state.setIn(['objects', data.id], data)
    state = state.setIn(['deleteObjects', data.id], data)
  }
  return state
}

export const transactionFailure = (state, { error }) => state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */
const types = { [Types.TRANSACTION_FAILURE]: transactionFailure }

types[Types.TRANSACTION_REQUEST] = transactionRequest
types[Types.TRANSACTION_SUCCESS] = transactionSuccess

types[Types.TRANSACTION_CREATE_REQUEST] = transactionCreateRequest
types[Types.TRANSACTION_CREATE_SUCCESS] = transactionCreateSuccess

types[Types.TRANSACTION_UPDATE_REQUEST] = transactionUpdateRequest
types[Types.TRANSACTION_UPDATE_SUCCESS] = transactionUpdateSuccess

types[Types.TRANSACTION_DELETE_REQUEST] = transactionDeleteRequest
types[Types.TRANSACTION_DELETE_SUCCESS] = transactionDeleteSuccess
export const reducer = createReducer(INITIAL_STATE, types)
