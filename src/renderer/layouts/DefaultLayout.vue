<template>
  <div>
    <navbar v-bind:storeName="storeName" v-bind:isLogin="isLogin"></navbar>
    <b-container fluid>
      <b-breadcrumb v-show="menuItems.length > 0" :items="menuItems" class="my-3"></b-breadcrumb>
    </b-container>
    <router-view />
    <div class="copyright">Copyright(C) {{ $moment(new Date()).format('YYYY') }}. <b>filbert.</b> All rights reserved.</div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Navbar from '../components/Navbar'

export default {
  name: 'default-layout',
  data () {
    return {
      menuItems: []
    }
  },
  computed: {
    storeName () {
      return this.$user.storeName
    },
    isLogin () {
      return this.$user.isLogin
    }
  },
  created () {
    const vm = this
    vm.$bus.$on('SET_MENU_NAVIGATE', (value) => {
      vm.menuItems = value
    })
  },
  components: {
    Navbar
  }
}
</script>

<style>
.copyright {
  position: fixed;
  bottom: 0;
  right: 0;
  padding-right: 10px;
  padding-bottom: 10px;
}
</style>