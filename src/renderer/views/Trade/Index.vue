<template>
  <b-container fluid>
    <b-card bg-variant="light" class="my-2">
      <b-container fluid>
        <b-row class="my-1">
          <b-col>구분</b-col>
          <b-col cols="3">
            <b-select v-model="search.isConfirm" @keyup.enter="tableReload">
              <b-select-option :value="null">전체</b-select-option>
              <b-select-option value="0">입고</b-select-option>
              <b-select-option value="1">출고</b-select-option>
            </b-select>
          </b-col>
          <b-col>매장</b-col>
          <b-col cols="3"><b-input v-model="search.storeText" @keyup.enter="tableReload"></b-input></b-col>
          <b-col>품번</b-col>
          <b-col cols="3"><b-input v-model="search.productCode" @keyup.enter="tableReload"></b-input></b-col>
        </b-row>
        <b-row>
          <b-col cols="1">확정여부</b-col>
          <b-col cols="3">
            <b-select v-model="search.isConfirm" @keyup.enter="tableReload">
              <b-select-option :value="null">전체</b-select-option>
              <b-select-option value="1">확정</b-select-option>
              <b-select-option value="0">미확정</b-select-option>
            </b-select>
          </b-col>
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
        <b-col cols="auto" class="p-1"><b-button v-b-modal.modal-add-trade variant="success">등록</b-button></b-col>
      </b-row>
      </b-container>
      <b-table id="trade-table" hover sticky-header="500px"
      :items="readTrade"
      :fields="fields"
      :busy.sync="pagination.isBusy"
      :per-page="pagination.perPage"
      :current-page="pagination.currentPage">
      <template v-slot:cell(createDate)="data">
        {{ $moment(data.value).format('YYYY-MM-DD') }}
      </template>
      <template v-slot:cell(inOutDate)="data">
        {{ $moment(data.value).format('YYYY-MM-DD') }}
      </template>
      <template v-slot:cell(isConfirm)="data">
        <b-check v-model="data.value" disabled></b-check>
      </template>
      <template v-slot:cell(inOut)="data">
        {{ data.value === 0 ? "입고" : "출고" }}
      </template>
      </b-table>
      <b-pagination v-model="pagination.currentPage" 
      :total-rows="pagination.totalRows"
      :per-page="pagination.perPage"
      aria-controls="trade-table"
      ></b-pagination>
    </div>
    <b-modal id="modal-add-trade" ref="modal" title="수평 이동 등록" size="lg"
      @ok="writeTrade" @shown="modalShown"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      footer-bg-variant="warning"
      footer-text-variant="dark">
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="1">품번</b-col>
          <b-col><b-input ref="product-code" v-model="form.productCode"></b-input></b-col>
          <b-col cols="1">수량</b-col>
          <b-col><b-input ref="count" v-model="form.count"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="1">매장</b-col>
          <b-col>
            <b-input-group>
              <b-input ref="store-text" v-model="form.storeText" disabled></b-input>
              <input type="hidden" ref="store-id" v-model="form.storeId"/>
              <b-input-group-append>
                <b-button variant="outline-success" @click="storeSearch()">검색</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col cols="1">입/출고일</b-col>
          <b-col><b-datepicker ref="in-out-date" v-model="form.inOutDate" locale="ko"></b-datepicker></b-col>
        </b-row>
        <b-row>
          <b-col cols="1">구분</b-col>
          <b-col>
            <b-select ref="in-out" v-model="form.inOut" @keyup.enter="tableReload">
              <b-select-option value="0">입고</b-select-option>
              <b-select-option value="1">출고</b-select-option>
            </b-select>
          </b-col>
          <b-col cols="1">확정처리</b-col>
          <b-col><b-check ref="is-confirm" v-model="form.isConfirm"></b-check></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="1">비고</b-col>
          <b-col><b-input ref="description" v-model="form.description"></b-input></b-col>
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
    <store-search-modal @row-selected="storeSelected"></store-search-modal>
  </b-container>
</template>

<script>
import StoreSearchModal from '../../components/StoreSearchModal'

export default {
  data () {
    return {
      form: {
        productCode: '',
        count: '',
        storeText: '',
        storeId: '',
        inOutDate: new Date(),
        inOut: 0, // [ 0 - 입고 | 1 - 출고 ]
        isConfirm: false,
        description: ''
      },
      fields: [
        { key: 'createDate', label: '등록일' },
        { key: 'productCode', label: '품번' },
        { key: 'count', label: '수량' },
        { key: 'storeText', label: '매장' },
        { key: 'inOutDate', label: '입/출고일' },
        { key: 'inOut', label: '구분' },
        { key: 'isConfirm', label: '확정처리' }
      ],
      search: {
        inOut: null,
        storeText: '',
        productCode: '',
        isConfirm: null
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
    this.$bus.$emit('SET_MENU_NAVIGATE', [{ text: '수평 이동', to: { path: '/trade' } }])
  },
  components: {
    'store-search-modal': StoreSearchModal
  },
  methods: {
    writeTrade (modalEvt) {
      const vm = this
      if (!vm.checkValidation()) {
        modalEvt.preventDefault()
        return
      }

      vm.$db.tradeDatastore.insert({
        productCode: vm.form.productCode,
        count: vm.form.count,
        storeText: vm.form.storeText,
        storeId: vm.form.storeId,
        inOutDate: vm.form.inOutDate,
        inOut: vm.form.inOut, // [ 0 - 입고 | 1 - 출고 ]
        isConfirm: vm.form.isConfirm,
        description: vm.form.description,
        createDate: new Date()
      },
      function (err) {
        if (!err) {
          vm.tableReload()
        }
        vm.clearTradeForm()
        vm.$bvModal.hide('modal-add-trade')
      })
    },
    storeSearch () {
      this.$bvModal.show('modal-search-store')
    },
    storeSelected (item) {
      console.log(item)
      this.form.storeText = item.name
      this.form.storeId = item._id
    },
    checkValidation () {
      const vm = this
      if (!vm.form.productCode) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '품번을 입력해주세요.')
        vm.$refs['product-code'].$el.focus()
        return false
      }

      if (!vm.form.count) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '수량을 입력해주세요.')
        vm.$refs.count.$el.focus()
        return false
      }

      if (!vm.form.storeId) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '매장을 입력해주세요.')
        vm.$refs['store-text'].$el.focus()
        return false
      }

      if (!vm.form.inOutDate) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '입/출고일을 입력해주세요.')
        vm.$refs['in-out-date'].$el.focus()
        return false
      }

      return true
    },
    clearTradeForm () {
      this.form.productCode = ''
      this.form.count = ''
      this.form.storeText = ''
      this.form.storeId = ''
      this.form.inOutDate = new Date()
      this.form.inOut = 0
      this.form.isConfirm = false
      this.form.description = ''
    },
    modalShown () {
      this.$refs['product-code'].$el.focus()
      this.clearTradeForm()
    },
    tableReload () {
      this.$root.$emit('bv::refresh::table', 'trade-table')
    },
    readTrade () {
      const vm = this
      let query = {}
      vm.pagination.isBusy = true
      if (vm.search.inOut) {
        query.inOut = vm.search.inOut
      }
      if (vm.search.storeText) {
        query.storeText = new RegExp(vm.search.storeText)
      }
      if (vm.search.productCode) {
        query.productCode = new RegExp(vm.search.productCode)
      }
      if (vm.search.isConfirm) {
        query.isConfirm = vm.search.isConfirm
      }

      return new Promise((resolve, reject) => {
        vm.$db.tradeDatastore.count(query, (cntErr, count) => {
          if (cntErr) {
            vm.pagination.isBusy = false
            reject(cntErr)
          }

          vm.pagination.totalRows = count
          vm.$db.tradeDatastore.find(query)
            .sort({ createDate: 1 })
            .skip((vm.pagination.currentPage - 1) * vm.pagination.perPage)
            .limit(vm.pagination.perPage)
            .exec((err, rows) => {
              if (err) {
                vm.pagination.isBusy = false
                reject(err)
              }
              vm.pagination.isBusy = false
              rows.forEach(row => {
                row._rowVariant = row.isConfirm ? 'trade-confirm' : row.inOut === 0 ? 'trade-in' : 'trade-out'
              })
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