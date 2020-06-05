import Vue from 'vue'
import { EventBus } from '../helpers/eventBus'
import firebase from 'firebase'

let defaultData = {
  books: {},
  words: {},
  following: {}
}

export default {
  state: {
    userdata: defaultData
  },

  mutations: {
    setUserData (state, payload) {
      Vue.set(state, 'userdata', payload)
      EventBus.notify('userdata:loaded')
    },
    addUserBook (state, payload) {
      Vue.set(state.userdata.books, payload.bookId, payload.book)
    },
    addUserBookPart (state, payload) {
      Vue.set(state.userdata.books[payload.bookId].parts, payload.partId, { addedDate: payload.timestamp })
    },
    updateLastOpenedDate (state, payload) {
      Vue.set(state.userdata.books[payload.bookId].parts[payload.partId], 'lastOpened', payload.timestamp)
    },
    updateCompletionInfo (state, payload) {
      Vue.set(state.userdata.books[payload.bookId].parts[payload.partId], 'finished', payload.timestamp)
    },
    addUserWord (state, payload) {
      Vue.set(state.userdata.words, payload.wordId, payload.word)
    },
    removeUserWord (state, payload) {
      Vue.delete(state.userdata.words, payload)
      EventBus.notify('userword:updated', payload)
    },
    updateUserWord (state, payload) {
      Vue.set(state.userdata.words[payload.wordId], 'bucket', payload.word.bucket)
      Vue.set(state.userdata.words[payload.wordId], 'nextShowDate', payload.word.nextShowDate)
      EventBus.notify('userword:updated', payload.wordId)
    },
    followUser (state, payload) {
      Vue.set(state.userdata.following, payload.userId, payload.user)
    },
    unfollowUser (state, payload) {
      Vue.delete(state.userdata.following, payload.id)
      EventBus.notify('userfollowing:updated', payload.id)
    }
  },

  actions: {
    async getUserData ({ commit }, payload) {
      commit('setLoading', true)
      let dataRef = Vue.$db.collection('userdata').doc(payload)
      await dataRef.get()
        .then((data) => {
          let userdata = data.exists ? data.data() : defaultUserData
          if (!userdata.books) {
            userdata.books = {}
          }
          if (!userdata.words) {
            userdata.words = {}
          }
          if (!userdata.likes) {
            userdata.likes = {}
          }
          if (!userdata.following) {
            userdata.following = {}
          }
          commit('setUserData', userdata)
          commit('setLoading', false)
        })
        .catch(() => {
          commit('setLoading', false)
        })
    },

    async addUserBook ({ commit, getters }, payload) {
      commit('setLoading', true)
      let dataRef = Vue.$db.collection('userdata').doc(getters.userId)
      let book = {
        addedDate: new Date(),
        parts: {}
      }
      await dataRef.set({
        books: {
          [payload]: book
        }
      }, { merge: true })
        .then(() => {
          commit('addUserBook', { bookId: payload, book: book })
          commit('setLoading', false)
        })
        .catch(() => {
          commit('setLoading', false)
        })
    },

    async addUserWord ({ commit, getters }, payload) {
      commit('setLoading', true)
      let dataRef = Vue.$db.collection('userdata').doc(getters.userId)
      let word = {
        original: payload.originalWord,
        translation: payload.translatedWord,
        addedDate: new Date(),
        nextShowDate: new Date(),
        bucket: 1
      }
      await dataRef.set({
        words: {
          [payload.id]: word
        }
      }, { merge: true })
        .then(() => {
          commit('addUserWord', { wordId: payload.id, word: word })
          commit('setLoading', false)
        })
        .catch(() => {
          commit('setLoading', false)
        })
    },

    updateUserBookPart ({ commit, getters }, payload) {
      let dataRef = Vue.$db.collection('userdata').doc(getters.userId)
      let timestamp = new Date()
      if (!getters.userdata.books[payload.bookId].parts[payload.partId]) {
        dataRef.update({
          [`books.${payload.bookId}.parts.${payload.partId}.addedDate`]: timestamp
        })
          .then(() => commit('addUserBookPart', { bookId: payload.bookId, partId: payload.partId, timestamp: timestamp }))
      }
      dataRef.update({
        [`books.${payload.bookId}.parts.${payload.partId}.lastOpened`]: timestamp
      })
        .then(() => commit('updateLastOpenedDate', { bookId: payload.bookId, partId: payload.partId, timestamp: timestamp }))
    },

    completeUserBookPart ({ commit, getters }, payload) {
      let dataRef = Vue.$db.collection('userdata').doc(getters.userId)
      let timestamp = new Date()
      dataRef.update({
        [`books.${payload.bookId}.parts.${payload.partId}.finished`]: timestamp
      })
        .then(() => commit('updateCompletionInfo', { bookId: payload.bookId, partId: payload.partId, timestamp: timestamp }))
    },

    processUserWord ({ commit, getters }, payload) {
      let word = getters.userdata.words[payload]
      let dataRef = Vue.$db.collection('userdata').doc(getters.userId)
      if (word.bucket === 5) {
        dataRef.update({
          [`words.${payload}`]: firebase.firestore.FieldValue.delete()
        })
          .then(() => commit('removeUserWord', payload))
      } else {
        let nextShowDate = new Date()
        nextShowDate = new Date(nextShowDate.setDate(new Date().getDate() + word.bucket * 2))
        word.nextShowDate = nextShowDate
        word.bucket++
        dataRef.set({
          words: {
            [payload]: word
          }
        }, { merge: true })
          .then(() => commit('updateUserWord', { word: word, wordId: payload }))
      }
    },

    async followUser ({ commit, getters }, payload) {
      commit('setLoading', true)
      let dataRef = Vue.$db.collection('userdata').doc(getters.userId)
      await dataRef.set({
        following: {
          [payload.id]: payload.name
        }
      }, { merge: true })
        .then(() => {
          commit('followUser', { userId: payload.id, user: payload })
          commit('setLoading', false)
        })
        .catch(() => {
          commit('setLoading', false)
        })
    },

    unfollowUser ({ commit, getters }, payload) {
      let dataRef = Vue.$db.collection('userdata').doc(getters.userId)
      dataRef.update({
        [`following.${payload.id}`]: firebase.firestore.FieldValue.delete()
      })
        .then(() => commit('unfollowUser', payload.id))
    }
  },

  getters: {
    userdata: (state) => state.userdata
  }
}
