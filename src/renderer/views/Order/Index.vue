<template>
  <div>
    <b-card bg-variant="light" class="my-2">
      <b-container fluid>
        <b-row class="my-1">
          <b-col>주문자명</b-col>
          <b-col cols="3"><b-input v-model="search.name" @keyup.enter="tableReload"></b-input></b-col>
          <b-col>주소</b-col>
          <b-col cols="3"><b-input v-model="search.address" @keyup.enter="tableReload"></b-input></b-col>
          <b-col>품번</b-col>
          <b-col cols="3"><b-input v-model="search.productCode" @keyup.enter="tableReload"></b-input></b-col>
        </b-row>
        <b-row>
          <b-col cols="1">사이즈</b-col>
          <b-col cols="3"><b-input v-model="search.size" @keyup.enter="tableReload"></b-input></b-col>
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
          <b-col cols="auto" class="p-1"><b-button v-b-modal.modal-add-order variant="success">등록</b-button></b-col>
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
      </b-table>
      <b-pagination v-model="pagination.currentPage" 
      :total-rows="pagination.totalRows"
      :per-page="pagination.perPage"
      aria-controls="order-table"
      ></b-pagination>
    </div>

    <b-modal id="modal-add-order" ref="modal" title="주문장 등록" size="lg"
      @ok="writeOrder" @shown="modalShown"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      footer-bg-variant="warning"
      footer-text-variant="dark">
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="3">주문자</b-col>
          <b-col>
            <b-input-group>
              <b-input ref="name" v-model="form.name" @keyup.enter="writeOrder" disabled></b-input>
              <input type="hidden" v-model="form.customerId"/>
              <b-input-group-append>
                <b-button variant="outline-success" @click="customerSearch()">검색</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">품번</b-col>
          <b-col><b-input ref="productCode" v-model="form.productCode" @keyup.enter="writeOrder"></b-input></b-col>
          <b-col cols="3">사이즈</b-col>
          <b-col><b-input ref="size" v-model="form.size" @keyup.enter="writeOrder"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">수량</b-col>
          <b-col><b-input ref="count" type="number" v-model="form.count" @keyup.enter="writeOrder"></b-input></b-col>
          <b-col cols="3">금액(단가)</b-col>
          <b-col><b-input ref="amt" type="number" v-model="form.amt" @keyup.enter="writeOrder"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">주소</b-col>
          <b-col>
            <b-input-group>
              <b-input ref="address" v-model="form.address" @keyup.enter="writeOrder"></b-input>
              <b-input-group-append>
                <b-button variant="outline-success" @click="addrSearch()">주소검색</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">설명</b-col>
          <b-col><b-input v-model="form.description" @keyup.enter="writeOrder"></b-input></b-col>
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
    <div ref="daum-area" class="daum-layer-background">
      <div class="daum-wrapper">
        <b-icon-x class="daum-layer-close" @click="addrSearchClose"></b-icon-x>
        <vue-daum-postcode style="margin-top:25px;" @complete="addrSearchComplete" />
      </div>
    </div>
    <customer-search-modal @row-selected="customerSelected"></customer-search-modal>
  </div>
</template>

<script>
import CustomerSearchModal from '../../components/CustomerSearchModal'

export default {
  data () {
    return {
      fields: [
        { key: 'namelink', label: '주문자명' },
        { key: 'productCode', label: '품번' },
        { key: 'size', label: '사이즈' },
        { key: 'amt', label: '금액(단가)' },
        { key: 'count', label: '수량' },
        { key: 'address', label: '주소' },
        { key: 'action', label: '상세' }
      ],
      form: {
        name: '',
        customerId: '',
        productCode: '',
        size: '',
        count: 0,
        amt: 0,
        address: '',
        description: ''
      },
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
  components: {
    'customer-search-modal': CustomerSearchModal
  },
  methods: {
    customerSelected (item) {
      this.form.name = item.name
      this.form.customerId = item._id
    },
    customerSearch () {
      this.$bvModal.show('modal-search-customer')
    },
    addrSearch () {
      this.$refs['daum-area'].style.display = 'block'
    },
    addrSearchClose () {
      this.$refs['daum-area'].style.display = 'none'
    },
    addrSearchComplete (addr) {
      let resultAddr = addr.roadAddress
      if (addr.buildingName) {
        resultAddr += ` (${addr.buildingName})`
      }
      this.form.address = resultAddr
      this.addrSearchClose()
      this.$refs.address.$el.focus()
    },
    tableReload () {
      this.$root.$emit('bv::refresh::table', 'order-table')
    },
    writeOrder (modalEvt) {
      const vm = this
      if (!vm.checkValidation()) {
        modalEvt.preventDefault()
        return
      }
      vm.$db.orderDatastore.insert({
        name: vm.form.name,
        customerId: vm.form.customerId,
        productCode: vm.form.productCode,
        size: vm.form.size,
        count: vm.form.count,
        amt: vm.form.amt,
        address: vm.form.address,
        description: vm.form.description,
        createDate: new Date()
      },
      function (err) {
        if (!err) {
          vm.tableReload()
        }
        vm.clearOrderForm()
        vm.$bvModal.hide('modal-add-order')
      })
    },
    clearOrderForm () {
      this.form.name = ''
      this.form.customerId = ''
      this.form.productCode = ''
      this.form.size = ''
      this.form.count = 0
      this.form.amt = 0
      this.form.address = ''
      this.form.description = ''
    },
    modalShown () {
      this.$refs.name.$el.focus()
      this.clearOrderForm()
    },
    readOrder () {
      const vm = this
      let query = {}
      vm.pagination.isBusy = true

      if (vm.search.name) {
        query.name = new RegExp(vm.search.name)
      }
      if (vm.search.address) {
        query.address = new RegExp(vm.search.address)
      }
      if (vm.search.productCode) {
        query.productCode = new RegExp(vm.search.productCode)
      }
      if (vm.search.size) {
        query.size = new RegExp(vm.search.size)
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
    },
    checkValidation () {
      const vm = this
      if (!vm.form.customerId) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '주문자를 입력해주세요.')
        vm.$refs.name.$el.focus()
        return false
      }

      if (!vm.form.productCode) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '품번을 입력해주세요.')
        vm.$refs.productCode.$el.focus()
        return false
      }

      if (!vm.form.size) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '사이즈를 입력해주세요.')
        vm.$refs.size.$el.focus()
        return false
      }

      if (!vm.form.count) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '수량을 입력해주세요.')
        vm.$refs.count.$el.focus()
        return false
      }

      if (!vm.form.amt) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '금액을 입력해주세요.')
        vm.$refs.amt.$el.focus()
        return false
      }

      return true
    }
  }
}
</script>

<style>

</style>