<template>
  <b-container class="login-wrapper">
    <b-container class="login-boxs">
      <b-row class="my-3">
        <b-input v-model="id" ref="id" placeholder="ID" style="width:300px;" @keyup.enter="login"></b-input>
      </b-row>
      <b-row class="my-3">
        <b-input v-model="password" type="password" placeholder="Password" style="width:300px;" @keyup.enter="login"></b-input>
      </b-row>
      <b-row class="my-3">
        <b-button variant="outline-primary" style="width:300px;" @click="login">로그인</b-button>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      password: ''
    }
  },
  created () {
    this.$bus.$emit('SET_MENU_NAVIGATE', [])
  },
  mounted () {
    const vm = this
    vm.$db.userDatastore.count({}, (cntErr, count) => {
      if (cntErr) {
        vm.$common.messageBox.showMessageBox(vm, '오류', '초기화 실패. 오류 : ' + cntErr)
        return
      }
      if (count < 1) {
        vm.$router.push({ path: '/user/firstwrite' })
        return
      }

      vm.$db.localDatastore.find({}, (err, row) => {
        if (err || row.length < 1) {
          vm.$common.messageBox.showMessageBox(vm, '오류', '초기화 실패. 오류 : ' + cntErr)
          return
        }
        vm.$user.storeIdx = row[0]._id
        vm.$user.storeName = row[0].name
        vm.$bus.$emit('LOCAL_LOADED', 'SUCCESS')
      })
    })
    vm.$refs.id.$el.focus()
  },
  methods: {
    login () {
      const vm = this
      vm.$crypto.encryptSHA(vm.password)
        .then((key) => {
          vm.$db.userDatastore.find({ id: vm.id, password: key })
            .exec((err, row) => {
              if (!err && row.length > 0) {
                vm.$user.isLogin = true
                vm.$user.idx = row[0]._id
                vm.$user.id = row[0].id
                vm.$user.name = row[0].name
                vm.$bus.$emit('LOGGED', 'SUCCESS')
                vm.$router.push({ path: '/dashboard' })
              } else {
                vm.$common.messageBox.showMessageBox(vm, '오류', '아이디 혹은 비밀번호를 확인해주세요.')
              }
            })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style>
.login-wrapper {
  width: 500px;
  height: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid lightgray;
  border-radius: 17px;
}

.login-boxs {
  width: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}
</style>