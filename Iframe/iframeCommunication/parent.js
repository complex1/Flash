const CHILD_FRAME_MAP = {}
const CALLBACK_EVENT_MAP = {}

window.addEventListener('message', (e) => {
  const eventData = e.data
  if (eventData.event === CALLBACK_EVENT) {
    const callbackId = eventData.payload?.callbackId || ''
    const callbackPayload = eventData.payload?.callbackPayload
    if (typeof CALLBACK_EVENT_MAP[callbackId] === 'function') {
      CALLBACK_EVENT_MAP[callbackId](callbackPayload)
      delete CALLBACK_EVENT_MAP[callbackId]
    }
  } else {
    const childIframe = CHILD_FRAME_MAP[eventData.name]
    const events = childIframe.events || {}
    const eventList = events[eventData.event] || []
    if (Array.isArray(eventList)) {
      eventList.forEach(event => {
        event && event(eventData.payload, (callbackPayload) => {
          if (eventData.callbackId) {
            const payloadObject = {
              callbackPayload,
              callbackId: eventData.callbackId
            }
            childIframe.pushEvent(CALLBACK_EVENT, payloadObject)
          }
        })
      })
    }
  }
})

class ChildIframe {
  constructor(name, onLoad) {
    if (name in CHILD_FRAME_MAP) {
      throw new Error(`Iframe ${name} already exisit`)
    }
    if (name === '' || name === null || name === undefined) {
      throw new Error('Invalid Frame name')
    }
    this.name = name
    this.load = false
    this.events = {}
    this.childIframeElement = document.querySelector(`iframe[name="${name}"]`)
    CHILD_FRAME_MAP[name] = this
    this.addEvent(ON_LOAD_EVENT, (data) => {
      this.load = true
      onLoad && onLoad(data)
    })
  }
  pushEvent(event, payload, callback) {
    const eventId = EVENT_UUID()
    if (callback) {
      CALLBACK_EVENT_MAP[eventId] = callback
      this.childIframeElement.contentWindow.postMessage({
        event: event,
        name: this.name,
        payload,
        callbackId: eventId
      }, '*')
    } else {
      this.childIframeElement.contentWindow.postMessage({
        event: event,
        name: this.name,
        payload,
      }, '*')
    }
  }
  addEvent(eventName, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback is not a type function')
    }
    if (typeof eventName !== 'string') {
      throw new Error('Callback is not a type string')
    }
    if (!(eventName in this.events)) {
      this.events[eventName] = []
    }
    this.events[eventName].push(callback)
  }
  removeEvent(eventName, functionPointer) {
    const index = this.events[eventName]?.indexOf(functionPointer)
    if (index !== undefined && index > -1) {
      this.events[eventName]?.splice(index, 1)
    }
  }
}
