<template>
  <b-container fluid>
    <b-card bg-variant="light" class="my-2">
      <b-row class="my-1">
        <b-col cols="2">주문자명</b-col>
        <b-col cols="3"><b-input v-model="search.name" size="sm" @keyup.enter="tableReload"></b-input></b-col>
        <b-col cols="2">완료</b-col>
        <b-col cols="3">
          <b-select v-model="search.isDeliveryEnd" size="sm" @keyup.enter="tableReload">
            <b-select-option :value="null">전체</b-select-option>
            <b-select-option :value="true">완료</b-select-option>
            <b-select-option :value="false">미완료</b-select-option>
          </b-select>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col cols="2">등록일</b-col>
        <b-col cols="3"><b-datepicker v-model="search.createDate" size="sm" locale="ko" reset-button></b-datepicker></b-col>
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
          <b-col cols="auto" class="p-1"><b-button to="/order/write" variant="success" size="sm">등록</b-button></b-col>
        </b-row>
      </b-container>
      <b-table id="order-table" striped sticky-header="500px"
      :items="readOrder"
      :fields="fields"
      :busy.sync="pagination.isBusy"
      :per-page="pagination.perPage"
      :current-page="pagination.currentPage">
        <template v-slot:cell(action)="data">
          <router-link :to="`/order/detail/${data.item._id}`">상세</router-link>
        </template>
        <template v-slot:cell(productCodes)="row">
          <ul style="margin-bottom:0; padding-left:0;">
            <li v-for="product in row.item.products" v-bind:key="product.code" style="display:block;">
              {{product.code}} ({{product.count}}) - {{product.description}}
            </li>
          </ul>
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
  </b-container>
</template>

<script>
export default {
  data () {
    return {
      fields: [
        { key: 'createDate', label: '날짜' },
        { key: 'name', label: '주문자명' },
        { key: 'productCodes', label: '품번' },
        { key: 'deliveryStart', label: '출고일' },
        // { key: 'deliveryCode', label: '송장번호' },
        // { key: 'deliveryEnd', label: '배송 완료' },
        { key: 'action', label: '상세' }
      ],
      search: {
        name: '',
        isDeliveryEnd: null,
        createDate: null
      },
      pagination: {
        currentPage: 1,
        perPage: 15,
        totalRows: 0,
        isBusy: false
      }
    }
  },
  created () {
    this.$bus.$emit(this.$common.enum.emitMessage.SET_MENU_NAVIGATE, [{ text: '주문장 관리', to: { path: '/order' } }])
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

      if (vm.search.isDeliveryEnd !== null) {
        if (vm.search.isDeliveryEnd) {
          query.deliveryEnd = { $ne: null }
        } else {
          query.deliveryEnd = { $in: [null] }
        }
      }

      if (vm.search.createDate) {
        query.createDate = {
          $gte: new Date(vm.$moment(vm.search.createDate).format('YYYY-MM-DD') + ' 00:00:00'),
          $lte: new Date(vm.$moment(vm.search.createDate).format('YYYY-MM-DD') + ' 23:59:59')
        }
      }
      console.log(query)

      return new Promise((resolve, reject) => {
        vm.$db.orderDatastore.count(query, (cntErr, count) => {
          if (cntErr) {
            vm.pagination.isBusy = false
            reject(cntErr)
          }

          vm.pagination.totalRows = count
          vm.$db.orderDatastore.find(query)
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