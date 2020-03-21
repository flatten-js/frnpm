class Combos {
  constructor() {
    this.table = {
      created: '生成時間',
      frame: 'フレーム+年-2000',
      time: '月×日+分+秒',
      hour: '時',
      blank: '空白時間',
      select: 'ソフト選択までの秒数',
      wait_frame: '待機時間',
      initial_seed_decision: '初期seed決定',
      soft_select: 'ソフト選択'
    }
  }

  extract(keys) {
    return keys.reduce((acc, cur) => {
      if (!this.table[cur]) return acc
      acc[cur] = this.table[cur]
      return acc
    }, {})
  }

  combine(obj) {
    return Object.keys(this.table).reduce((acc, cur) => {
      if (!obj[cur]) return acc
      acc[cur] = `${this.table[cur]}:${obj[cur]}`
      return acc
    }, {})
  }
}

module.exports = new Combos()
