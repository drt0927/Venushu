<template>
  <div>
    <b-container fluid class="my-2">
      <b-jumbotron header="Venushu" lead="용인 롯데 비너스 오프라인 매장 관리 프로그램 v1.0.0">
        <p>고객, 거래처, 스케쥴, 주문장, 네이버 배송, 수평이동 관리 및 공지사항 기능을 제공합니다.</p>
        <p><b>무단 배포 환영!!</b> 단, <b>매니저 승인 후</b> 배포 가능합니다.</p>
        <p>프로그램 처음 실행 후 <b>관리자 계정 및 기본 설정</b>을 만들기 위한 단계 입니다.</p>
        <p>Copyright(C) 2020. filbert. All rights reserved.</p>
      </b-jumbotron>
    </b-container>
    <b-container fluid>
      <b-container class="form-wrapper">
        <b-row class="my-3">
          <b-col>
            <b-input v-model="id" ref="id" placeholder="ID" style="width:300px;" disabled></b-input>
          </b-col>
        </b-row>
        <b-row class="my-3">
          <b-col>
            <b-input v-model="password" ref="password" type="password" placeholder="Password" style="width:300px;" @keyup.enter="adminCreate"></b-input>
          </b-col>
        </b-row>
        <b-row class="my-3">
          <b-col>
            <b-input v-model="name" ref="name" placeholder="이름" style="width:300px;" @keyup.enter="adminCreate"></b-input>
          </b-col>
        </b-row>
        <b-row class="my-3">
          <b-col>
            <b-input v-model="storeName" ref="store-name" placeholder="매장명" style="width:300px;" @keyup.enter="adminCreate"></b-input>
          </b-col>
        </b-row>
        <b-row class="my-3">
          <b-col>
            <b-button variant="success" style="width:300px;" @click="adminCreate">생성</b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: 'admin',
      password: '',
      name: '',
      storeName: ''
    }
  },
  mounted () {
    const vm = this
    vm.$db.userDatastore.count({}, (cntErr, count) => {
      if (cntErr) {
        vm.$common.messageBox.showMessageBox(vm, '오류', '초기화 실패. 오류 : ' + cntErr)
        return
      }
      if (count > 0) {
        vm.$router.push({ path: '/user/login' })
      }
    })
  },
  methods: {
    adminCreate () {
      const vm = this
      if (!vm.checkValidation()) {
        return
      }

      vm.$common.messageBox.showConfirmBox(vm, '확인', '정말 생성하시겠습니까?', '생성', '취소', 'success')
        .then((value) => {
          if (!value) {
            return
          }

          vm.$crypto.encryptSHA(vm.password)
            .then((key) => {
              vm.$db.userDatastore.insert({
                id: vm.id,
                password: key,
                name: vm.name
              },
              (err) => {
                if (err) {
                  vm.$common.messageBox.showMessageBox(vm, '오류', '생성에 실패하였습니다. 오류 : ' + err)
                }
                vm.$router.push({ path: '/user/login' })
              })
            })
            .catch((err) => {
              console.log(err)
            })
          vm.$db.localDatastore.insert({
            name: vm.storeName
          },
          (err) => {
            if (err) {
              vm.$common.messageBox.showMessageBox(vm, '오류', '생성에 실패하였습니다. 오류 : ' + err)
            }
          })
        })
    },
    checkValidation () {
      const vm = this
      if (!vm.id) {
        vm.$common.messageBox.showMessageBox(vm, '필수 항목 누락', 'ID를 입력해주세요.')
        vm.$refs.phone.$el.focus()
        return false
      }

      if (!vm.password) {
        vm.$common.messageBox.showMessageBox(vm, '필수 항목 누락', 'Password를 입력해주세요.')
        vm.$refs.phone.$el.focus()
        return false
      }

      if (!vm.name) {
        vm.$common.messageBox.showMessageBox(vm, '필수 항목 누락', '이름을 입력해주세요.')
        vm.$refs.name.$el.focus()
        return false
      }

      if (!vm.storeName) {
        vm.$common.messageBox.showMessageBox(vm, '필수 항목 누락', '매장명을 입력해주세요.')
        vm.$refs['store-name'].$el.focus()
        return false
      }

      return true
    }
  }
}
</script>

<style>
.form-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
}
</style>