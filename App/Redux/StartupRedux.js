
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  startupRequest: ['params'],
  startupSuccess: ['data'],
  startupFailure: ['error'],
  clearData: null
})

export const StartupTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: null,
  objects: {},
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

export const startupRequest = state => state.merge({ fetching: true, error: null })
export const startupSuccess = (state, { data }) => state.merge({ fetching: false, error: null, data })
/*
export const startupSuccess = (state, { data }) => {
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

export const startupFailure = (state, { error }) => state.merge({ fetching: false, error })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.STARTUP_REQUEST]: startupRequest,
  [Types.STARTUP_SUCCESS]: startupSuccess,
  [Types.STARTUP_FAILURE]: startupFailure
})
