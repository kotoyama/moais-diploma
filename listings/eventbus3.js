setUserEmail (state, payload) {
  state.user.email = payload
  EventBus.notify('useremail:changed')
}