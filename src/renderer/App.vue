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
        this.$router.push({ path: '/user/login' })
      }
    },
    watch: {
      $route (to, from) {
        if (!this.$user.isLogin && to.name !== 'user-login' && to.name !== 'user-firstwrite') {
          this.$router.push({ path: '/user/login' })
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
  padding: 0.15rem !important;
}

.table-trade-in, .table-danger>td, .table-danger>th {
  background-color: #DDE7FE;
}
.table-trade-out, .table-danger>td, .table-danger>th {
  background-color: #FFD1DF;
}
.table-trade-confirm, .table-danger>td, .table-danger>th {
  background-color: #FFE66D;
}
</style>
