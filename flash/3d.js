
const FLASH_3D_CONFIG = {
  shadowRange: 20,
  rotateRange: 30,
  color: 'rgba(0,0,0,0.25)'
}

const FLASH_CUBOID = {
  height: '200px',
  width: '300px',
  depth: '100px',
  face: [
    {
      border: '1px solid blue'
    }
  ],
  faceContent: false
}

const getFaceConfig = (face) => {
  // face order => front back left right top bottom
  let faceTemp
  switch (face.length) {
    case 1:
      faceTemp = [face[0], face[0], face[0], face[0], face[0], face[0]]
      break
    case 2:
      faceTemp = [face[0], face[1], face[0], face[1], face[1], face[0]]
      break
    case 3:
      faceTemp = [face[0], face[0], face[1], face[1], face[2], face[2]]
      break
    case 4:
      faceTemp = [face[0], face[0], face[1], face[1], face[2], face[2]]
      break
    case 5:
      faceTemp = [face[0], face[0], face[1], face[1], face[2], face[2]]
      break
    case 6:
      faceTemp = [face[0], face[1], face[2], face[3], face[4], face[5]]
      break
  }
  return faceTemp
}

const faceDirectionArray = ['front', 'back', 'left', 'right', 'top', 'bottom']

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

class Cuboid {
  constructor(ele, config) {
    const CuboidConfig = { ...FLASH_CUBOID, ...config }
    let index = localStorage.getItem('3d_uuid')
    index = index ? parseInt(index) + 1 : 0
    localStorage.setItem('3d_uuid', index)
    this.id = 'nD-Element-' + index
    this.ele = ele
    this.ele.classList.add('nD-cuboid')
    this.height = CuboidConfig.height
    this.width = CuboidConfig.width
    this.depth = CuboidConfig.depth
    this.face = getFaceConfig(CuboidConfig.face)
    this.cssVariableSetup()
    this.ele.classList.add(this.id)
    if (!CuboidConfig.faceContent) {
      faceDirectionArray.forEach(e => {
        const div = document.createElement('div')
        div.classList.add('nD-cuboid__child')
        div.classList.add('nD-cuboid__child--' + e)
        this.ele.append(div)
      })
    } else {
      const list = ele.querySelectorAll('div')
      list.forEach((child, index) => {
        child.classList.add('nD-cuboid__child')
        child.classList.add('nD-cuboid__child--' + faceDirectionArray[index])
      })
    }
  }
  cssVariableSetup() {
    const html = `.${this.id} {
      --cuboid-width: ${this.width};
      --cuboid-height: ${this.height};
      --cuboid-depth: ${this.depth};
      --cuboid-depth-negative: -${this.depth};
      --face-front-border: ${this.face[0].border};
      --face-front-background: ${this.face[0].backgroundColor};
      --face-back-border: ${this.face[1].border};
      --face-back-background: ${this.face[1].backgroundColor};
      --face-left-border: ${this.face[2].border};
      --face-left-background: ${this.face[2].backgroundColor};
      --face-right-border: ${this.face[3].border};
      --face-right-background: ${this.face[3].backgroundColor};
      --face-top-border: ${this.face[4].border};
      --face-top-background: ${this.face[4].backgroundColor};
      --face-bottom-border: ${this.face[5].border};
      --face-bottom-background: ${this.face[5].backgroundColor};
    }`
    if (!this.cssDom) {
      this.cssDom = document.createElement('style')
      this.cssDom.setAttribute('id', this.id)
      document.body.append(this.cssDom)
    }
    this.cssDom.innerHTML = html
  }
}
