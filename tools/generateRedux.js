var fs = require('fs')
var changeCase = require('change-case')
const name = process.argv[2].trim().replace('Redux', '')
const templateRedux = require('./templateRedux')
const templateSaga = require('./templateSaga')

const temp = templateRedux(name)
const tempSaga = templateSaga(name)

const namePascal = changeCase.pascalCase(name)
const nameCamel = changeCase.camelCase(name)
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
        newFileStrs.push(`import { ${namePascal}Types } from '../Redux/${namePascal}Redux'`)
      } else if (line === SagasLine) {
        newFileStrs.push(line)
        inserted = true
        newFileStrs.push(`import { ${nameCamel}, ${nameCamel}Update, ${nameCamel}Create, ${nameCamel}Delete  } from './${namePascal}Saga'`)
      } else if (line.trim() === connect) {
        newFileStrs.push(line)
        inserted = true
        newFileStrs.push(`    // takeLatest(${namePascal}Types.${changeCase.snakeCase(name).toUpperCase()}_REQUEST, ${nameCamel}, api.${nameCamel}),`)
        newFileStrs.push(`    // takeLatest(${namePascal}Types.${changeCase.snakeCase(name).toUpperCase()}_UPDATE, ${nameCamel}Update, api.${nameCamel}Update),`)
        newFileStrs.push(`    // takeLatest(${namePascal}Types.${changeCase.snakeCase(name).toUpperCase()}_CREATE, ${nameCamel}Create, api.${nameCamel}Create),`)
        newFileStrs.push(`    // takeLatest(${namePascal}Types.${changeCase.snakeCase(name).toUpperCase()}_DELETE, ${nameCamel}Delete, api.${nameCamel}Delete),`)
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
        newFileStrs.push(`  ${nameCamel}: require('./${namePascal}Redux').reducer,`)
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
  fs.writeFileSync(`./App/Redux/${namePascal}Redux.js`, temp)
  fs.writeFileSync(`./App/Sagas/${namePascal}Saga.js`, tempSaga)
  console.log('DONE:', `./App/Redux/${namePascal}Redux.js`, `./App/Sagas/${namePascal}Sagas.js`)
} catch (e) {
  console.log(e)
}
