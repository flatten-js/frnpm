const readline = require('readline')

class Linereader {
  constructor(rs) {
    this.rl = readline.createInterface({
      input: rs,
      output: {}
    })
    this.list = []
  }

  eachLine() {
    return new Promise((resolve, reject) => {
      this.rl.on('line', (line) => {
        this.list.push(line)
      })
      this.rl.on('close', () => {
        resolve(this.list)
      })
    })
  }
}

module.exports = Linereader
