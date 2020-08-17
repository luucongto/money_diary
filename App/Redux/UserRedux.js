
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userRequest: ['params'],
  userSuccess: ['data'],
  userFailure: ['error'],
  clearData: null
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  objects: {},
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

export const userRequest = state => state.merge({ fetching: true, error: null })
export const userSuccess = (state, { data }) => state.merge({ fetching: false, error: null, data })
/*
export const userSuccess = (state, { data }) => {
  data.data.forEach(element => {
    if (element.option && element.option === 'delete') {
      let newData = Object.assign({}, state.objects)
      delete newData[element.id]
      state = state.setIn(['objects'], newData)
    } else {
      state = state.setIn(['objects', element.id], element)
    }
  })
  state = state.setIn(['fetching'], false)
  state = state.setIn(['data'], data)
  return state
}
*/

export const userFailure = (state, { error }) => state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_REQUEST]: userRequest,
  [Types.USER_SUCCESS]: userSuccess,
  [Types.USER_FAILURE]: userFailure
})
