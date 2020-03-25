#!/usr/bin/env node
'use strict'

const program = require('commander')
const Enquirer = require('enquirer')
const path = require('path')
const fs = require('fs')
const csv = require('csv')

const resolve = (p) => path.resolve(p)

const meta = require(resolve('package.json'))
const Nnrn = require(resolve('lib/prompts/nnrn'))
const Combos = require(resolve('lib/combos'))
const { questionGenerator } = require(resolve('lib/prompts'))
const rnpm = require(resolve('lib/rnpm'))

const {
  createBorder,
  consolePager,
  objectToString,
  selectArrayObjectProperty,
  sortArrayObjectDate,
  style,
  uniqueArrayObject
} = require(resolve('lib/util'))

program
.version(meta.version)

program
.command('start')
.description('start time calculation based on config.json')
.action(async () => {
  const enquirer = new Enquirer()
  enquirer.register('nnrn', Nnrn)

  const data = Combos.extract(['frame', 'time', 'hour', 'blank', 'select'])
  const options = [
    { name: 'frame', min: 0, max: 65535 },
    { name: 'time', min: 0, max: 500 },
    { name: 'hour', min: 0, max: 23 },
    { name: 'blank', initial: meta.preset.blank, min: 0, max: 500 },
    { name: 'select', initial: meta.preset.select, min: 0, max: 59 }
  ]

  const question = questionGenerator('nnrn', data, options)
  const answer = await enquirer.prompt(question)

  try {
    rnpm(answer)
  }
  catch(err) {
    console.error('\n', style.error(err))
  }
})

program
.command('log')
.option('-r, --result', 'output only result')
.option('-u, --unique', 'output unique')
.option('-n, --newest', 'output in new arrival order')
.description('output formatted log')
.action(({ result, unique, newest }) => {
  const logPath = resolve('log.csv')

  if (!fs.existsSync(logPath)) {
    return console.error('\n', style.error('Log was not found'))
  }

  fs.createReadStream(logPath)
  .pipe(csv.parse({ columns: true }, (err, logs) => {
    if (err) throw err

    let hold = logs

    if (result) {
      hold = selectArrayObjectProperty(hold, [
        'created',
        'wait_frame',
        'initial_seed_decision',
        'soft_select'
      ])
    }

    if (unique) {
      hold = uniqueArrayObject(hold, 'created')
    }

    if (newest) {
      hold = sortArrayObjectDate(hold, 'desc', 'created')
    }

    const border = createBorder('-', 40)
    const outputFormat = hold.reduce((acc, cur) => {
      const format = objectToString(Combos.combine(cur), 'values', '\n')
      acc.push(format, border)
      return acc
    }, [border])

    consolePager(outputFormat.join('\n'))
  }))
})

program.parse(process.argv)
