
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import Utils from '../Utils/Utils'

/* ------------- Types and Action Creators ------------- */
const actions = {
  walletFailure: ['error']
}

actions.walletRequest = ['params']
actions.walletSuccess = ['data']

actions.walletCreateRequest = ['params']
actions.walletCreateSuccess = ['data']

actions.walletUpdateRequest = ['params']
actions.walletUpdateSuccess = ['data']

actions.walletDeleteRequest = ['params']
actions.walletDeleteSuccess = ['data']
const { Types, Creators } = createActions(actions)

export const WalletTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  params: null,
  data: [],
  objects: {},
  updateObjects: {},
  deleteObjects: {},
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

export const walletRequest = (state, { params }) => state.merge({ fetching: true, params: params })
export const walletSuccess = (state, { data }) => {
  data = Utils.clone(data)
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

export const walletCreateRequest = (state, { params }) => state.merge({ fetching: true, params: params })
export const walletCreateSuccess = (state, { data }) => {
  state = state.setIn(['fetching'], false)
  state = state.setIn(['error'], null)
  state = state.setIn(['objects', data.id], data)
  return state
}

export const walletUpdateRequest = (state, { params }) => state.merge({ fetching: true, params: params })
export const walletUpdateSuccess = (state, { data }) => {
  state = state.setIn(['fetching'], false)
  state = state.setIn(['error'], null)
  state = state.setIn(['objects', data.id], data)
  return state
}

export const walletDeleteRequest = (state, { params }) => state.merge({ fetching: true, params: params })
export const walletDeleteSuccess = (state, { data }) => {
  state = state.setIn(['fetching'], false)
  state = state.setIn(['error'], null)
  state = state.setIn(['objects', data.id], null)
  return state
}

export const walletFailure = (state, { error }) => state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */
const types = { [Types.WALLET_FAILURE]: walletFailure }

types[Types.WALLET_REQUEST] = walletRequest
types[Types.WALLET_SUCCESS] = walletSuccess

types[Types.WALLET_CREATE_REQUEST] = walletCreateRequest
types[Types.WALLET_CREATE_SUCCESS] = walletCreateSuccess

types[Types.WALLET_UPDATE_REQUEST] = walletUpdateRequest
types[Types.WALLET_UPDATE_SUCCESS] = walletUpdateSuccess

types[Types.WALLET_DELETE_REQUEST] = walletDeleteRequest
types[Types.WALLET_DELETE_SUCCESS] = walletDeleteSuccess
export const reducer = createReducer(INITIAL_STATE, types)
