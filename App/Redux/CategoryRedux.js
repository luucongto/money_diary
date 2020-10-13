
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import Utils from '../Utils/Utils'

/* ------------- Types and Action Creators ------------- */
const actions = {
  categoryFailure: ['error']
}

actions.categoryRequest = ['params']
actions.categorySuccess = ['data']

actions.categoryCreateRequest = ['params']
actions.categoryCreateSuccess = ['data']

actions.categoryUpdateRequest = ['params']
actions.categoryUpdateSuccess = ['data']

actions.categoryDeleteRequest = ['params']
actions.categoryDeleteSuccess = ['data']
const { Types, Creators } = createActions(actions)

export const CategoryTypes = Types
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

export const categoryRequest = (state, { params }) => state.merge({ fetching: true, params: params })
export const categorySuccess = (state, { data }) => {
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

export const categoryCreateRequest = (state, { params }) => state.merge({ fetching: true, params: params })
export const categoryCreateSuccess = (state, { data }) => {
  state = state.setIn(['fetching'], false)
  state = state.setIn(['error'], null)
  state = state.setIn(['objects', data.id], data)
  return state
}

export const categoryUpdateRequest = (state, { params }) => state.merge({ fetching: true, params: params })
export const categoryUpdateSuccess = (state, { data }) => {
  state = state.setIn(['fetching'], false)
  state = state.setIn(['error'], null)
  state = state.setIn(['objects', data.id], data)
  return state
}

export const categoryDeleteRequest = (state, { params }) => state.merge({ fetching: true, params: params })
export const categoryDeleteSuccess = (state, { data }) => {
  state = state.setIn(['fetching'], false)
  state = state.setIn(['error'], null)
  state = state.setIn(['objects', data.id], null)
  return state
}

export const categoryFailure = (state, { error }) => state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */
const types = { [Types.CATEGORY_FAILURE]: categoryFailure }

types[Types.CATEGORY_REQUEST] = categoryRequest
types[Types.CATEGORY_SUCCESS] = categorySuccess

types[Types.CATEGORY_CREATE_REQUEST] = categoryCreateRequest
types[Types.CATEGORY_CREATE_SUCCESS] = categoryCreateSuccess

types[Types.CATEGORY_UPDATE_REQUEST] = categoryUpdateRequest
types[Types.CATEGORY_UPDATE_SUCCESS] = categoryUpdateSuccess

types[Types.CATEGORY_DELETE_REQUEST] = categoryDeleteRequest
types[Types.CATEGORY_DELETE_SUCCESS] = categoryDeleteSuccess
export const reducer = createReducer(INITIAL_STATE, types)
