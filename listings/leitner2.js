processUserdataWord ({ commit, getters }, payload) {
  let word = getters.userdata.words[payload]
  let userdata = Vue.$db.collection('userdata').doc(getters.userId)
  if (word.bucket === 5) {
    userdata.update({
      [`words.${payload}`]: firebase.firestore.FieldValue.delete()
    })
      .then(() => commit('removeUserdataWord', payload))
  } else {
    let nextShow = new Date()
    nextShow = new Date(nextShow.setDate(new Date().getDate() + word.bucket * 2))
    word.nextShow = nextShow
    word.bucket++
    userdata.set({
      words: {
        [payload]: word
      }
    }, { merge: true })
      .then(() => commit('updateUserdataWord', { word: word, wordId: payload }))
  }
}