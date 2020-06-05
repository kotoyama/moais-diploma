<template> ... </template>

<script>
import axios from 'axios'
import yandex from './config/yandex'

export default {
  data: () => ({ ... }),

  props: {
    'bookId': { type: String, required: true },
    'partId': { type: String, required: true }
  },

  ...
  mounted () {
    document.addEventListener('mouseup', event => {
      this.getSelectedTextAndTranslate()
      window.getSelection().removeAllRanges()
    })
  },

  methods: {
    getSelectedTextAndTranslate () {
      this.selection = window.getSelection().toString()
      if (this.selection) {
        this.getTranslation()
        this.showSnackbar = true
      }
    },

    getTranslation () {
      axios.get(`${yandex.url+yandex.apiKey+this.selection}`)
          .then(response => {
            this.word.textToTranslate = this.selection
            this.word.translation = response.data.text[0]
          })
    },
    ...
  }
}
</script>
<style lang="less"> ... </style>
