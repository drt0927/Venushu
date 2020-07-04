<template>
  <div ref="warpper" style="height:100%;">
    <!-- <navbar v-bind:storeName="storeName" v-bind:isLogin="isLogin" class="nav-fixed"></navbar> -->
    <div style="height:100%;">
      <vs-sidebar static-position 
        :parent="body"
        :reduce="true"
        :reduce-not-hover-expand="false"
        default-index="1"
        color="warning"
        class="sidebarx"
        :hidden-background="true"
        spacer>
        <div class="header-sidebar" slot="header">
          <vs-avatar  size="70px" src="imgs/avatar--assets.png"/>
        </div>
        <vs-sidebar-item index="1" icon="dashboard">
          대쉬보드
        </vs-sidebar-item>
        <vs-sidebar-item index="2" icon="supervised_user_circle">
          고객관리
        </vs-sidebar-item>
        <vs-sidebar-item index="3" icon="style">
          주문장관리
        </vs-sidebar-item>
        <vs-sidebar-item index="4" icon="compare_arrows">
          수평이동
        </vs-sidebar-item>
        <vs-sidebar-item index="5" icon="business">
          지점관리
        </vs-sidebar-item>
        <vs-sidebar-item index="6" icon="calendar_today">
          일정관리
        </vs-sidebar-item>
        <vs-sidebar-item index="7" icon="create">
          게시판
        </vs-sidebar-item>
        <!-- <div class="footer-sidebar" slot="footer">
          <vs-button icon="settings" color="primary" type="border"></vs-button>
        </div> -->
      </vs-sidebar>
    </div>
    <div class="contents">
      <router-view />
    </div>
    <!-- <div style="margin-top:65px;">
      <b-container fluid>
        <b-breadcrumb v-show="menuItems.length > 0" :items="menuItems" class="my-3"></b-breadcrumb>
      </b-container>
      
    </div> -->
    <!-- <div class="copyright">Copyright ⓒ {{ $moment(new Date()).format('YYYY') }}. <b>슈슈와샤샤.</b> All rights reserved.</div> -->
  </div>
</template>

<script>
import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

// import Navbar from '../components/Navbar'

export default {
  name: 'default-layout',
  data () {
    return {
      menuItems: [],
      menuActive: true
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
  }
}
</script>

<style>
.contents {
  position: absolute;
  top: 0;
  left: 54px;
}

.header-sidebar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}

h4 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

h4 > button {
  margin-left: 10px;
}
      
.footer-sidebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.footer-sidebar > button {
  border: 0px solid rgba(0,0,0,0) !important;
  border-left: 1px solid rgba(0,0,0,.07) !important;
  border-radius: 0px !important;
}

.vs-sidebar--item a {
  height: 40px;
}

.sidebarx {
  height: 100%;
}
</style>
