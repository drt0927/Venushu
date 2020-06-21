<template>
  <b-container fluid>
  </b-container>
</template>

<script>
export default {
  created () {
    this.$bus.$emit('SET_MENU_NAVIGATE', [])
  }
}
</script>

<style>

</style>