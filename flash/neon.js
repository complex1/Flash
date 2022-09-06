window.uidIndex = 0
const UID = (prefix) => {
  window.uidIndex = window.uidIndex + 1
  return `${prefix}-${window.uidIndex}`
}

const NEON_TEXT_CONFIG = {
  neonColor: '#00ff0d',
  color: '',
  animation: true,
  animationSpeed: 2000,
  range: 4,
  animationType: 'flick',
  spread: 12
}

const NEON_BORDER_CONFIG = {
  neonColor: '#00ff0d',
  color: '#a0f4a4',
  borderWidth: 4,
  range: 4,
  spread: 6,
  animation: false,
  animationType: 'blink',
  animationSpeed: 2000
}

const ANIMATION_PATTERN = {
  blink: ['50%', '100%'],
  flick: ['0%, 18%, 22%, 25%, 53%, 57%, 100%', '20%, 24%, 55%']
}

const neonShadow = (config) => {
  let shadow = []
  for (let i = 0; i < config.range; i++) {
    shadow.push(`0 0 ${Math.floor((i + 1) * config.spread)
      }px ${i < config.range / 2 ? config.color || '#fff' : config.neonColor}`)
  }
  return shadow.join(', ')
}

const getNeonAnimation = (type = 'blink', shadow, text = false) => {
  return `${ANIMATION_PATTERN[type][0]} {
      ${text ? 'text' : 'box'}-shadow: ${shadow};
    }
    ${ANIMATION_PATTERN[type][1]} {
      ${text ? 'text' : 'box'}-shadow: none;
    }`
}

const getStyleElement = (styleId) => {
  let style = document.getElementById(styleId)
  if (!style) {
    style = document.createElement('style')
    style.setAttribute('id', `${this.id}-style`)
    document.body.append(style)
  }
  return style
}

class NeonText {
  constructor(ele, config) {
    this.id = UID('neon-text')
    this.ele = ele
    this.ele.classList.add(this.id)
    this.config = { ...NEON_TEXT_CONFIG, config }
    this.render()
  }
  render() {
    const shadow = neonShadow(this.config)

    if (!this.config.animation) {
      this.ele.style.textShadow = shadow
      this.ele.style.color = this.config.color
    } else {
      const styleId = `${this.id}-style`
      const style = getStyleElement(styleId)
      let css = `.${this.id} {
        color: ${this.config.color};
        animation: ${this.id} ${this.config.animationSpeed}ms infinite;
      }
      @keyframes ${this.id} {
        ${getNeonAnimation(this.config.animationType, shadow, true)}
      }`
      style.innerHTML = css
    }
  }
  setConfig(key, value) {
    this.config[key] = value
    this.render()
  }
}

class NeonBorder {
  constructor(ele, config) {
    this.id = UID('neon-border')
    this.ele = ele
    this.ele.classList.add(this.id)
    this.config = { ...NEON_BORDER_CONFIG, config }
    this.render()
  }
  render() {
    const shadow = neonShadow(this.config)

    if (!this.config.animation) {
      this.ele.style.borderWidth = this.config.borderWidth + 'px'
      this.ele.style.borderColor = this.config.color
      this.ele.style.borderStyle = 'solid'
      this.ele.style.boxShadow = shadow
    } else {
      const styleId = `${this.id}-style`
      const style = getStyleElement(styleId)
      let css = `.${this.id} {
        border-width: ${this.config.borderWidth}px;
        border-color: ${this.config.color};
        border-style: solid;
        animation: ${this.id} ${this.config.animationSpeed}ms infinite;
      }
      @keyframes ${this.id} {
        ${getNeonAnimation(this.config.animationType, shadow, false)}
      }`
      style.innerHTML = css
    }
  }
  setConfig(key, value) {
    this.config[key] = value
    this.render()
  }
}
