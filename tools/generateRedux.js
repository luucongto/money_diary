var fs = require('fs')
var changeCase = require('change-case')
const name = process.argv[2].trim()
const temp = `
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  ${changeCase.camelCase(name)}Request: ['params'],
  ${changeCase.camelCase(name)}Success: ['data'],
  ${changeCase.camelCase(name)}Update: ['params'],
  ${changeCase.camelCase(name)}UpdateSuccess: ['data'],
  ${changeCase.camelCase(name)}Failure: ['error'],
  clearData: null
})

export const ${changeCase.pascalCase(name)}Types = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: [],
  objects: {},
  error: null,
  fetching: false
})

/* ------------- Reducers ------------- */

export const ${changeCase.camelCase(name)}Request = state => state.merge({ fetching: true, error: null })
export const ${changeCase.camelCase(name)}Success = (state, { data }) => {
  data.forEach(element => {
      state = state.setIn(['objects', element.id], element)
  })
  state = state.setIn(['fetching'], false)
  state = state.setIn(['data'], data)
  return state
}
export const ${changeCase.camelCase(name)}Update = state => state.merge({ fetching: true, error: null })
export const ${changeCase.camelCase(name)}UpdateSuccess = (state, { data }) => {
  data.forEach(element => {
      state = state.setIn(['objects', element.id], element)
  })
  state = state.setIn(['fetching'], false)
  return state
}

export const ${changeCase.camelCase(name)}Failure = (state, { error }) => state.merge({ fetching: false, error})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.${changeCase.snakeCase(name).toUpperCase()}_REQUEST]: ${changeCase.camelCase(name)}Request,
  [Types.${changeCase.snakeCase(name).toUpperCase()}_SUCCESS]: ${changeCase.camelCase(name)}Success,
  [Types.${changeCase.snakeCase(name).toUpperCase()}_UPDATE]: ${changeCase.camelCase(name)}Update,
  [Types.${changeCase.snakeCase(name).toUpperCase()}_UPDATE_SUCCESS]: ${changeCase.camelCase(name)}UpdateSuccess,
  [Types.${changeCase.snakeCase(name).toUpperCase()}_FAILURE]: ${changeCase.camelCase(name)}Failure
})
`

const tempSaga =
`import { call, put } from 'redux-saga/effects'
import ${changeCase.pascalCase(name)}Actions from '../Redux/${changeCase.pascalCase(name)}Redux'
import LoginActions from '../Redux/LoginRedux'
export function * ${changeCase.camelCase(name)} (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}Failure(res.message))
    } else {
      yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}Success(res.data))
    }
  } catch (error) {
    yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}Failure(error.message))
  }
}

export function * ${changeCase.camelCase(name)}Update (api, {params}) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}Failure(res.message))
    } else {
      yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}UpdateSuccess(res.data))
    }
  } catch (error) {
    yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}Failure(error.message))
  }
}
`

// insert into index.saga
const readline = require('readline')
const appendSagas = () => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream('./App/Sagas/index.js'),
      crlfDelay: Infinity
    })
    const TypesLine = '/* ------------- Types ------------- */'
    const SagasLine = '/* ------------- Sagas ------------- */'
    const connect = '// tool generated sagas'
    const newFileStrs = []
    let inserted = false
    rl.on('line', (line) => {
      if (line === TypesLine) {
        inserted = true
        newFileStrs.push(line)
        newFileStrs.push(`import { ${changeCase.pascalCase(name)}Types } from '../Redux/${changeCase.pascalCase(name)}Redux'`)
      } else if (line === SagasLine) {
        newFileStrs.push(line)
        inserted = true
        newFileStrs.push(`import { ${changeCase.camelCase(name)}, ${changeCase.camelCase(name)}Update  } from './${changeCase.pascalCase(name)}Saga'`)
      } else if (line.trim() === connect) {
        newFileStrs.push(line)
        inserted = true
        newFileStrs.push(`    takeLatest(${changeCase.pascalCase(name)}Types.${changeCase.snakeCase(name).toUpperCase()}_REQUEST, ${changeCase.camelCase(name)}, api.${changeCase.camelCase(name)}),`)
        newFileStrs.push(`    takeLatest(${changeCase.pascalCase(name)}Types.${changeCase.snakeCase(name).toUpperCase()}_UPDATE, ${changeCase.camelCase(name)}Update, api.${changeCase.camelCase(name)}Update),`)
      } else {
        newFileStrs.push(line)
      }
    })
    rl.on('close', function () {
      resolve({
        success: inserted,
        newFileStrs
      })
    })
  })
}

const appendReducers = () => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream('./App/Redux/index.js'),
      crlfDelay: Infinity
    })
    const reducerLine = 'export const reducers = combineReducers({'
    const newFileStrs = []
    let inserted = false
    rl.on('line', (line) => {
      if (line.trim() === reducerLine) {
        newFileStrs.push(line)
        inserted = true
        newFileStrs.push(`  ${changeCase.camelCase(name)}: require('./${changeCase.pascalCase(name)}Redux').reducer,`)
      } else {
        newFileStrs.push(line)
      }
    })
    rl.on('close', function () {
      resolve({
        success: inserted,
        newFileStrs
      })
    })
  })
}

try {
  appendReducers().then(reducers => {
    if (reducers.success) {
      fs.writeFileSync('./App/Redux/index.js', reducers.newFileStrs.join('\n') + '\n')
    }
  })
  appendSagas().then(sagas => {
    if (sagas.success) {
      fs.writeFileSync('./App/Sagas/index.js', sagas.newFileStrs.join('\n') + '\n')
    }
  })
  fs.writeFileSync(`./App/Redux/${changeCase.pascalCase(name)}Redux.js`, temp)
  fs.writeFileSync(`./App/Sagas/${changeCase.pascalCase(name)}Saga.js`, tempSaga)
  console.log('DONE:', `./App/Redux/${changeCase.pascalCase(name)}Redux.js`, `./App/Sagas/${changeCase.pascalCase(name)}Sagas.js`)
} catch (e) {
  console.log(e)
}
