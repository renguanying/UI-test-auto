// src/utils/eventBus.js
import { reactive, toRaw } from 'vue'

const eventBus = reactive(new Map())

export default {
  emit (event, ...args) {
    const handlers = eventBus.get(event)
    if (handlers) {
      handlers.forEach(handler => handler(...args))
    }
  },
  on (event, handler) {
    const handlers = eventBus.get(event) || []
    handlers.push(handler)
    eventBus.set(event, handlers)
  },
  off (event, handler) {
    const handlers = eventBus.get(event)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    }
  }
}