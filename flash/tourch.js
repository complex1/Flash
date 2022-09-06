

const FLASH_TOURCH_CONFIG = {
  size: 200,
  color: 'rgba(0,0,0,0.9)'
}

const RenderFlashTourch = function (event) {
  event.stopPropagation()
  const rect = this.ele.getBoundingClientRect()
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const r = this.config.size

  this.tourch.style.height = `${r}px`
  this.tourch.style.width = `${r}px`
  this.tourch.style.left = `${x - r / 2}px`
  this.tourch.style.top = `${y - r / 2}px`
  this.tourch.style.boxShadow = `0 0 0 100000px ${this.config.color}, inset 0px 0px 12px rgba(0, 0, 0, 0.8)`
}

class FlashTourch {
  constructor(ele, config) {
    this.id = UID('flash-3d')
    this.ele = ele
    this.ele.classList.add(this.id)
    this.ele.classList.add('flash-3d')
    this.config = { ...FLASH_TOURCH_CONFIG, config }
    this.tourch = document.createElement('div')
    this.tourch.setAttribute('class', 'flash-tourch')
    this.ele.append(this.tourch)
    this.ele.style.position = 'relative'
    this.ele.style.overflow = 'hidden'

    this.RenderFlashTourch = RenderFlashTourch.bind(this)
    this.ele.addEventListener('mousemove', this.RenderFlashTourch)
  }
  setConfig(key, value) {
    this.config[key] = value
  }
  destroy () {
    this.ele.removeEventListener('mousemove', this.RenderFlash3DBox)
    this.ele.removeEventListener('mouseleave', this.StopRenderFlash3DBox)
  }
}