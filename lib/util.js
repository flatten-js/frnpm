const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const { DateTime } = require('luxon')

const resolve = p => path.resolve(p)

const objectTransfer = (obj, keys) => {
  return Object.keys(obj).reduce((acc, cur, i) => {
    acc[keys[i]] = obj[cur]
    return acc
  }, {})
}

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
  return DateTime.local(year, month).daysInMonth
}

const logGenerator = (config, messages) => {
  const logPath = resolve('log.csv')

  const log = {
    created: DateTime.local(),
    ...config,
    ...messages
  }

  if (!fs.existsSync(logPath)) {
    writeFile(logPath, objectToString(log, 'keys', ','))
  }

  appendFile(logPath, objectToString(log, 'values', ','))
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
    const compare = [DateTime.fromISO(a[key]), DateTime.fromISO(b[key])]
    return validType(orders, order) === 'asc'
    ? compare[0].diff(compare[1]).toObject().milliseconds
    : compare[1].diff(compare[0]).toObject().milliseconds
  })
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
  division,
  findArray,
  getLastDay,
  logGenerator,
  numberMap,
  objectTransfer,
  objectToString,
  selectArrayObjectProperty,
  sortArrayObjectDate,
  uniqueArrayObject,
  validType,
  writeFile,
  zeroPadding
}
