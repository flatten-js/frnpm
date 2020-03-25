const Combos = require('./combos')

const {
  ceil,
  division,
  getLastDay,
  logGenerator,
  zeroPadding
} = require('./util')

const rnpm = (config) => {
  const { frame, time, hour, blank, select } = config
  const carrier = division(frame + blank, 60, ['seconds', 'year'])
  const year = Number(`20${zeroPadding(2, carrier.year)}`)
  const wait = division(carrier.seconds + select, 60, ['minute', 'seconds'])
  const seconds = wait.seconds

  const exception = (message) => `${message} of ${Combos.table.time}`
  if (select > time) throw exception('I exceed a limit')
  if (seconds > time) throw exception('It has a too small number')

  const adjust = (month) => {
    const date = division(time - seconds, month, ['day', 'minute'])
    const lastDay = getLastDay(year, month)

    const res = (format) => {
      let { day, minute } = format

      if (wait.minute >= minute) {
        const lack = ceil(wait.minute - minute, month)
        day -= lack / month
        minute += lack
      }

      return [month, day, minute]
    }

    if (month >= 12) {
      if (lastDay >= date.day) return res(date)
      const minute = (date.day - lastDay) * month + date.minute
      if (minute > 59) throw exception('It has a too big number')
      return res({ day: lastDay, minute })
    } else if (date.day >= lastDay) {
      return adjust(month + 1)
    }

    return res(date)
  }

  const [month, day, minute] = adjust(1)

  const waitNotSelect = wait.raw - select
  const selectTime = division((minute * 60) + seconds - waitNotSelect, 60, ['minute', 'seconds'])
  const messages = {
    wait_frame: `${waitNotSelect * 60}F`,
    initial_seed_decision: `${year}年${month}月${day}日${hour}時${minute}分${seconds}秒`,
    soft_select: `${year}年${month}月${day}日${hour}時${selectTime.minute}分${selectTime.seconds}秒`
  }

  console.log('\n')
  Object.values(Combos.combine(messages))
  .forEach(message => {
    console.log(message)
  })

  logGenerator(config, messages)
}

module.exports = rnpm
