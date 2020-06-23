<template>
  <div>
    <b-modal id="modal-add-customer" ref="modal" title="고객 등록" size="lg"
      @ok="writeCustomer" @shown="modalShown"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      footer-bg-variant="warning"
      footer-text-variant="dark">
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="3">이름</b-col>
          <b-col><b-input ref="name" size="sm" v-model="form.name" @keyup.enter="writeCustomer"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">연락처</b-col>
          <b-col><b-input ref="phone" size="sm" v-model="form.phone" @keyup.enter="writeCustomer"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">주소(1)</b-col>
          <b-col>
            <b-input-group>
              <b-input v-model="form.address1" size="sm" @keyup.enter="writeCustomer"></b-input>
              <b-input-group-append>
                <b-button variant="outline-success" size="sm" @click="addrSearch('address1')">주소검색</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">주소(2)</b-col>
          <b-col>
            <b-input-group>
              <b-input v-model="form.address2" size="sm" @keyup.enter="writeCustomer"></b-input>
              <b-input-group-append>
                <b-button variant="outline-success" size="sm" @click="addrSearch('address2')">주소검색</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">주소(3)</b-col>
          <b-col>
            <b-input-group>
              <b-input v-model="form.address3" size="sm" @keyup.enter="writeCustomer"></b-input>
              <b-input-group-append>
                <b-button variant="outline-success" size="sm" @click="addrSearch('address3')">주소검색</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">행사알림</b-col>
          <b-col><b-check type="checkbox" v-model="form.isNotify" @keyup.enter="writeCustomer"></b-check></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">설명</b-col>
          <b-col><b-input v-model="form.description" size="sm" @keyup.enter="writeCustomer"></b-input></b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="success" size="sm" @click="ok()">
          등록
        </b-button>
        <b-button variant="danger" size="sm" @click="cancel()">
          취소
        </b-button>
      </template>
    </b-modal>
    <div ref="daum-area" class="daum-layer-background">
      <div class="daum-wrapper">
        <b-icon-x class="daum-layer-close" @click="addrSearchClose"></b-icon-x>
        <vue-daum-postcode style="margin-top:25px;" @complete="addrSearchComplete" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        phone: '',
        address1: '',
        address2: '',
        address3: '',
        isNotify: false,
        description: ''
      },
      selectedAddressId: ''
    }
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
      this.form[this.selectedAddressId] = resultAddr
      this.addrSearchClose()
    },
    writeCustomer (modalEvt) {
      const vm = this
      if (!vm.checkValidation()) {
        modalEvt.preventDefault()
        return
      }

      vm.$db.customerDatastore.insert({
        name: vm.form.name,
        phone: vm.$crypto.encrypt(vm.form.phone),
        address1: vm.form.address1,
        address2: vm.form.address2,
        address3: vm.form.address3,
        isNotify: vm.form.isNotify,
        description: vm.form.description,
        createDate: new Date()
      },
      function (err) {
        if (!err) {
          vm.$emit('customer-added', 'success')
        }
        vm.clearCustomerForm()
        vm.$bvModal.hide('modal-add-customer')
      })
    },
    clearCustomerForm () {
      this.form.name = ''
      this.form.phone = ''
      this.form.address1 = ''
      this.form.address2 = ''
      this.form.address3 = ''
      this.form.isNotify = false
      this.form.description = ''
    },
    modalShown () {
      this.$refs.name.$el.focus()
      this.clearCustomerForm()
    },
    checkValidation () {
      const vm = this
      if (!vm.form.name) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '이름을 입력해주세요.')
        vm.$refs.name.$el.focus()
        return false
      }

      if (!vm.form.phone) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '연락처을 입력해주세요.')
        vm.$refs.phone.$el.focus()
        return false
      }

      if (!vm.$common.check.phone(vm.form.phone)) {
        vm.$common.messageBox.showToast(vm, '필수 항목 오류', '핸드폰 번호 형식이 올바르지 않습니다. 숫자 10~11자리 입니다.')
        vm.$refs.phone.$el.focus()
        return false
      }

      return true
    }
  }
}
</script>

<style>

</style>