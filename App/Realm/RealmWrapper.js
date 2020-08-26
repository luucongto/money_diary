import realm from './schemas/realm'
import _ from 'lodash'
import Utils from '../Utils/Utils'
class RealmWrapper {
  static schema = null
  static realm = realm
  static beforeInsert (params) {
    return params
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
      objects = realm.objects(className.schema.name)
    } else {
      if (typeof (conditions) === 'object') {
        objects = realm.objects(className.schema.name).filtered(className._buildFilter(conditions), {})
      } else {
        objects = realm.objects(className.schema.name).filtered(conditions, {})
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

  static _buildFilter (filter) {
    const criteria = []
    const op = ['$or', '$and']
    _.each(filter, (v, k) => {
      if (_.indexOf(op, k) >= 0) {
        // not yet implement logical operator $or, $and
      } else {
        if (_.isString(v)) {
          criteria.push(`${k} = "${v}"`)
        } else if (_.isBoolean(v) || _.isNumber(v)) {
          criteria.push(`${k} = ${v}`)
        } else if (_.isObject(v)) {
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
    return criteria.join(' AND ')
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
    const className = this
    const action = () => {
      params = className.beforeInsert(params)
      const o = className.realm.create(className.schema.name, params)
      return className.afterInsert(o)
    }
    if (inTx) {
      return action()
    } else {
      className.realm.write(action)
    }
  }

  static bulkInsert (items, inTx = false) {
    const className = this
    const action = () => {
      items.forEach(item => {
        className.insert(item, true)
      })
    }
    if (inTx) {
      return action()
    } else {
      className.realm.write(action)
    }
  }

  static update (filter = {}, modifier = {}, inTx = false) {
    const className = this
    if (_.isEmpty(modifier)) return false
    modifier = className.beforeUpdate(modifier)
    if (_.isEmpty(modifier)) return false
    let objects = className.realm.objects(className.schema.name)
    if (!_.isEmpty(filter)) {
      const filterStr = className._buildFilter(filter)
      if (filterStr) {
        objects = objects.filtered(filterStr)
      }
    }
    const action = () => {
      if (!objects.length) {
        return 0
      }
      _.each(objects, o => {
        if (_.isObject(o)) {
          _.each(modifier, (v, k) => {
            o[k] = v
          })
          className.afterUpdate(o, modifier)
        }
      })
      return objects.length
    }
    if (inTx) {
      return action()
    } else {
      className.realm.write(action)
      return objects.length
    }
  }

  static remove (filter = {}, inTx = false) {
    var className = this

    let objects = className.realm.objects(className.schema.name)
    if (!_.isEmpty(filter)) {
      const filterStr = className._buildFilter(filter)
      if (filterStr) {
        objects = objects.filtered(filterStr)
      }
    } else {
      return 0
    }
    const action = () => {
      if (objects.length) {
        _.each(objects, o => {
          if (_.isObject(o)) {
            className.realm.delete(o)
          }
        })
      }
      return objects.length
    }

    if (inTx) {
      return action()
    } else {
      className.realm.write(action)
      return objects.length
    }
  }
}

export default RealmWrapper
