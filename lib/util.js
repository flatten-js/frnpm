const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const resolve = p => path.resolve(p)

const appendFile = (path, data, message) => {
  fs.appendFile(path, `${data}\n`, (err) => {
    if (err) return
    if (!message) return
    console.log(message)
  })
}

const ceil = (number, exp) => {
  return Math.ceil(number / exp) * exp
}

const createBorder = (parts, length) => {
  return Array(length).join(parts)
}

const consolePager = (str) => {
  const file = resolve('helper/pager.ps1')
  return new Promise(resolve => {
    spawnSync('powershell', ['-File', file, str], { stdio: 'inherit' })
    resolve()
  })
}

const csvArrayParser = (arr = []) => {
  return new Promise((resolve, reject) => {
    const [keys, ...data] = arr.map(data => data.split(','))
    const format = data.reduce((acc, cur) => {
      let object = {}
      keys.forEach((key, i) => object[key] = cur[i])
      acc.push(object)
      return acc
    }, [])
    resolve(format)
  })
}

const division = (dividend, divisor, keys) => {
  return {
    raw: dividend,
    [keys[0] || 'quotient']: Math.floor(dividend / divisor),
    [keys[1] || 'remainder']: Math.floor(dividend % divisor)
  }
}

const findArray = (arr, target) => {
  return arr.filter(data => data === target)[0]
}

const getLastDay = (year, month) => {
  return new Date(year, month, 0).getDate()
}

const logGenerator = (config, messages) => {
  const logPath = resolve('log.csv')

  const log = {
    created: now(),
    ...config,
    ...messages
  }

  if (!fs.existsSync(logPath)) {
    writeFile(logPath, objectToString(log, 'keys', ','))
  }

  appendFile(logPath, objectToString(log, 'values', ','))
}

const now = () => {
  return new Date().toLocaleString()
}

const numberMap = (arr) => {
  return arr.map(data => Number(data))
}

const objectToString = (obj, type, delimiter) => {
  const types = ['keys', 'values']
  return Object[validType(types, type)](obj).join(delimiter)
}

const selectArrayObjectProperty = (arr, need) => {
  need = [].concat(need)
  return arr.map(obj => {
    return need.reduce((acc, cur) => {
      if (!obj[cur]) return acc
      acc[cur] = obj[cur]
      return acc
    }, {})
  })
}

const sortArrayObjectDate = (arr, order, key) => {
  const orders = ['asc, desc']
  return arr.slice().sort((a, b) => {
    const compareA = new Date(a[key])
    const compareB = new Date(b[key])
    return validType(orders, order) === 'asc'
    ? compareA - compareB
    : compareB - compareA
  })
}

const style = {
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  reset: '\x1b[0m',
  create(type, text, colors) {
    colors = colors.map(color => this[color]).filter(v => v)
    const format = type === 'badge' ? ` ${text} ` : text
    return colors.join('') + format + this.reset
  },
  error(text) {
    const badge = this.create('badge', 'ERROR', ['black', 'bgRed'])
    return `${badge} ${text}`
  }
}

const uniqueArrayObject = (arr, ignore = []) => {
  ignore = [].concat(ignore)
  return arr.filter((obj, i, self) => {
    return self.findIndex(deep => {
      return Object.keys(obj).every(key => {
        if (ignore.some(v => v === key)) return true
        return obj[key] === deep[key]
      })
    }) === i
  })
}

const validType = (types, type) => {
  return findArray(types, type) || types[0]
}

const writeFile = (path, data, message) => {
  fs.writeFile(path, `${data}\n`, (err) => {
    if (err) throw err
    if (!message) return
    console.log(messgae)
  })
}

const zeroPadding = (digit, number) => {
  return `${Array(digit).join('0')}${number}`.slice(-digit)
}

const questionPrompt = (type, obj) => {
  const types = []
  return Object.keys(obj).reduce((acc, cur) => {
    const format = { type: 'number', name: cur, message: obj[cur] }
    acc.push(format)
    return acc
  }, [])
}

module.exports = {
  appendFile,
  ceil,
  createBorder,
  consolePager,
  csvArrayParser,
  division,
  findArray,
  getLastDay,
  logGenerator,
  now,
  numberMap,
  objectToString,
  selectArrayObjectProperty,
  sortArrayObjectDate,
  style,
  uniqueArrayObject,
  validType,
  writeFile,
  zeroPadding
}
