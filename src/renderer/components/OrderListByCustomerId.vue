<template>
  <div>
    <b-table id="order-table" striped sticky-header="500px"
    caption-top
      :items="readOrder"
      :fields="fields"
      :busy.sync="pagination.isBusy"
      :per-page="pagination.perPage"
      :current-page="pagination.currentPage">
        <template v-slot:table-caption>
          <b-container fluid>
            <b-row>
              <b-col cols="auto" class="mr-auto" style="padding-left: 0px;">주문장 리스트</b-col>
              <b-col cols="auto" class="" style="padding-right: 0px;">개수 : {{ pagination.totalRows }}</b-col>
            </b-row>
          </b-container>
        </template>
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
      items: [],
      pagination: {
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        isBusy: false
      }
    }
  },
  props: [ 'customerId' ],
  methods: {
    tableReload () {
      this.$root.$emit('bv::refresh::table', 'customer-table')
    },
    readOrder () {
      const vm = this
      let query = {}
      vm.pagination.isBusy = true

      query.customerId = vm.customerId
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