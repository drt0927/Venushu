<template>
  <div>
    <b-modal id="modal-search-customer" size="lg" title="고객 조회" ok-only ok-title="닫기"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      hide-footer>
      <b-container fluid>
        <b-card bg-variant="light" class="my-2">
          <b-container fluid>
            <b-row class="my-1">
              <b-col cols="2">이름</b-col>
              <b-col><b-input v-model="search.name" size="sm" @keyup.enter="tableReload"></b-input></b-col>
              <b-col cols="2">연락처</b-col>
              <b-col><b-input v-model="search.phone" size="sm" @keyup.enter="tableReload"></b-input></b-col>
            </b-row>
            <b-row class="my-1">
              <b-col cols="auto" class="mr-auto">
                <b-button @click="tableReload" size="sm">검색</b-button>
              </b-col>
              <b-col cols="auto">
                <b-button v-b-modal.modal-add-customer variant="success" size="sm">등록</b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
        <div>
          <b-table id="customer-table" striped sticky-header="500px"
          selectable
          @row-selected="onRowSelected"
          :items="readCustomer"
          :fields="fields"
          :busy.sync="pagination.isBusy"
          :per-page="pagination.perPage"
          :current-page="pagination.currentPage">
              <template v-slot:cell(phone)="data">
                {{ $common.masking.phone($crypto.decrypt(data.value)) }}
              </template>

              <template v-slot:cell(isNotify)="data">
                <b-check disabled v-model="data.value"></b-check>
              </template>
          </b-table>
          <b-pagination v-model="pagination.currentPage" 
          :total-rows="pagination.totalRows"
          :per-page="pagination.perPage"
          aria-controls="customer-table"
          ></b-pagination>
        </div>
      </b-container>
    </b-modal>
    <customer-add-modal @customer-added="customerAdded" :temp-name="search.name" :temp-phone="search.phone"></customer-add-modal>
  </div>
</template>

<script>
import CustomerAddModal from './CustomerAddModal'

export default {
  data () {
    return {
      fields: [
        { key: 'name', label: '이름' },
        { key: 'phone', label: '연락처' },
        { key: 'isNotify', label: '행사알림' },
        { key: 'address1', label: '주소' },
        { key: 'description', label: '설명' }
      ],
      search: {
        name: '',
        phone: ''
      },
      pagination: {
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        isBusy: false
      }
    }
  },
  components: {
    'customer-add-modal': CustomerAddModal
  },
  methods: {
    onRowSelected (items) {
      if (items.length > 0) {
        this.$emit('row-selected', items[0])
        this.$bvModal.hide('modal-search-customer')
      }
    },
    tableReload () {
      this.$root.$emit('bv::refresh::table', 'customer-table')
    },
    customerAdded () {
      this.tableReload()
    },
    readCustomer () {
      const vm = this
      let query = {}
      vm.pagination.isBusy = true

      if (vm.search.name) {
        query.name = new RegExp(vm.search.name)
      }
      if (vm.search.phone) {
        query.phone = vm.$crypto.encrypt(vm.search.phone)
      }
      return new Promise((resolve, reject) => {
        vm.$db.customerDatastore.count(query, (cntErr, count) => {
          if (cntErr) {
            vm.pagination.isBusy = false
            reject(cntErr)
          }

          vm.pagination.totalRows = count
          vm.$db.customerDatastore.find(query)
            .sort({ createDate: -1 })
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