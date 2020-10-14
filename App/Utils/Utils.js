import dayjs from 'dayjs'
import { relativeTime } from 'dayjs/locale/vi'
import ApiConfig from '../Config/ApiConfig'
import _, { times } from 'lodash'
var advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)
export default {
  animatedParallelize (animations) {
    const parallelize = (animations, cb) => {
      cb?.onStart && cb.onStart()
      const promises = animations.map(a => {
        return new Promise(resolve => {
          a.start(() => {
            resolve()
          })
        })
      })
      return Promise.all(promises).then(() => {
        cb?.onDone && cb.onDone()
      })
    }
    return parallelize(animations)
  },
  formatBytes (bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  },
  timeFormat (time) {
    const isUnix = typeof time === 'number'
    var unix = isUnix ? time : dayjs(time).unix()
    var now = dayjs().unix()
    var timePass = (now - unix)
    var minPass = Math.round(timePass / 60)
    if (minPass < 59) {
      return `${minPass} phút trước`
    }
    var hourPass = Math.round(timePass / 3600)
    if (hourPass < 24) {
      return `${hourPass} giờ trước`
    }
    return dayjs.unix(unix).format('DD/MM/YYYY')
    //     return moment()
    //   .startOf('hour')
    //   .fromNow() // 23 phút trước
  },
  formatDateForRealmQuery (time) {
    return dayjs(time).format('YYYY-MM-DD@00:00:00')
  },
  dayjsWithTimeFormat (time, inFormat = 'DD/MM/YYYY', outFormat = 'YYYY-MM-DD') {
    return dayjs(time, inFormat).format(outFormat)
  },
  getDay (time) {
    return dayjs(time).format('DD')
  },
  getDate (time) {
    const isUnix = typeof time === 'number'
    var date = isUnix ? dayjs.unix(time) : dayjs(time)
    return date.format('YYYY-MM-DD')
  },
  getMonth (timestamp = dayjs().unix()) {
    return dayjs.unix(timestamp).format('YYYY-MM')
  },
  getQuarter (timestamp) {
    return 'Q' + dayjs.unix(timestamp).format('Q-YYYY')
  },
  getDateFromUnix (time) {
    return dayjs.unix(time).format('YYYY-MM-DD')
  },
  startOf (param = 'month', date) {
    return dayjs(date, 'YYYY-MM').startOf(param).format('YYYY-MM-DD@00:00:00')
  },
  endOf (param = 'month', date) {
    return dayjs(date, 'YYYY-MM').endOf(param).add(1, 'day').format('YYYY-MM-DD@00:00:00')
  },
  getAllMonthsBetweenDates (startDateStr, endDateStr) {
    let end = dayjs().date(0)
    if (!startDateStr || !endDateStr) {
      return [
        {
          label: dayjs().format('YYYY-MM'),
          from: end.subtract(1, 'month').unix(),
          to: end.unix()
        }
      ]
    }
    const startDate = dayjs.unix(startDateStr).date(0)
    var result = []
    for (var i = 0; i < 30 && !end.isBefore(startDate); i++) {
      result.push({
        label: end.add(1, 'month').format('YYYY-MM'),
        to: end.add(1, 'month').unix(),
        from: end.unix()
      })
      end = end.subtract(1, 'month')
    }
    return result.slice(0, 5).reverse()
  },

  getAllQuartersBetweenDates (startDateStr, endDateStr) {
    if (!startDateStr || !endDateStr) {
      const end = dayjs().date(0)
      return [
        {
          label: dayjs().format('YYYY-MM'),
          from: end.subtract(1, 'month').unix(),
          to: end.unix()
        }
      ]
    }
    var startDate = dayjs.unix(startDateStr)
    var endDate = dayjs.unix(endDateStr)

    var result = []
    if (endDate.isBefore(startDate) || endDate.format('YYYY-MM') === startDate.format('YYYY-MM')) {
      return [
        {
          label: endDate.format('YYYY-MM'),
          from: endDate.subtract(1, 'month').unix(),
          to: endDate.unix()
        }
      ]
    }
    const startYear = startDate.year()
    const endYear = endDate.year()
    for (var y = 0; startYear + y <= endYear; y++) {
      for (var i = 0; i <= 4; i++) {
        result.push({
          label: `${startYear + y}Q${i}`,
          from: dayjs(`${startYear + y}-${1 + (i - 1) * 3}`).unix(),
          to: dayjs(`${startYear + y}-${1 + (i) * 3}`).unix()
        })
      }
    }

    return result
  },

  getAllYearsBetweenDates (startDateStr, endDateStr) {
    const startTime = new Date().getTime()
    if (!startDateStr || !endDateStr) {
      return [dayjs().format('YYYY-MM')]
    }
    var startDate = dayjs.unix(startDateStr)
    var endDate = dayjs.unix(endDateStr)

    var result = []
    if (endDate.isBefore(startDate) || endDate.format('YYYY') === startDate.format('YYYY')) {
      return [
        {
          label: endDate.format('YYYY'),
          from: startDate.month(1).unix(),
          to: endDate.month(11).unix()
        }
      ]
    }
    const startYear = startDate.year()
    const endYear = endDate.year()
    for (var y = 0; startYear + y <= endYear; y++) {
      result.push({
        label: `${startYear + y}`,
        from: dayjs(`${startYear + y}-1`).unix(),
        to: dayjs(`${startYear + y + 1}-1`).unix()
      })
    }
    this.log('=========', new Date().getTime() - startTime)
    return result
  },
  log () {
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
  },
  randomColor () {
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  },
  rgbToHex  (rgb) {
    var hex = Number(rgb).toString(16)
    if (hex.length < 2) {
      hex = '0' + hex
    }
    return hex
  },
  fullColorHex (r, g, b) {
    var red = this.rgbToHex(r)
    var green = this.rgbToHex(g)
    var blue = this.rgbToHex(b)
    return '#' + red + green + blue
  },
  randomPaletteColors (count) {
    return [
      '#32baa8',
      '#cdda17',
      '#23f2ef',
      '#af1c25',
      '#5c0017',
      '#627847',
      '#a932aa',
      '#d85c',
      '#1f7152',
      '#a4c539',
      '#22a30c',
      '#34d0fb',
      '#7af278',
      '#40de0b',
      '#3bc0e8',
      '#b85de0',
      '#49999f',
      '#66f5e8',
      '#d49466',
      '#af9fbd',
      '#113f06',
      '#ccc112',
      '#bef161',
      '#c7e14f',
      '#77966a',
      '#fa0770',
      '#9eafff',
      '#bb751d',
      '#475f76',
      '#f69897',
      '#8e9dd',
      '#ed0410',
      '#2eba56',
      '#2f08cb',
      '#722866',
      '#7b4ca2',
      '#f9f62c',
      '#d3852c',
      '#96ed4c',
      '#652d62',
      '#b61ec8',
      '#eaa260',
      '#ab82a7',
      '#239ba7',
      '#c792cd',
      '#98eb37',
      '#c5fb79',
      '#ac19e8'
    ]
  }
}
