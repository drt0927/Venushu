<template>
  <div>
    <b-card bg-variant="light" class="my-2">
      <b-container fluid>
        <b-row class="my-1">
          <b-col cols="1">주문자명</b-col>
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
          <b-col cols="auto" class="p-1"><b-button to="/order/write" variant="success">등록</b-button></b-col>
        </b-row>
      </b-container>
      <b-table id="order-table" striped sticky-header="500px"
      :items="readOrder"
      :fields="fields"
      :busy.sync="pagination.isBusy"
      :per-page="pagination.perPage"
      :current-page="pagination.currentPage">
        <template v-slot:cell(namelink)="data">
          <router-link :to="`/customer/detail/${data.item.customerId}`">{{ data.item.name }}</router-link>
        </template>
        <template v-slot:cell(action)="data">
          <router-link :to="`/order/detail/${data.item._id}`">상세</router-link>
        </template>
        <template v-slot:cell(createDate)="data">
          {{ $moment(data.value).format('YYYY-MM-DD (dd)') }}
        </template>
      </b-table>
      <b-pagination v-model="pagination.currentPage" 
      :total-rows="pagination.totalRows"
      :per-page="pagination.perPage"
      aria-controls="order-table"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fields: [
        { key: 'namelink', label: '주문자명' },
        { key: 'deliveryStart', label: '출고일' },
        { key: 'deliveryCode', label: '송장번호' },
        { key: 'deliveryEnd', label: '배송 완료' },
        { key: 'createDate', label: '날짜' },
        { key: 'action', label: '상세' }
      ],
      search: {
        name: '',
        address: '',
        productCode: '',
        size: ''
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
    this.$bus.$emit('SET_MENU_NAVIGATE', [{ text: '주문장 관리', to: { path: '/order' } }])
  },
  methods: {
    tableReload () {
      this.$root.$emit('bv::refresh::table', 'order-table')
    },
    readOrder () {
      const vm = this
      let query = {}
      vm.pagination.isBusy = true

      if (vm.search.name) {
        query.name = new RegExp(vm.search.name)
      }

      return new Promise((resolve, reject) => {
        vm.$db.orderDatastore.count(query, (cntErr, count) => {
          if (cntErr) {
            vm.pagination.isBusy = false
            reject(cntErr)
          }

          vm.pagination.totalRows = count
          vm.$db.orderDatastore.find(query)
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