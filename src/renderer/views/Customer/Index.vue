<template>
  <b-container fluid>
    <b-card bg-variant="light" class="my-2">
      <b-row class="my-1">
        <b-col cols="2">이름</b-col>
        <b-col cols="3"><b-input v-model="search.name" size="sm" @keyup.enter="tableReload"></b-input></b-col>
        <b-col cols="2">연락처</b-col>
        <b-col cols="3"><b-input v-model="search.phone" size="sm" @keyup.enter="tableReload"></b-input></b-col>
      </b-row>
      <b-row>
        <b-col cols="2">주소</b-col>
        <b-col cols="3"><b-input v-model="search.address" size="sm" @keyup.enter="tableReload"></b-input></b-col>
        <b-col cols="2">행사알림</b-col>
        <b-col cols="3">
          <b-select v-model="search.isNotify" size="sm" @keyup.enter="tableReload">
            <b-select-option :value="null">전체</b-select-option>
            <b-select-option value="1">수신</b-select-option>
            <b-select-option value="0">미수신</b-select-option>
          </b-select>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col cols="12">
          <b-button @click="tableReload" size="sm">검색</b-button>
        </b-col>
      </b-row>
    </b-card>
    <div>
      <b-container fluid>
      <b-row>
        <b-col cols="auto" class="mr-auto p-1"><span>개수 : {{ pagination.totalRows }} </span></b-col>
        <b-col cols="auto" class="p-1"><b-button v-b-modal.modal-add-customer variant="success" size="sm">등록</b-button></b-col>
      </b-row>
      </b-container>
      <b-table id="customer-table" striped sticky-header="500px"
      :items="readCustomer"
      :fields="fields"
      :busy.sync="pagination.isBusy"
      :per-page="pagination.perPage"
      :current-page="pagination.currentPage">
        <template v-slot:cell(namelink)="data">
          <router-link :to="`/customer/detail/${data.item._id}`">{{ data.item.name }}</router-link>
        </template>

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
    <customer-add-modal @customer-added="customerAdded"></customer-add-modal>
  </b-container>
</template>

<script>
import CustomerAddModal from '../../components/CustomerAddModal'

export default {
  data () {
    return {
      fields: [
        { key: 'namelink', label: '이름' },
        { key: 'phone', label: '연락처' },
        { key: 'isNotify', label: '행사알림' },
        { key: 'address1', label: '주소' },
        { key: 'description', label: '설명' }
      ],
      search: {
        name: '',
        phone: '',
        address: '',
        isNotify: null
      },
      pagination: {
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        isBusy: false
      }
    }
  },
  created () {
    this.$bus.$emit(this.$common.enum.emitMessage.SET_MENU_NAVIGATE, [{ text: '고객 관리', to: { path: '/customer' } }])
  },
  components: {
    'customer-add-modal': CustomerAddModal
  },
  methods: {
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
      if (vm.search.address) {
        query.$or = [
          { address1: new RegExp(vm.search.address) },
          { address2: new RegExp(vm.search.address) },
          { address3: new RegExp(vm.search.address) }
        ]
      }
      if (vm.search.phone) {
        query.phone = vm.$crypto.encrypt(vm.search.phone)
      }
      if (vm.search.isNotify) {
        query.isNotify = vm.search.isNotify === '1'
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
              console.log(rows)
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