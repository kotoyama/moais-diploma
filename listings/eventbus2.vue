<template> ... </template>
<script>
export default {
  data () {
    return {
      userEmailDialog: false,
      newUserEmail: null,
      ...
    }
  },

  methods: { ... },
  computed: { ... },

  created () {
    this.$bus.$on('useremail:changed', () => { 
      this.userEmailDialog = false
    })
  },

  beforeDestroy () {
    this.$bus.$off('useremail:changed')
  }
}
</script>
<style lang="less" scoped> ... </style>