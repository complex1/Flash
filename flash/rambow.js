
const RAMBOW_BORDER_CONFIG = {
  borderWidth: 4,
  backgroundColor: 'rgb(70, 34, 14)',
  color: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
  animation: true,
  speed: 4000,
  animationOnHoverOnly: true
}

const RAMBOW_SHADOW_CONFIG = {
  backgroundColor: null,
  color: ['white', 'orange', 'violet'],
  colorDirection: '0deg',
  xShadow: 0,
  yShadow: 0,
  blur: 10,
  spread: 1
}

class RambowBorder {
  constructor(ele, config) {
    this.id = UID('rambow-border')
    this.ele = ele
    this.ele.classList.add(this.id)
    this.config = { ...RAMBOW_BORDER_CONFIG, config }
    this.render()
  }
  render() {
    const borderImage = `conic-gradient(${this.config.color.join(',')}, ${this.config.color[0]})`
    if (!this.config.animation) {
      this.ele.style.borderWidth = this.config.borderWidth + 'px'
      this.ele.style.borderStyle = 'solid'
      this.ele.style.borderImage = borderImage
      this.ele.style.borderImageSlice = 1
      this.ele.style = this.config.backgroundColor || 'transparent'
    } else {
      const styleId = `${this.id}-style`
      const style = getStyleElement(styleId)
      const css = `.${this.id} {
        position: relative;
        background-color: ${this.config.backgroundColor};
        z-index: 1;
        overflow: hidden;
      }
      
      .${this.id}::before {
        content: '';
        position: absolute;
        inset: -50% -50% -50% -50%;
        background-image: ${borderImage};
        z-index: 0 !important;
        animation: rotate ${this.config.speed}ms infinite linear;
        animation-play-state: ${this.config.animationOnHoverOnly ? 'paused' : 'running'};
      }

      .${this.id}:hover::before {
        animation-play-state: running;
      }
      
      .${this.id}::after {
        content: '';
        position: absolute;
        inset: 5px 5px 5px 5px;
        background-color: ${this.config.backgroundColor};
        z-index: 1;
      }
      
      .${this.id} > * {
        z-index: 1;
      }`
      style.innerHTML = css
    }
  }
  setConfig(key, value) {
    this.config[key] = value
    this.render()
  }
}


class RambowShadow {
  constructor(ele, config) {
    this.id = UID('rambow-shadow')
    this.ele = ele
    this.ele.classList.add(this.id)
    this.ele.classList.add('rambow-shadow')
    this.config = { ...RAMBOW_SHADOW_CONFIG, config }
    this.render()
  }
  render() {
    if (this.config.backgroundColor) {
      this.ele.style.backgroundColor = this.config.backgroundColor
    }
    const styleId = `${this.id}-style`
    const style = getStyleElement(styleId)
    let css = `.${this.id} {
      --rambow-shadow-background: linear-gradient( ${this.config.colorDirection}, ${this.config.color.join(',')});
      --rambow-shadow-transform: translate3d(${this.config.xShadow}px, ${this.config.yShadow}px, -1px) scale(${this.config.spread});
      --rambow-shadow-filter: blur(${this.config.blur}px);
    }`
    style.innerHTML = css
  }
  setConfig(key, value) {
    this.config[key] = value
    this.render()
  }
}
