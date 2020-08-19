import realm from './schemas/realm'
import _ from 'lodash'

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

  static afterUpdate (doc) {
    return doc
  }

  static appendFind = (doc) => {
    return doc
  }

  static find (conditions = null, option = {}) {
    let objects = []
    if (!conditions) {
      objects = realm.objects(this.schema.name)
    } else {
      objects = realm.objects(this.schema.name).filtered(conditions, {})
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
    if (objects.length) { objects = objects.map(each => { return this.appendFind(each) }) }
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
    let results = null
    if (_.isEmpty(conditions)) {
      results = this.find(null, { limit: 1 })
    } else {
      results = this.find(this._buildFilter(conditions), { limit: 1 })
    }

    return results.length ? results[0] : null
  }

  static insert (params) {
    var className = this
    className.realm.write(() => {
      params = this.beforeInsert(params)
      const o = className.realm.create(className.schema.name, params)
      return this.afterInsert(o)
    })
  }

  static bulkInsert (items) {
    this.realm.write(() => {
      items.forEach(item => {
        const params = this.beforeInsert(item)
        this.realm.create(this.schema.name, params)
      })
    })
  }

  static update (filter = {}, modifier = {}) {
    if (_.isEmpty(modifier)) return false
    modifier = this.beforeUpdate(modifier)
    if (_.isEmpty(modifier)) return false
    var className = this
    let objects = className.realm.objects(this.schema.name)
    if (!_.isEmpty(filter)) {
      const filterStr = this._buildFilter(filter)
      if (filterStr) {
        objects = objects.filtered(filterStr)
      }
    }

    if (objects.length) {
      className.realm.write(() => {
        _.each(objects, o => {
          if (_.isObject(o)) {
            _.each(modifier, (v, k) => {
              o[k] = v
            })
            this.afterUpdate(o)
          }
        })
      })
    }
    return objects.length
  }

  static remove (filter = {}) {
    var className = this
    let objects = className.realm.objects(this.schema.name)
    if (!_.isEmpty(filter)) {
      const filterStr = this._buildFilter(filter)
      if (filterStr) {
        objects = objects.filtered(filterStr)
      }
    }

    if (objects.length) {
      className.realm.write(() => {
        _.each(objects, o => {
          if (_.isObject(o)) {
            className.realm.delete(o)
          }
        })
      })
    }
    return objects.length
  }
}

export default RealmWrapper
