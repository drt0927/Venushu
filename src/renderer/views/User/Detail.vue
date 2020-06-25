<template>
  <b-container fluid>
    <b-row class="my-2">
      <b-col>
        <h4>사용자 정보</h4>
        <b-row>
          <b-col>이름</b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-input ref="name" v-model="user.name" size="sm"></b-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col>매장명</b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-input ref="local-name" v-model="local.name" size="sm"></b-input>
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>
            <b-button variant="success" @click="updateUser">변경</b-button>
          </b-col>
        </b-row>
      </b-col>
      <b-col>
        <h4>비밀번호 변경</h4>
        <b-row>
          <b-col>현재 비밀번호</b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-input ref="old-password" v-model="password.oldPassword" size="sm"></b-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col>새 비밀번호</b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-input ref="new-password" v-model="password.newPassword" size="sm"></b-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col>새 비밀번호 확인</b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-input ref="new-confirm-password" v-model="password.newConfirmPassword" size="sm" @keyup="checkConfirmPassword"></b-input>
          </b-col>
        </b-row>
        <b-row class="my-2">
          <b-col>
            <b-button variant="success" @click="changePassword">변경</b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      user: {},
      local: {},
      password: {
        oldPassword: '',
        newPassword: '',
        newConfirmPassword: ''
      }
    }
  },
  mounted () {
    const vm = this
    vm.$db.localDatastore.find({ _id: vm.$user.storeIdx }, (err, row) => {
      if (err || row.length < 1) {
        this.$router.push({ path: '/dashboard' })
      }
      vm.local = row[0]
    })

    vm.$db.userDatastore.find({ _id: vm.$user.idx }, (err, row) => {
      if (err || row.length < 1) {
        this.$router.push({ path: '/dashboard' })
      }
      vm.user = row[0]
    })
  },
  methods: {
    checkConfirmPassword () {

    },
    changePassword () {

    },
    updateUser () {
      const vm = this

      vm.$db.localDatastore.update({ _id: vm.local._id }, { $set: vm.local }, {}, function (err, a) {
        if (err) {
          vm.$common.messageBox.showMessageBox(vm, '오류', '수정에 실패 하였습니다. 오류 : ' + err)
          return
        }

        vm.$user.storeName = vm.local.name
        vm.$bus.$emit('LOCAL_LOADED', 'SUCCESS')

        vm.$db.userDatastore.update({ _id: vm.user._id }, { $set: vm.user }, {}, function (err, a) {
          if (err) {
            vm.$common.messageBox.showMessageBox(vm, '오류', '수정에 실패 하였습니다. 오류 : ' + err)
            return
          }

          vm.$common.messageBox.showMessageBox(vm, '성공', '사용자 정보가 수정되었습니다.').then((value) => {
            vm.$user.id = vm.user.id
            vm.$user.name = vm.user.name
            vm.$bus.$emit('LOGGED', 'SUCCESS')
          })
        })
      })
    }
  }
}
</script>

<style>

</style>