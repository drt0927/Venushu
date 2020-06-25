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
            <b-input ref="old-password" type="password" v-model="password.oldPassword" size="sm" @keyup.enter="changePassword"></b-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col>새 비밀번호</b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-input ref="new-password" type="password" v-model="password.newPassword" size="sm" :state="validNewPassword" @keyup.enter="changePassword"></b-input>
            <b-form-invalid-feedback :state="validNewPassword">
              현재 비밀번호와 일치합니다. 다르게 설정해주세요.
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="validNewPassword"></b-form-valid-feedback>
          </b-col>
        </b-row>
        <b-row>
          <b-col>새 비밀번호 확인</b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-input ref="new-confirm-password" type="password" v-model="password.newConfirmPassword" size="sm" :state="validConfirmPassword" @keyup.enter="changePassword"></b-input>
            <b-form-invalid-feedback :state="validConfirmPassword">
              새 비밀번호와 일치하지 않습니다.
            </b-form-invalid-feedback>
            <b-form-valid-feedback :state="validConfirmPassword">
              새 비밀번호와 일치합니다.
            </b-form-valid-feedback>
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
  computed: {
    validConfirmPassword () {
      if (!this.password.newConfirmPassword) {
        return null
      }
      return this.password.newPassword === this.password.newConfirmPassword
    },
    validNewPassword () {
      if (!this.password.newPassword) {
        return null
      }
      return this.password.oldPassword !== this.password.newPassword
    }
  },
  methods: {
    changePassword () {
      const vm = this
      if (vm.password.newPassword !== vm.password.newConfirmPassword) {
        return
      }

      if (vm.password.oldPassword === vm.password.newPassword) {
        return
      }

      vm.$crypto.encryptSHA(vm.password.oldPassword)
        .then((key) => {
          vm.$db.userDatastore.find({ id: vm.$user.id, password: key })
            .exec((err, row) => {
              if (!err && row.length > 0) {
                vm.$crypto.encryptSHA(vm.password.newPassword)
                  .then((key) => {
                    vm.user.password = key

                    vm.$db.userDatastore.update({ _id: vm.$user.idx }, { $set: vm.user }, {}, function (err, a) {
                      if (err) {
                        vm.$common.messageBox.showMessageBox(vm, '오류', '수정에 실패 하였습니다. 오류 : ' + err)
                        return
                      }

                      vm.$common.messageBox.showMessageBox(vm, '성공', '사용자 정보가 수정되었습니다.')
                    })
                  })
              } else {
                vm.$common.messageBox.showMessageBox(vm, '오류', '현재 비밀번호가 틀렸습니다.')
              }
            })
        })
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