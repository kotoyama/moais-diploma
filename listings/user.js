import User from './helpers/user_helper'
import { EventBus } from '../helpers/eventBus'
export default {
  state: { user: null },
  mutations: {
    setUserEmail (state, payload) {
      state.user.email = payload
      EventBus.notify('useremail:changed')
    },
    ...
  },
  actions: {
    async changeUserInfo ({ commit }, payload) { ... },
    ...
  },
  getters: { ... }
}
