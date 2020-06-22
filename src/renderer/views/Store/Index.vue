<template>
  <b-container fluid>
    <b-card bg-variant="light" class="my-2">
      <b-container fluid>
        <b-row class="my-1">
          <b-col cols="1">이름</b-col>
          <b-col cols="3"><b-input v-model="search.name" @keyup.enter="tableReload"></b-input></b-col>
        </b-row>
        <b-row class="my-1">
          <b-col cols="12">
            <b-button @click="tableReload">검색</b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
    <div>
      <b-container fluid>
      <b-row>
        <b-col cols="auto" class="mr-auto p-1"><span>개수 : {{ pagination.totalRows }} </span></b-col>
        <b-col cols="auto" class="p-1"><b-button v-b-modal.modal-add-store variant="success">등록</b-button></b-col>
      </b-row>
      </b-container>
      <b-table id="store-table" striped sticky-header="500px"
      :items="readStore"
      :fields="fields"
      :busy.sync="pagination.isBusy"
      :per-page="pagination.perPage"
      :current-page="pagination.currentPage">
      </b-table>
      <b-pagination v-model="pagination.currentPage" 
      :total-rows="pagination.totalRows"
      :per-page="pagination.perPage"
      aria-controls="store-table"
      ></b-pagination>
    </div>
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
          <b-col cols="1">이름</b-col>
          <b-col><b-input ref="name" v-model="form.name"></b-input></b-col>
          <b-col cols="2">연락처</b-col>
          <b-col><b-input ref="contact" v-model="form.contact"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="1">택배 코드</b-col>
          <b-col cols="3"><b-input ref="name" v-model="form.deliveryCode"></b-input></b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button variant="success" @click="ok()">
          등록
        </b-button>
        <b-button variant="danger" @click="cancel()">
          취소
        </b-button>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        contact: '',
        deliveryCode: ''
      },
      fields: [
        { key: 'name', label: '이름' },
        { key: 'contact', label: '연락처' },
        { key: 'deliveryCode', label: '택배코드' }
      ],
      search: {
        name: ''
      },
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        isBusy: false
      }
    }
  },
  created () {
    this.$bus.$emit('SET_MENU_NAVIGATE', [{ text: '지점 관리', to: { path: '/store' } }])
  },
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
          vm.tableReload()
        }
        vm.clearBoardForm()
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

      if (!vm.form.contact) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '연락처를 입력해주세요.')
        vm.$refs.contact.$el.focus()
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
      this.$refs.title.$el.focus()
      this.form.name = this.$user.name
      this.clearStoreForm()
    },
    tableReload () {
      this.$root.$emit('bv::refresh::table', 'store-table')
    },
    readStore () {
      const vm = this
      let query = {}
      vm.pagination.isBusy = true

      if (vm.search.name) {
        query.name = new RegExp(vm.search.name)
      }

      return new Promise((resolve, reject) => {
        vm.$db.storeDatastore.count(query, (cntErr, count) => {
          if (cntErr) {
            vm.pagination.isBusy = false
            reject(cntErr)
          }

          vm.pagination.totalRows = count
          vm.$db.storeDatastore.find(query)
            .sort({ createDate: 1 })
            .skip((vm.pagination.currentPage - 1) * vm.pagination.perPage)
            .limit(vm.pagination.perPage)
            .exec((err, rows) => {
              if (err) {
                vm.pagination.isBusy = false
                reject(err)
              }
              vm.pagination.isBusy = false
              resolve(rows)
            })
        })
      })
    }
  }
}
</script>

<style>

</style>