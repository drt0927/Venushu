<template>
  <b-container fluid>
    <b-row class="my-2">
      <b-col>이름</b-col>
      <b-col cols="3"><b-input v-model="customer.name"></b-input></b-col>
      <b-col>연락처</b-col>
      <b-col cols="3">
        <b-input-group>
          <b-input v-model="phone" disabled></b-input>
          <b-input-group-append>
            <b-button variant="outline-warning" v-b-modal.modal-update-phone>변경</b-button>
            <b-button variant="outline-primary" v-b-modal.modal-open-phone>조회</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col>행사알림</b-col>
      <b-col cols="3"><b-checkbox v-model="customer.isNotify"></b-checkbox></b-col>
    </b-row>
    <b-row class="my-2">
      <b-col>주소1</b-col>
      <b-col cols="7">
        <b-input-group>
          <b-input v-model="customer.address1"></b-input>
          <b-input-group-append>
            <b-button variant="outline-success" @click="addrSearch('address1')">주소검색</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
      <b-col>생성일</b-col>
      <b-col cols="3"><b-input v-model="createDate" disabled></b-input></b-col>
    </b-row>
    <b-row class="my-2">
      <b-col cols="1">주소2</b-col>
      <b-col cols="7">
        <b-input-group>
          <b-input v-model="customer.address2"></b-input>
          <b-input-group-append>
            <b-button variant="outline-success" @click="addrSearch('address2')">주소검색</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row class="my-2">
      <b-col cols="1">주소3</b-col>
      <b-col cols="7">
        <b-input-group>
          <b-input v-model="customer.address3"></b-input>
          <b-input-group-append>
            <b-button variant="outline-success" @click="addrSearch('address3')">주소검색</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row class="my-2">
      <b-col cols="1">설명</b-col>
      <b-col cols="7"><b-input v-model="customer.description"></b-input></b-col>
      <b-col cols="4">
        <b-button variant="primary" @click="updateCustomer">수정</b-button>
        <b-button variant="info" @click="goIndex">목록</b-button>
        <b-button variant="danger" @click="deleteCustomer">삭제</b-button>
      </b-col>
    </b-row>
    <div ref="daum-area" class="daum-layer-background">
      <div class="daum-wrapper">
        <b-icon-x class="daum-layer-close" @click="addrSearchClose"></b-icon-x>
        <vue-daum-postcode style="margin-top:25px;" @complete="addrSearchComplete" />
      </div>
    </div>
    <b-modal id="modal-open-phone" ref="modal" title="연락처 조회"
      @shown="openPhoneModalShown" @hidden="openPhoneModalClose"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      footer-bg-variant="warning"
      footer-text-variant="dark">
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="3">연락처</b-col>
          <b-col><b-input ref="phone" v-model="nonMaskingPhone" disabled></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">비밀번호</b-col>
          <b-col><b-input ref="open-password" type="password" @keyup.enter="openPhone"></b-input></b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer="{ cancel }">
        <b-button variant="success" @click="openPhone">
          조회
        </b-button>
        <b-button variant="danger" @click="cancel()">
          닫기
        </b-button>
      </template>
    </b-modal>
    <b-modal id="modal-update-phone" ref="modal" title="연락처 변경"
      @shown="changePhoneModalShown" @hidden="changePhoneModalClose"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      footer-bg-variant="warning"
      footer-text-variant="dark">
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="3">연락처</b-col>
          <b-col><b-input ref="new-phone" v-model="newPhone" @keyup.enter="changePhone"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">비밀번호</b-col>
          <b-col><b-input ref="change-password" type="password" @keyup.enter="changePhone"></b-input></b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="success" @click="changePhone">
          변경
        </b-button>
        <b-button variant="danger" @click="cancel()">
          닫기
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      customer: {},
      newPhone: '',
      selectedAddressId: '',
      nonMaskingPhone: ''
    }
  },
  computed: {
    phone () {
      return this.$common.masking.phone(this.$crypto.decrypt(this.customer.phone))
    },
    createDate () {
      return this.$moment(this.customer.createDate).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted () {
    const vm = this
    vm.$db.customerDatastore.find({ _id: this.$route.params.id }, (err, row) => {
      if (err || row.length < 1) {
        vm.goIndex()
      }
      vm.customer = row[0]
    })
  },
  methods: {
    addrSearch (id) {
      this.selectedAddressId = id
      this.$refs['daum-area'].style.display = 'block'
    },
    addrSearchClose () {
      this.selectedAddressId = ''
      this.$refs['daum-area'].style.display = 'none'
    },
    addrSearchComplete (addr) {
      let resultAddr = addr.roadAddress
      if (addr.buildingName) {
        resultAddr += ` (${addr.buildingName})`
      }
      this.customer[this.selectedAddressId] = resultAddr
      this.addrSearchClose()
    },
    goIndex () {
      location.href = '#/customer'
    },
    deleteCustomer () {
      const vm = this
      vm.showConfirmBox('확인', '정말로 삭제하시겠습니까?')
        .then((value) => {
          if (value) {
            vm.$db.customerDatastore.remove({ _id: vm.$route.params.id }, {}, function (err, numRemoved) {
              if (err) {
                vm.showMessageBox('오류', '삭제에 실패 하였습니다. 오류 : ' + err)
                return
              }
              vm.showMessageBox('성공', '사용자 정보가 삭제되었습니다.').then((value) => {
                vm.goIndex()
              })
            })
          }
        })
    },
    updateCustomer () {
      const vm = this
      vm.$db.customerDatastore.update({ _id: vm.$route.params.id }, { $set: vm.customer }, {}, function (err, a) {
        if (err) {
          vm.showMessageBox('오류', '수정에 실패 하였습니다. 오류 : ' + err)
          return
        }
        vm.showMessageBox('성공', '사용자 정보가 수정되었습니다.').then((value) => {
          location.reload()
        })
      })
    },
    showMessageBox (title, message) {
      return new Promise((resolve, reject) => {
        this.$bvModal.msgBoxOk(message, {
          title: title,
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'success',
          headerClass: 'p-2 border-bottom-0',
          footerClass: 'p-2 border-top-0',
          centered: true
        })
          .then((value) => {
            resolve(value)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    showConfirmBox (title, message) {
      return new Promise((resolve, reject) => {
        this.$bvModal.msgBoxConfirm(message, {
          title: title,
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: '삭제',
          cancelTitle: '취소',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            resolve(value)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    openPhone () {
      if (this.$refs['open-password'].$el.value === '1234') {
        this.nonMaskingPhone = this.$crypto.decrypt(this.customer.phone)
      } else {
        this.showMessageBox('오류', '비밀번호가 일치하지 않습니다.')
      }
    },
    openPhoneModalShown () {
      this.nonMaskingPhone = this.$common.masking.phone(this.$crypto.decrypt(this.customer.phone))
    },
    openPhoneModalClose () {
      this.nonMaskingPhone = ''
    },
    changePhone () {
      const vm = this
      if (vm.$refs['change-password'].$el.value === '1234') {
        if (!vm.newPhone) {
          vm.showMessageBox('필수 항목 누락', '새로운 연락처을 입력해주세요.')
            .then(() => {
              vm.$refs['new-phone'].$el.focus()
            })
          return
        }

        if (!vm.$common.check.phone(vm.newPhone)) {
          vm.showMessageBox('필수 항목 오류', '핸드폰 번호 형식이 올바르지 않습니다. 숫자 10~11자리 입니다.')
            .then(() => {
              vm.$refs['new-phone'].$el.focus()
            })
          return
        }

        vm.$db.customerDatastore.update({ _id: vm.$route.params.id }, { $set: { phone: vm.$crypto.encrypt(vm.newPhone) } }, {}, function (err, a) {
          if (err) {
            vm.showMessageBox('오류', '수정에 실패 하였습니다. 오류 : ' + err)
            return
          }
          vm.showMessageBox('성공', '연락처가 수정되었습니다.').then((value) => {
            location.reload()
          })
        })
      } else {
        vm.showMessageBox('오류', '비밀번호가 일치하지 않습니다.')
      }
    },
    changePhoneModalShown () {
      this.newPhone = ''
      this.$refs['new-phone'].$el.focus()
    },
    changePhoneModalClose () {
      this.newPhone = ''
    }
  }
}
</script>

<style>

</style>