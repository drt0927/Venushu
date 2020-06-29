<template>
  <b-container fluid>
    <b-card bg-variant="light" class="my-2">
      <b-row class="my-1">
        <b-col cols="2">이름</b-col>
        <b-col cols="3"><b-input v-model="search.name" size="sm" @keyup.enter="tableReload"></b-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col cols="auto" class="mr-auto">
        </b-col>
        <b-col cols="auto">
          <b-button @click="tableReload" size="sm">검색</b-button>
        </b-col>
      </b-row>
    </b-card>
    <div>
      <b-container fluid>
      <b-row>
        <b-col cols="auto" class="mr-auto p-1"><span>개수 : {{ pagination.totalRows }} </span></b-col>
        <b-col cols="auto" class="p-1"><b-button v-b-modal.modal-add-store size="sm" variant="success">등록</b-button></b-col>
      </b-row>
      </b-container>
      <b-table id="store-table" striped sticky-header="500px"
      :items="readStore"
      :fields="fields"
      :busy.sync="pagination.isBusy"
      :per-page="pagination.perPage"
      :current-page="pagination.currentPage">
      <template v-slot:cell(btnModify)="row">
        <b-link @click="modifyModalOpen(row.item)">수정</b-link>
      </template>
      </b-table>
      <b-pagination v-model="pagination.currentPage" 
      :total-rows="pagination.totalRows"
      :per-page="pagination.perPage"
      aria-controls="store-table"
      ></b-pagination>
    </div>
    <store-add-modal @store-added="storeAdded"></store-add-modal>
    <b-modal id="modal-modify-store" ref="modal" title="지점 수정" size="lg"
      @ok="modifyStore" @hidden="modifyModalClose"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      footer-bg-variant="warning"
      footer-text-variant="dark">
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="2">이름</b-col>
          <b-col><b-input ref="name" size="sm" v-model="store.name"></b-input></b-col>
          <b-col cols="2">연락처</b-col>
          <b-col><b-input ref="contact" size="sm" v-model="store.contact"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="2">택배 코드</b-col>
          <b-col cols="4"><b-input ref="name" size="sm" v-model="store.deliveryCode"></b-input></b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-container fluid>
          <b-row>
            <b-col cols="auto" class="mr-auto">
              <b-button variant="danger" @click="deleteStore" size="sm">
                삭제
              </b-button>
            </b-col>
            <b-col cols="auto">
              <b-button variant="success" @click="ok()" size="sm">
                수정
              </b-button>
              <b-button @click="cancel()" size="sm">
                취소
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import StoreAddModal from '../../components/StoreAddModal'

export default {
  data () {
    return {
      fields: [
        { key: 'name', label: '이름' },
        { key: 'contact', label: '연락처' },
        { key: 'deliveryCode', label: '택배코드' },
        { key: 'btnModify', label: '수정' }
      ],
      store: {},
      search: {
        name: ''
      },
      pagination: {
        currentPage: 1,
        perPage: 15,
        totalRows: 0,
        isBusy: false
      },
      selectedStoreId: ''
    }
  },
  created () {
    this.$bus.$emit(this.$common.enum.emitMessage.SET_MENU_NAVIGATE, [{ text: '지점 관리', to: { path: '/store' } }])
  },
  components: {
    'store-add-modal': StoreAddModal
  },
  methods: {
    modifyStore (modalEvt) {
      const vm = this
      if (!vm.checkValidation()) {
        modalEvt.preventDefault()
        return
      }

      vm.$db.storeDatastore.update({ _id: vm.store._id }, { $set: vm.store }, {}, function (err, a) {
        if (err) {
          vm.$common.messageBox.showMessageBox(vm, '오류', '수정에 실패 하였습니다. 오류 : ' + err)
          return
        }
        vm.$common.messageBox.showMessageBox(vm, '성공', '지점 정보가 수정되었습니다.').then((value) => {
          vm.tableReload()
        })
      })
    },
    checkValidation () {
      const vm = this
      if (!vm.store.name) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '이름을 입력해주세요.')
        vm.$refs.name.$el.focus()
        return false
      }

      if (!vm.store.contact) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '연락처를 입력해주세요.')
        vm.$refs.contact.$el.focus()
        return false
      }

      return true
    },
    modifyModalOpen (row) {
      this.store = row
      this.$bvModal.show('modal-modify-store')
    },
    modifyModalClose () {
      this.store = {}
    },
    storeAdded () {
      this.tableReload()
    },
    tableReload () {
      this.$root.$emit('bv::refresh::table', 'store-table')
    },
    deleteStore () {
      const vm = this
      vm.$common.messageBox.showConfirmBox(vm, '확인', '정말로 삭제하시겠습니까?', '삭제', '취소', 'danger')
        .then((value) => {
          if (value) {
            vm.$db.storeDatastore.remove({ _id: vm.store._id }, {}, function (err, numRemoved) {
              if (err) {
                vm.$common.messageBox.showMessageBox(vm, '오류', '삭제에 실패 하였습니다. 오류 : ' + err)
                return
              }
              vm.$common.messageBox.showMessageBox(vm, '성공', '지점이 삭제되었습니다.').then((value) => {
                vm.$bvModal.hide('modal-modify-store')
                vm.$root.$emit('bv::refresh::table', 'store-table')
              })
            })
          }
        })
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
            .sort({ name: 1 })
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