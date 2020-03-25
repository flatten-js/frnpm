const { StringPrompt } = require('enquirer')

class Nnrn extends StringPrompt {
  constructor(options) {
    super({ style: 'number', ...options })
    this.min = this.isValue(options.min)
      ? this.toNumber(options.min)
      : -Infinity
    this.max = this.isValue(options.max)
      ? this.toNumber(options.max)
      : Infinity
    this.float = Boolean(options.float)
    this.minor = this.toNumber(options.minor) || 1
    this.initial = options.initial || ''
    this.input = this.cursor = ''
    this.updateInput(this.initial)
  }

  append(ch) {
    if (!this.float) return
    if (this.input.includes('.')) return
    if (ch === '.') return super.append(ch)
  }

  number(ch) {
    return super.append(ch)
  }

  updateInput(v) {
    this.input = String(v)
    this.cursor = this.input.length
  }

  up() {
    const num = this.toNumber(this.input)
    if (num >= this.max) return
    this.updateInput(num + this.minor)
    return this.render()
  }

  down() {
    const num = this.toNumber(this.input)
    if (num <= this.min) return
    this.updateInput(num - this.minor)
    return this.render()
  }

  isValue(v) {
    return /^[0-9]+((\.)|(\.[0-9]+))?$/.test(v)
  }

  toNumber(n = '') {
    return this.float ? +n : Math.round(+n)
  }

  format(input = this.input) {
    if (typeof this.options.format === 'function') {
      return this.options.format.call(this, input)
    }
    return this.styles.info(input)
  }

  async submit() {
    this.state.submitted = true
    this.state.validating = true

    if (this.options.onSubmit) {
      await this.options.onSubmit.call(this, this.name, this.value, this)
    }

    const validate = (state, value) => {
      const permanent = v => {
        switch(true) {
          case this.min > v:
          return `A number exceeds the lower limit value: ${this.min}`
          case v > this.max:
          return `A number exceeds the upper limit value: ${this.max}`
        }
      }
      return state.error || permanent(value) || this.validate(value, state)
    }

    const result = validate(this.state, this.value)
    if (result !== true) {
      let error = '\n' + this.symbols.pointer + ' '

      if (typeof result === 'string') {
        error += result.trim()
      } else {
        error += 'Invalid Number'
      }

      this.state.error = '\n' + this.styles.danger(error)
      this.state.submitted = false
      await this.render()
      this.state.validating = false
      this.state.error = void 0;
      return
    }

    const value = [this.input, this.initial].find(v => this.isValue(v))
    this.value = this.toNumber(value)

    this.state.validating = false
    await this.render()
    await this.close()

    this.emit('submit', this.value)
  }
}

module.exports = Nnrn
