import dayjs from 'dayjs'
// import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'
import ApiConfig from '../Config/ApiConfig'
import _ from 'lodash'
// import moment from 'moment'
export default {
  timeFormat (time) {
    // dayjs.locale('vi')
    // dayjs.extend(relativeTime)
    // return dayjs(time).locale('vi').fromNow()
    var unix = dayjs(time).unix()
    var now = dayjs().unix()
    var timepass = (now - unix)
    var minPass = Math.round(timepass / 60)
    if (minPass < 59) {
      return `${minPass} phút trước`
    }
    var hourPass = Math.round(timepass / 3600)
    if (hourPass < 24) {
      return `${hourPass} giờ trước`
    }
    return dayjs(time).format('DD/MM/YYYY')
    //     return moment()
    //   .startOf('hour')
    //   .fromNow() // 23 phút trước
  },
  formatDateForRealmQuery (time) {
    return dayjs(time).format('YYYY-MM-DD@00:00:00')
  },
  getDay (time) {
    return dayjs(time).format('DD')
  },
  getDate (time) {
    return dayjs(time).format('YYYY-MM-DD')
  },
  startOf (param = 'month', date) {
    return dayjs(date, 'YYYY-MM').startOf(param).add(1, 'day')
  },
  endOf (param = 'month', date) {
    return dayjs(date, 'YYYY-MM').endOf(param)
  },
  getAllMonthsBetweenDates (startDateStr, endDateStr) {
    var startDate = dayjs(startDateStr)
    var endDate = dayjs(endDateStr)

    var result = []

    if (endDate.isBefore(startDate)) {
      return result
    }
    for (var i = 0; i < 30 && startDate.isBefore(endDate); i++) {
      result.push(startDate.format('YYYY-MM'))
      startDate = startDate.add(1, 'month')
    }
    return result
  },
  log (params) {
    if (__DEV__) console.tron.log(arguments)
  },
  clone (obj) {
    try {
      return JSON.parse(JSON.stringify(obj))
    } catch (e) {
      return obj
    }
  },
  numberWithCommas (x) {
    if (!x) {
      return 0
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },
  validateEmail (email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  },
  appendCdn (url) {
    if (url && !url.startsWith('http')) {
      return this.resolve(ApiConfig.assetUrl, url)
    }
    return url
  },
  resolve (host, end) {
    var result = host + '/' + end
    result.replace('//', '/')
    return result
  },
  clamp (num, min, max) {
    return num <= min ? min : num >= max ? max : num
  },
  createMapFromArray (arrays, key, value) {
    if (!value) {
      return _.chain(arrays)
        .keyBy(key)
        .value()
    }
    return _.chain(arrays)
      .keyBy(key)
      .mapValues(value)
      .value()
  }
}
