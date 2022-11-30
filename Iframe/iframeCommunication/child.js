const CALLBACK_EVENT_MAP = {}
let PARENT_FRAME = null

window.addEventListener('message', (e) => {
  const eventData = e.data
  if (eventData.event === CALLBACK_EVENT) {
    const callbackId = eventData.payload.callbackId
    const callbackPayload = eventData.payload.callbackPayload
    if (typeof CALLBACK_EVENT_MAP[callbackId] === 'function') {
      CALLBACK_EVENT_MAP[callbackId](callbackPayload)
      delete CALLBACK_EVENT_MAP[callbackId]
    }
  } else {
    const events = PARENT_FRAME.events || {}
    const eventList = events[eventData.event] || []
    if (Array.isArray(eventList)) {
      eventList.forEach(event => {
        event && event(eventData.payload, (callbackPayload) => {
          if (eventData.callbackId) {
            const payloadObject = {
              callbackPayload,
              callbackId: eventData.callbackId
            }
            PARENT_FRAME.pushEvent(CALLBACK_EVENT, payloadObject)
          }
        })
      })
    }
  }
})

class ParentIframe {
  constructor (name, onLoadCallback) {
    if (name === '' || name === null || name === undefined) {
      throw new Error('Invalid Frame name')
    }
    this.name = name
    this.events = {}
    PARENT_FRAME = this
    this.pushEvent(ON_LOAD_EVENT, true, onLoadCallback)
  }
  pushEvent(event, payload, callback) {
    const eventId = EVENT_UUID()
    if (callback) {
      CALLBACK_EVENT_MAP[eventId] = callback
      window.parent.postMessage({
        event: event,
        name: this.name,
        payload,
        callbackId: eventId
      }, '*')
    } else {
      window.parent.postMessage({
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
}
