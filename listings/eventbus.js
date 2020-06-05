import Vue from 'vue'

export const EventBus = new Vue({
  methods: {
    notify (event, params) {
      this.$emit(event, params)
    }
  }
})

export function setUpBus () {
  Object.defineProperties(Vue.prototype, {
    $bus: {
      get: function () {
        return EventBus
      }
    }
  })
}