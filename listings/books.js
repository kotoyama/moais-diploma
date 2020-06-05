import Vue from 'vue'
import Book from './helpers/book_helper'

export default {
  state: {
    books: []
  },

  mutations: {
    setBooks (state, payload) {
      state.books = payload
    }
  },

  actions: {
    async loadBooks ({ commit }) {
      Vue.$db.collection('books').get().then(snapshot => {
        let books = []
        snapshot.forEach(element => {
          const data = element.data()
          let parts = []
          if (data.parts) {
            data.parts.forEach(bookPart => {
              let part = { id: bookPart.id, title: bookPart.title }
              parts.push(part)
            })
          }
          books.push(new Book(
            element.id, data.title, data.author, data.year,
            data.description, data.image, data.level, data.genres, parts
          ))
        })
        commit('setBooks', books)
      })
    }
  },

  getters: {
    books: (state) => state.books
  }
}