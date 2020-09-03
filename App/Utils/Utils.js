import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import ApiConfig from '../Config/ApiConfig'
import _ from 'lodash'
import { relativeTime } from 'dayjs/locale/vi'
export default {
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
},
  timeFormat (time) {
    var unix = dayjs(time).unix()
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
    return dayjs(time).format('DD/MM/YYYY')
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
    return dayjs(time).format('YYYY-MM-DD')
  },
  startOf (param = 'month', date) {
    return dayjs(date, 'YYYY-MM').startOf(param).format('YYYY-MM-DD@00:00:00')
  },
  endOf (param = 'month', date) {
    return dayjs(date, 'YYYY-MM').endOf(param).add(1, 'day').format('YYYY-MM-DD@00:00:00')
  },
  getAllMonthsBetweenDates (startDateStr, endDateStr) {
    this.log('getAllMonthsBetweenDates', startDateStr, endDateStr)
    if (!startDateStr || !endDateStr) {
      return [dayjs().format('YYYY-MM')]
    }
    var startDate = dayjs(startDateStr)
    var endDate = dayjs(endDateStr)

    var result = []
    if (endDate.isBefore(startDate)) {
      return [endDate.format('YYYY-MM')]
    }
    if (endDate.format('YYYY-MM') === startDate.format('YYYY-MM')) {
      return [endDate.format('YYYY-MM')]
    }
    for (var i = 0; i < 12 && endDate.isAfter(startDate); i++) {
      result.push(endDate.format('YYYY-MM'))
      endDate = endDate.subtract(1, 'month')
    }
    return result.reverse()
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
