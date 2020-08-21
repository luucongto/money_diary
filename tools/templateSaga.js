var changeCase = require('change-case')

const apiFunc = (name, functionName) => {
  const temp = `
export function * ${changeCase.camelCase(name)}${functionName} (api, { params }) {
  try {
    const res = yield call(api, params)
    if (res && res.message === 'Unauthenticated.') {
      yield put(LoginActions.loginFailure())
      return
    }
    if (res.error) {
      yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}Failure(res.message))
    } else {
      yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}${functionName}Success(res.data))
    }
  } catch (error) {
    yield put(${changeCase.pascalCase(name)}Actions.${changeCase.camelCase(name)}Failure(error.message))
  }
}`
  return temp
}
const func = (name) => {
  return `import { call, put } from 'redux-saga/effects'
import ${changeCase.pascalCase(name)}Actions from '../Redux/${changeCase.pascalCase(name)}Redux'
import LoginActions from '../Redux/LoginRedux'
${apiFunc(name, '')}
${apiFunc(name, 'Update')}
${apiFunc(name, 'Create')}
${apiFunc(name, 'Delete')}
`
}
module.exports = func
