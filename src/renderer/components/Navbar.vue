<template>
  <b-navbar toggleable="lg" type="dark" variant="warning">
    <b-navbar-brand to="/dashboard">
      <!-- <img src="~@/assets/shiba.png" style="height: 56px;"/> -->
      비너슈 <small>({{ storeName }})</small>
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/customer">고객관리</b-nav-item>
        <b-nav-item to="/order">주문장관리</b-nav-item>
        <b-nav-item to="/trade">수평이동</b-nav-item>
        <b-nav-item to="/store">지점관리</b-nav-item>
        <b-nav-item to="/schedule">일정관리</b-nav-item>
        <b-nav-item to="/board/notice">공지사항</b-nav-item>
      </b-navbar-nav>
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <!-- <b-nav-form>
          <b-input-group>
            <b-form-input placeholder="검색" size="sm"></b-form-input>
            <b-input-group-append>
              <b-button size="sm"><b-icon-search></b-icon-search></b-button>
            </b-input-group-append>
          </b-input-group>
        </b-nav-form> -->

        <!-- <b-nav-item-dropdown text="Lang" right>
          <b-dropdown-item href="#">EN</b-dropdown-item>
          <b-dropdown-item href="#">ES</b-dropdown-item>
          <b-dropdown-item href="#">RU</b-dropdown-item>
          <b-dropdown-item href="#">FA</b-dropdown-item>
        </b-nav-item-dropdown> -->

        <!-- Using 'button-content' slot -->
        <b-nav-item-dropdown no-caret right v-show="isLogin">
          <template v-slot:button-content>
            <b-icon-person-circle></b-icon-person-circle>
          </template>
          <b-dropdown-item :to="`/user/detail/${Idx}`">내정보<small> ({{ Id }})</small></b-dropdown-item>
          <b-dropdown-item href="#" @click="logout">로그아웃</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  data () {
    return {
      isLogin: this.$user.isLogin,
      Id: this.$user.id,
      Idx: this.$user.idx,
      storeName: this.$user.storeName
    }
  },
  created () {
    const vm = this
    vm.$bus.$on('LOCAL_LOADED', (value) => {
      vm.storeName = this.$user.storeName
    })
    vm.$bus.$on('LOGGED', (value) => {
      vm.isLogin = vm.$user.isLogin
      vm.Id = vm.$user.id
      vm.Idx = vm.$user.idx
    })
  },
  methods: {
    logout () {
      this.isLogin = false
      this.$user.isLogin = false
      this.$router.push({ path: '/user/login' })
    }
  }
}
</script>

<style>
.navbar-dark .navbar-nav .nav-link {
  color: rgba(0, 0, 0, 0.5);
}

.navbar-dark .navbar-nav .nav-link:hover, .navbar-dark .navbar-nav .nav-link:focus {
  color: rgba(0, 0, 0, 0.75);
}

.navbar-dark .navbar-nav .nav-link.disabled {
  color: rgba(0, 0, 0, 0.25);
}

.nav-item .router-link-exact-active.router-link-active {
  background: rgba(255, 255, 255, 0.25)
}
</style>