<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    mounted () {
      if (!this.$user.isLogin && this.$router.currentRoute.name !== 'user-login') {
        // this.$router.push({ path: '/user/login' })
      }
    },
    watch: {
      $route (to, from) {
        if (!this.$user.isLogin && to.name !== 'user-login' && to.name !== 'user-firstwrite') {
          // this.$router.push({ path: '/user/login' })
        }
      }
    }
  }
</script>

<style lang="scss">
@font-face {
  font-family: 'Minguk-Regular';
  src: url('~@/assets/Minguk-Regular.woff');
}

body {
  font-family: 'Minguk-Regular' !important;
  font-size: 0.8rem !important;
}

.table th, .table td {
  padding: 0.5rem !important;
}
</style>
