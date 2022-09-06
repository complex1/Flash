
const FLASH_3D_CONFIG = {
  shadowRange: 20,
  rotateRange: 30,
  color: 'rgba(0,0,0,0.25)'
}

const RenderFlash3DBox = function (event) {
  const { height, width , top, left} = this.ele.getBoundingClientRect()
  const x = event.clientX - left
  const y = event.clientY - top

  const xRangeFactor = this.config.shadowRange / (width / 2)
  const yRangeFactor = this.config.shadowRange / (height / 2)
  const shadowX = ((x - (width / 2)) * xRangeFactor).toString()
  const shadowY = ((y - (height / 2)) * yRangeFactor).toString()
  const blur = 0

  const xShadowRangeFactor = this.config.rotateRange / (width / 2)
  const yShadowRangeFactor = this.config.rotateRange / (height / 2)
  const rotateX = ((x - (width / 2)) * xShadowRangeFactor).toString()
  const rotateY = ((y - (height / 2)) * yShadowRangeFactor).toString()


  this.ele.style.boxShadow = `${-shadowX}px ${-shadowY}px ${blur}px 0 ${this.config.color}`
  this.ele.style.transform = `rotateX(${rotateY}deg) rotateY(${rotateX}deg)`
}

const StopRenderFlash3DBox = function () {
  this.ele.style.boxShadow = ''
  this.ele.style.transform = ''
}

class Flash3DBox {
  constructor(ele, config) {
    this.id = UID('flash-3d')
    this.ele = ele
    this.ele.classList.add(this.id)
    this.ele.classList.add('flash-3d')
    this.config = { ...FLASH_3D_CONFIG, config }
    this.RenderFlash3DBox = RenderFlash3DBox.bind(this)
    this.StopRenderFlash3DBox = StopRenderFlash3DBox.bind(this)
    this.ele.addEventListener('mousemove', this.RenderFlash3DBox)
    this.ele.addEventListener('mouseleave', this.StopRenderFlash3DBox)
    this.ele.style.transition = 'transform 0.5s liner, box-shadow 0.5s liner'
  }
  setConfig(key, value) {
    this.config[key] = value
  }
  destroy () {
    this.ele.removeEventListener('mousemove', this.RenderFlash3DBox)
    this.ele.removeEventListener('mouseleave', this.StopRenderFlash3DBox)
  }
}