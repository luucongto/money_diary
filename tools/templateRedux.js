var changeCase = require('change-case')
function apiFunc (name, functionName, successAction = `
  data.forEach(element => {
    state = state.setIn(['objects', element.id], element)
  })
  state = state.setIn(['data'], data)
`) {
  const nameCamel = changeCase.camelCase(name + functionName)
  const nameSnakeUpper = changeCase.snakeCase(name + functionName).toUpperCase()
  const actionsTemp = `
actions.${nameCamel}Request = ['params']
actions.${nameCamel}Success = ['data']`

  const typesTemp = `
types[Types.${nameSnakeUpper}_REQUEST] = ${nameCamel}Request
types[Types.${nameSnakeUpper}_SUCCESS] = ${nameCamel}Success`

  const apiTemp = `
export const ${nameCamel}Request = (state, { params }) => state.merge({ fetching: true, params: params })
export const ${nameCamel}Success = (state, { data }) => {
  state = state.setIn(['fetching'], false)
  state = state.setIn(['error'], null)
${successAction}
  return state
}`

  return { actionsTemp, apiTemp, typesTemp }
}

function func (name) {
  const getFunc = apiFunc(name, '')
  const createFunc = apiFunc(name, 'Create', "  state = state.setIn(['objects', data.id], data)")
  const updateFunc = apiFunc(name, 'Update', "  state = state.setIn(['objects', data.id], data)")
  const deleteFunc = apiFunc(name, 'Delete', "  state = state.setIn(['objects', data.id], null)")
  return `
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */
const actions = {
  ${changeCase.camelCase(name)}Failure: ['error']
}
${getFunc.actionsTemp}
${createFunc.actionsTemp}
${updateFunc.actionsTemp}
${deleteFunc.actionsTemp}
const { Types, Creators } = createActions(actions)

export const ${changeCase.pascalCase(name)}Types = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  params: null,
  data: [],
  objects: {},
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */
${getFunc.apiTemp}
${createFunc.apiTemp}
${updateFunc.apiTemp}
${deleteFunc.apiTemp}

export const ${changeCase.camelCase(name)}Failure = (state, { error }) => state.merge({ fetching: false, error})

/* ------------- Hookup Reducers To Types ------------- */
const types = { [Types.${changeCase.snakeCase(name).toUpperCase()}_FAILURE]: ${changeCase.camelCase(name)}Failure }
${getFunc.typesTemp}
${createFunc.typesTemp}
${updateFunc.typesTemp}
${deleteFunc.typesTemp}
export const reducer = createReducer(INITIAL_STATE, types)
`
}
module.exports = func
