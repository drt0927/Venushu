<template>
  <b-container fluid>
  </b-container>
</template>

<script>
export default {
  created () {
    this.$bus.$emit(this.$common.enum.emitMessage.SET_MENU_NAVIGATE, [])
  }
}
</script>

<style>

</style>