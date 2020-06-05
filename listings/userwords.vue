<template> ... </template>

<script>
import { pronounceWord, getVoices } from '@/helpers/speechSynthesis'

export default {
  data () {
    return {
      canPronounce: false,
      voice: null,
      ...
    }
  },

  methods: {
    pronounce (word) {
      pronounceWord(word, this.voice)
    },
    ...
  },

  created () {
    ...

    if ('speechSynthesis' in window) {
      getVoices().then(voice => {
        let englishVoices = voice.filter(voice => voice.name.toLowerCase().indexOf('english') >= 1)
        if (englishVoices.length) {
          this.canPronounce = true
          this.voice = englishVoices[0]
        }
      })
    }
  },
  ...
}
</script>

<style lang="less" scoped> ... </style>
