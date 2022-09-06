const FLASH_BUTTON_CONFIG = {
  color: 'rgb(121, 249, 66)',
  size: '30px',
  background: 'rgba(0,0,0,0)'
}

class FlashButton {
  constructor(ele, config) {
    this.id = UID('flash-btn')
    this.ele = ele
    this.ele.classList.add(this.id)
    this.ele.classList.add('flash-btn')
    this.config = { ...FLASH_BUTTON_CONFIG, config }
    this.render()
  }

  render () {
    const styleId = `${this.id}-style`
      const style = getStyleElement(styleId)
      let css = `.${this.id} {
        --flash-btn-color: ${this.config.color};
        --flash-btn-background: ${this.config.background};
        --flash-btn-size: ${this.config.size};
      }`
      style.innerHTML = css
  }
  setConfig(key, value) {
    this.config[key] = value
    this.render()
  }
}