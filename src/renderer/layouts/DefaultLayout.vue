<template>
  <div>
    <navbar></navbar>
    <transition name="fade-in-up">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Navbar from '../components/Navbar'

export default {
  name: 'default-layout',
  components: {
    Navbar
  }
}
</script>

<style>

</style>