const resolve = (p) => require('path').resolve(p)

const { validType } = require(resolve('lib/util'))

const questionGenerator = (type, data, options) => {
  const types = ['nnrn']
  return Object.keys(data).reduce((acc, cur) => {
    const format = {
      type: validType(types, type),
      name: cur,
      message: data[cur],
      ...options.find(option => option.name === cur)
    }
    acc.push(format)
    return acc
  }, [])
}

module.exports = {
  questionGenerator
}
