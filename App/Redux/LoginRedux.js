import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loginRequest: ['params'],
  loginSuccess: ['data'],
  loginFailure: ['error'],
  logoutRequest: null,
  logoutSuccess: null,
  logoutFailure: ['error'],
  clearData: null
})

export const LoginTypes = Types
export default Creators
// selector
export const loginTokenSelector = state => state.login.data
/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  error: null,
  fetching: false,
  loggingOut: false
})

/* ------------- Reducers ------------- */

export const loginRequest = state => state.merge({ fetching: true, error: null })

export const loginSuccess = (state, { data }) => state.merge({ fetching: false, error: null, data })

export const loginFailure = (state, { error }) => state.merge({ data: null, fetching: false, error })

export const logoutRequest = state => state.merge({ loggingOut: true })

export const logoutSuccess = state => state.merge(INITIAL_STATE)

export const logoutFailure = (state, { error }) => state.merge({ loggingOut: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LOGIN_REQUEST]: loginRequest,
  [Types.LOGIN_SUCCESS]: loginSuccess,
  [Types.LOGIN_FAILURE]: loginFailure,
  [Types.LOGOUT_REQUEST]: logoutRequest,
  [Types.LOGOUT_SUCCESS]: logoutSuccess,
  [Types.LOGOUT_FAILURE]: logoutFailure
})
