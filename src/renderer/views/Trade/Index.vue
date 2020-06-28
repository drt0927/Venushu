<template>
  <b-container fluid>
    <b-card bg-variant="light">
      <b-row class="my-1">
        <b-col cols="2">구분</b-col>
        <b-col cols="3">
          <b-select v-model="search.inOut" size="sm" @keyup.enter="tableReload">
            <b-select-option :value="null">전체</b-select-option>
            <b-select-option :value="10">입고</b-select-option>
            <b-select-option :value="20">출고</b-select-option>
          </b-select>
        </b-col>
        <b-col cols="2">확정여부</b-col>
        <b-col cols="3">
          <b-select v-model="search.isConfirm" size="sm" @keyup.enter="tableReload">
            <b-select-option :value="null">전체</b-select-option>
            <b-select-option :value="true">확정</b-select-option>
            <b-select-option :value="false">미확정</b-select-option>
          </b-select>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col cols="2">품번</b-col>
        <b-col cols="3"><b-input v-model="search.productCode" size="sm" @keyup.enter="tableReload"></b-input></b-col>
        <b-col cols="2">매장</b-col>
        <b-col cols="3"><b-input v-model="search.storeText" size="sm" @keyup.enter="tableReload"></b-input></b-col>
      </b-row>
      <b-row class="my-1">
        <b-col cols="2">날짜 검색 (시작)</b-col>
        <b-col cols="3"><b-datepicker v-model="search.inOutDateStart" size="sm" locale="ko" reset-button></b-datepicker></b-col>
        <b-col cols="2">날짜 검색 (종료)</b-col>
        <b-col cols="3"><b-datepicker v-model="search.inOutDateEnd" size="sm" locale="ko" reset-button></b-datepicker></b-col>
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
        <b-col cols="auto" class="p-1"><b-button v-b-modal.modal-add-trade size="sm" variant="success">등록</b-button></b-col>
      </b-row>
      </b-container>
      <b-table id="trade-table" hover sticky-header="500px"
      :items="readTrade"
      :fields="fields"
      :busy.sync="pagination.isBusy"
      :per-page="pagination.perPage"
      :current-page="pagination.currentPage">
      <!-- <template v-slot:cell(createDate)="data">
        {{ $moment(data.value).format('YYYY-MM-DD') }}
      </template> -->
      <template v-slot:cell(inOutDate)="data">
        {{ $moment(data.value).format('YYYY-MM-DD') }}
      </template>
      <template v-slot:cell(isConfirm)="data">
        <b-check v-model="data.value" disabled></b-check>
      </template>
      <template v-slot:cell(inOut)="data">
        {{ data.value === 10 ? "입고" : "출고" }}
      </template>
      <template v-slot:cell(btnModify)="row">
        <b-link @click="modifyModalOpen(row.item)">수정</b-link>
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
          <b-col><b-input ref="product-code" v-model="form.productCode" size="sm"></b-input></b-col>
          <b-col cols="1">수량</b-col>
          <b-col><b-input ref="count" v-model="form.count" size="sm"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="1">매장</b-col>
          <b-col>
            <b-input-group>
              <b-input ref="store-text" v-model="form.storeText" size="sm" disabled></b-input>
              <input type="hidden" ref="store-id" v-model="form.storeId"/>
              <b-input-group-append>
                <b-button variant="outline-success" size="sm" @click="storeSearch()">검색</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col cols="1">날짜</b-col>
          <b-col><b-datepicker ref="in-out-date" v-model="form.inOutDate" size="sm" locale="ko"></b-datepicker></b-col>
        </b-row>
        <b-row>
          <b-col cols="1">구분</b-col>
          <b-col>
            <b-select ref="in-out" v-model="form.inOut" size="sm" @keyup.enter="tableReload">
              <b-select-option :value="10">입고</b-select-option>
              <b-select-option :value="20">출고</b-select-option>
            </b-select>
          </b-col>
          <b-col cols="1">확정</b-col>
          <b-col><b-check ref="is-confirm" v-model="form.isConfirm"></b-check></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="1">비고</b-col>
          <b-col><b-input ref="description" v-model="form.description" size="sm"></b-input></b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-container fluid>
          <b-row>
            <b-col cols="auto" class="mr-auto">
            </b-col>
            <b-col cols="auto">
              <b-button variant="success" @click="ok()" size="sm">
                등록
              </b-button>
              <b-button @click="cancel()" size="sm">
                취소
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </b-modal>
    <b-modal id="modal-modify-trade" ref="modal" title="수평 이동 수정" size="lg"
      @ok="modifyTrade" @hidden="modifyModalclose"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      footer-bg-variant="warning"
      footer-text-variant="dark">
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="1">품번</b-col>
          <b-col><b-input ref="product-code" v-model="trade.productCode" size="sm"></b-input></b-col>
          <b-col cols="1">수량</b-col>
          <b-col><b-input ref="count" v-model="trade.count" size="sm"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="1">매장</b-col>
          <b-col>
            <b-input-group>
              <b-input ref="store-text" v-model="trade.storeText" size="sm" disabled></b-input>
              <input type="hidden" ref="store-id" v-model="trade.storeId"/>
              <b-input-group-append>
                <b-button variant="outline-success" size="sm" @click="storeSearch()">검색</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col cols="1">날짜</b-col>
          <b-col><b-datepicker ref="in-out-date" v-model="trade.inOutDate" size="sm" locale="ko"></b-datepicker></b-col>
        </b-row>
        <b-row>
          <b-col cols="1">구분</b-col>
          <b-col>
            <b-select ref="in-out" v-model="trade.inOut" size="sm" @keyup.enter="tableReload">
              <b-select-option :value="10">입고</b-select-option>
              <b-select-option :value="20">출고</b-select-option>
            </b-select>
          </b-col>
          <b-col cols="1">확정</b-col>
          <b-col><b-check ref="is-confirm" v-model="trade.isConfirm"></b-check></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="1">비고</b-col>
          <b-col><b-input ref="description" v-model="trade.description" size="sm"></b-input></b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-container fluid>
          <b-row>
            <b-col cols="auto" class="mr-auto">
              <b-button variant="danger" @click="deleteTrade" size="sm">
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
        inOut: 10, // [ 10 - 입고 | 20 - 출고 ]
        isConfirm: false,
        description: ''
      },
      trade: {},
      fields: [
        // { key: 'createDate', label: '등록일' },
        { key: 'inOutDate', label: '날짜' },
        { key: 'productCode', label: '품번' },
        { key: 'count', label: '수량' },
        { key: 'storeText', label: '매장' },
        { key: 'inOut', label: '구분' },
        { key: 'isConfirm', label: '확정' },
        { key: 'btnModify', label: '수정' }
      ],
      search: {
        inOut: null,
        storeText: '',
        productCode: '',
        isConfirm: null,
        inOutDateStart: null,
        inOutDateEnd: null
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
    this.$bus.$emit(this.$common.enum.emitMessage.SET_MENU_NAVIGATE, [{ text: '수평 이동', to: { path: '/trade' } }])
  },
  components: {
    'store-search-modal': StoreSearchModal
  },
  methods: {
    modifyModalOpen (row) {
      this.trade = row
      this.$bvModal.show('modal-modify-trade')
    },
    modifyModalclose () {
      this.trade = {}
    },
    modifyTrade () {
      const vm = this
      vm.$db.tradeDatastore.update({ _id: vm.trade._id }, { $set: vm.trade }, {}, function (err, a) {
        if (err) {
          vm.$common.messageBox.showMessageBox(vm, '오류', '수정에 실패 하였습니다. 오류 : ' + err)
          return
        }
        vm.$common.messageBox.showMessageBox(vm, '성공', '수평이동 정보가 수정되었습니다.').then((value) => {
          vm.tableReload()
        })
      })
    },
    deleteTrade () {
      const vm = this
      vm.$common.messageBox.showConfirmBox(vm, '확인', '정말로 삭제하시겠습니까?', '삭제', '취소', 'danger')
        .then((value) => {
          if (value) {
            vm.$db.tradeDatastore.remove({ _id: vm.trade._id }, {}, function (err, numRemoved) {
              if (err) {
                vm.$common.messageBox.showMessageBox(vm, '오류', '삭제에 실패 하였습니다. 오류 : ' + err)
                return
              }
              vm.$common.messageBox.showMessageBox(vm, '성공', '수평이동이 삭제되었습니다.').then((value) => {
                vm.$bvModal.hide('modal-modify-trade')
                vm.$root.$emit('bv::refresh::table', 'trade-table')
              })
            })
          }
        })
    },
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
        inOut: vm.form.inOut, // [ 10 - 입고 | 20 - 출고 ]
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
      if (this.trade._id) {
        this.trade.storeText = item.name
        this.trade.storeId = item._id
      } else {
        this.form.storeText = item.name
        this.form.storeId = item._id
      }
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
      this.form.inOut = 10
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

      query.$and = []
      if (vm.search.inOut) {
        query.$and.push({
          inOut: vm.search.inOut
        })
      }
      if (vm.search.storeText) {
        query.$and.push({
          storeText: new RegExp(vm.search.storeText)
        })
      }
      if (vm.search.productCode) {
        query.$and.push({
          productCode: new RegExp(vm.search.productCode)
        })
      }
      if (vm.search.isConfirm !== null) {
        query.$and.push({
          isConfirm: vm.search.isConfirm
        })
      }
      if (vm.search.inOutDateStart) {
        query.$and.push({
          inOutDate: { $gte: vm.$moment(vm.search.inOutDateStart + ' 00:00:00')._d }
        })
      }
      if (vm.search.inOutDateEnd) {
        query.$and.push({
          inOutDate: { $lte: vm.$moment(vm.search.inOutDateEnd + ' 23:59:59')._d }
        })
      }
      console.log(query)
      return new Promise((resolve, reject) => {
        vm.$db.tradeDatastore.count(query, (cntErr, count) => {
          if (cntErr) {
            vm.pagination.isBusy = false
            reject(cntErr)
          }

          vm.pagination.totalRows = count
          vm.$db.tradeDatastore.find(query)
            .sort({ createDate: -1 })
            .skip((vm.pagination.currentPage - 1) * vm.pagination.perPage)
            .limit(vm.pagination.perPage)
            .exec((err, rows) => {
              if (err) {
                vm.pagination.isBusy = false
                reject(err)
              }
              vm.pagination.isBusy = false
              rows.forEach(row => {
                row._rowVariant = row.isConfirm ? '' : row.inOut === 10 ? 'trade-in' : 'trade-out'
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