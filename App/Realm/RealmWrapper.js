import realm from './schemas/realm'
import _ from 'lodash'
import Utils from '../Utils/Utils'
class RealmWrapper {
  static schema = null
  static realm = realm
  static appendId (params) {
    return params
  }

  static beforeInsert (params) {
    return this.appendId(params)
  }

  static afterInsert (doc) {
    return doc
  }

  static beforeUpdate (params) {
    return params
  }

  static afterUpdate (doc, modifier) {
    return doc
  }

  static appendFind = (doc) => {
    return doc
  }

  static find (conditions = null, option = {}) {
    const className = this
    let objects = []
    if (!conditions) {
      objects = realm.objects(className.schema)
    } else {
      if (typeof (conditions) === 'object') {
        objects = realm.objects(className.schema).filtered(className._buildFilter(conditions), {})
      } else {
        objects = realm.objects(className.schema).filtered(conditions, {})
      }
    }
    // set find option
    if (!_.isEmpty(option)) {
      const { limit, offset = 0, sort } = option
      if (sort) {
        const sortDescriptor = []
        _.each(sort, (reverse, propName) => {
          sortDescriptor.push([propName, reverse])
        })
        objects = objects.sorted(sortDescriptor)
      }

      if (_.isNumber(limit) && _.isNumber(offset)) {
        objects = objects.slice(offset, limit)
      }
    }
    if (objects.length) { objects = objects.map(each => { return className.appendFind(each) }) }
    return objects.length ? objects : []
  }

  static _buildFilter (filter, useOr = false) {
    const criteria = []
    const op = ['or', 'and']
    _.each(filter, (v, k) => {
      if (_.indexOf(op, k) >= 0) {
        criteria.push(this._buildFilter(v, op === 'or'))
      } else {
        if (_.isString(v)) {
          criteria.push(`${k} = "${v}"`)
        } else if (_.isBoolean(v) || _.isNumber(v)) {
          criteria.push(`${k} = ${v}`)
        } else if (_.isArray(v)) {
          const temp = []
          Utils.log('array', v)
          v.forEach(each => {
            if (_.isString(each)) {
              temp.push(`${k} = "${each}"`)
            } else if (_.isBoolean(each) || _.isNumber(each)) {
              temp.push(`${k} = ${each}`)
            }
          })
          criteria.push(`(${temp.join(' OR ')})`)
        } else if (_.isObject(v)) {
          Utils.log('object', v)
          _.each(v, (opVal, op) => {
            if (_.isString(opVal)) {
              criteria.push(`${k} ${op} "${opVal}"`)
            } else if (_.isBoolean(opVal) || _.isNumber(opVal)) {
              criteria.push(`${k} ${op} ${opVal}`)
            }
          })
        }
      }
    })
    return criteria.join(` ${useOr ? 'OR' : 'AND'} `)
  }

  static findOne (conditions = {}) {
    const className = this
    let results = null
    if (_.isEmpty(conditions)) {
      results = className.find(null, { limit: 1 })
    } else {
      results = className.find(className._buildFilter(conditions), { limit: 1 })
    }

    return results.length ? results[0] : null
  }

  static insert (params, inTx = false) {
    try {
      const className = this
      let o = null
      const action = () => {
        params = className.beforeInsert(params)
        o = className.realm.create(className.schema, params, true)
        o = className.afterInsert(o)
      }
      if (inTx) {
        action()
      } else {
        className.realm.write(action)
      }
      return o
    } catch (error) {
      Utils.log('insert error', params, error)
    }
  }

  static bulkInsert (params, inTx = false) {
    try {
      Utils.log('bulkInsert', params.length)
      const className = this
      let result = []
      const childAction = (item) => {
        const o = className.insert(item, true)
        return o
      }
      const action = () => {
        result = params.map(item => childAction(item))
      }

      if (inTx) {
        action()
      } else {
        className.realm.write(action)
      }
      Utils.log('inserted', params.length, result.length, result)
      return result
    } catch (error) {
      Utils.log('bulkInsert error', params, error)
    }
  }

  static update (filter = {}, modifier = {}, inTx = false) {
    const className = this
    if (_.isEmpty(modifier)) return false
    modifier = className.beforeUpdate(modifier)
    if (_.isEmpty(modifier)) return false
    let objects = className.realm.objects(className.schema)
    if (!_.isEmpty(filter)) {
      const filterStr = className._buildFilter(filter)
      if (filterStr) {
        objects = objects.filtered(filterStr)
      }
    }
    const action = () => {
      if (!objects.length) {
        return []
      }
      _.each(objects, o => {
        if (_.isObject(o)) {
          _.each(modifier, (v, k) => {
            o[k] = v
          })
          className.afterUpdate(o, modifier)
        }
      })
      Utils.log('updaterealm', JSON.stringify(objects))
      return objects
    }
    if (inTx) {
      return action()
    } else {
      className.realm.write(action)
      return objects
    }
  }

  static remove (filter = {}, inTx = false) {
    Utils.log(`remove realm ${filter}`)
    var className = this
    let objects = className.realm.objects(className.schema)
    if (!_.isEmpty(filter)) {
      const filterStr = className._buildFilter(filter)
      if (filterStr) {
        objects = objects.filtered(filterStr)
      }
    }
    Utils.log(`remove objects ${objects.length}`)
    const deletingObjects = []
    const action = () => {
      if (objects.length) {
        _.each(objects, o => {
          if (_.isObject(o)) {
            deletingObjects.push(Utils.clone(o))
            className.realm.delete(o)
          }
        })
      }
    }

    if (inTx) {
      action()
    } else {
      className.realm.write(action)
    }
    Utils.log(`ReamlWrapper ${className.name} remove ${deletingObjects.length}`)
    return deletingObjects
  }

  static fromArray (item) {
    const properties = this.schema.schema.properties
    Utils.log('FromArray', properties)
    const _t = {}
    Object.keys(properties).forEach((label, _i) => {
      const property = properties[label]
      switch (property.type) {
        case 'int':
          _t[label] = parseInt(item[_i])
          break
        case 'bool':
          if (item[_i] === 'TRUE') {
            _t[label] = true
          } else
          if (item[_i] === 'FALSE') {
            _t[label] = false
          } else {
            _t[label] = item[_i]
          }
          break
        default:
          _t[label] = item[_i]
      }
    })
    return _t
  }

  static toArray (item) {
    const properties = this.schema.schema.properties
    const result = Object.keys(properties).map((label, _i) => {
      const property = properties[label]
      if (item[label] !== null || item[label] !== undefined) {
        return item[label]
      } else {
        return property.default
      }
    })
    return result
  }
}

export default RealmWrapper
