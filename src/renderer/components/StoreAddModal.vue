<template>
  <div>
    <b-modal id="modal-add-store" ref="modal" title="지점 등록" size="lg"
      @ok="writeStore" @shown="modalShown"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      footer-bg-variant="warning"
      footer-text-variant="dark">
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="2">이름</b-col>
          <b-col><b-input ref="name" v-model="form.name" size="sm"></b-input></b-col>
          <b-col cols="2">연락처</b-col>
          <b-col><b-input ref="contact" v-model="form.contact" size="sm"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="2">택배 코드</b-col>
          <b-col cols="4"><b-input ref="delivery-code" v-model="form.deliveryCode" size="sm"></b-input></b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-container fluid>
          <b-row>
            <b-col cols="auto" class="mr-auto">
              <b-button variant="success" @click="ok()" size="sm">
                등록
              </b-button>
              <b-button @click="cancel()" size="sm">
                취소
              </b-button>
            </b-col>
            <b-col cols="auto">
            </b-col>
          </b-row>
        </b-container>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        contact: '',
        deliveryCode: ''
      }
    }
  },
  props: [ 'tempName' ],
  methods: {
    writeStore (modalEvt) {
      const vm = this
      if (!vm.checkValidation()) {
        modalEvt.preventDefault()
        return
      }

      vm.$db.storeDatastore.insert({
        name: vm.form.name,
        contact: vm.form.contact,
        deliveryCode: vm.form.deliveryCode,
        createDate: new Date()
      },
      function (err) {
        if (!err) {
          vm.$emit('store-added', 'success')
        }
        vm.clearStoreForm()
        vm.$bvModal.hide('modal-add-store')
      })
    },
    checkValidation () {
      const vm = this
      if (!vm.form.name) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '이름을 입력해주세요.')
        vm.$refs.name.$el.focus()
        return false
      }

      return true
    },
    clearStoreForm () {
      this.form.name = ''
      this.form.contact = ''
      this.form.deliveryCode = ''
    },
    modalShown () {
      this.$refs.name.$el.focus()
      this.form.name = this.$user.name
      this.clearStoreForm()
      this.form.name = this.tempName
    }
  }
}
</script>

<style>

</style>