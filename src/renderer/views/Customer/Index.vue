<template>
  <b-container fluid>
    <b-card bg-variant="light" class="my-2">
      <b-container fluid>
        <b-row class="my-1">
          <b-col>이름</b-col>
          <b-col cols="3"><b-input v-model="search.name" @keyup.enter="tableReload"></b-input></b-col>
          <b-col>연락처</b-col>
          <b-col cols="3"><b-input v-model="search.phone" @keyup.enter="tableReload"></b-input></b-col>
          <b-col>주소</b-col>
          <b-col cols="3"><b-input v-model="search.address" @keyup.enter="tableReload"></b-input></b-col>
        </b-row>
        <b-row>
          <b-col cols="1">알림여부</b-col>
          <b-col cols="3">
            <b-select v-model="search.isNotify" @keyup.enter="tableReload">
              <b-select-option :value="null">전체</b-select-option>
              <b-select-option value="1">수신</b-select-option>
              <b-select-option value="0">미수신</b-select-option>
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
        <b-col cols="auto" class="p-1"><b-button v-b-modal.modal-add-customer variant="success">등록</b-button></b-col>
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
          {{ $common.phone($crypto.decrypt(data.value)) }}
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

    <b-modal id="modal-add-customer" ref="modal" title="고객등록" size="lg"
      @ok="writeCustomer" @shown="modalShown"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      footer-bg-variant="warning"
      footer-text-variant="dark">
      <b-row>
        <b-col>
          <b-container fluid>
            <b-row class="mb-1">
              <b-col cols="3">이름</b-col>
              <b-col><b-input ref="name" v-model="form.name" @keyup.enter="writeCustomer"></b-input></b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col cols="3">연락처</b-col>
              <b-col><b-input ref="phone" v-model="form.phone" @keyup.enter="writeCustomer"></b-input></b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col cols="3">주소(1)</b-col>
              <b-col>
                <b-input-group>
                  <b-input v-model="form.address1" @keyup.enter="writeCustomer"></b-input>
                  <b-input-group-append>
                    <b-button variant="outline-success" @click="addrSearch('address1')">주소검색</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col cols="3">주소(2)</b-col>
              <b-col>
                <b-input-group>
                  <b-input v-model="form.address2" @keyup.enter="writeCustomer"></b-input>
                  <b-input-group-append>
                    <b-button variant="outline-success" @click="addrSearch('address2')">주소검색</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col cols="3">주소(3)</b-col>
              <b-col>
                <b-input-group>
                  <b-input v-model="form.address3" @keyup.enter="writeCustomer"></b-input>
                  <b-input-group-append>
                    <b-button variant="outline-success" @click="addrSearch('address3')">주소검색</b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col cols="3">행사알림</b-col>
              <b-col><b-check type="checkbox" v-model="form.isNotify" @keyup.enter="writeCustomer"></b-check></b-col>
            </b-row>
            <b-row class="mb-1">
              <b-col cols="3">설명</b-col>
              <b-col><b-input v-model="form.description" @keyup.enter="writeCustomer"></b-input></b-col>
            </b-row>
          </b-container>
        </b-col>
      </b-row>
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
  </b-container>
</template>

<script>
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
      items: [],
      form: {
        name: '',
        phone: '',
        address1: '',
        address2: '',
        address3: '',
        isNotify: false,
        description: ''
      },
      search: {
        name: '',
        phone: '',
        address: '',
        isNotify: null
      },
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        isBusy: false
      },
      selectedAddressId: null
    }
  },
  methods: {
    addrSearchClose () {
      this.$refs['daum-area'].style.display = 'none'
    },
    addrSearch (id) {
      this.selectedAddressId = id
      this.$refs['daum-area'].style.display = 'block'
    },
    addrSearchComplete (addr) {
      let resultAddr = addr.roadAddress
      if (addr.buildingName) {
        resultAddr += ` (${addr.buildingName})`
      }
      this.form[this.selectedAddressId] = resultAddr
      this.addrSearchClose()
    },
    tableReload () {
      this.$root.$emit('bv::refresh::table', 'customer-table')
    },
    writeCustomer (modalEvt) {
      let vm = this
      if (!vm.checkValidation()) {
        modalEvt.preventDefault()
        return
      }

      vm.$db.customerDatastore.insert({
        name: vm.form.name,
        phone: vm.$crypto.encrypt(vm.form.phone),
        address1: vm.form.address1,
        address2: vm.form.address2,
        address3: vm.form.address3,
        isNotify: vm.form.isNotify,
        description: vm.form.description,
        createDate: new Date()
      },
      function (err) {
        if (!err) {
          vm.tableReload()
        }
        vm.clearCustomerForm()
        vm.$bvModal.hide('modal-add-customer')
      })
    },
    clearCustomerForm () {
      this.form.name = ''
      this.form.phone = ''
      this.form.address1 = ''
      this.form.address2 = ''
      this.form.address3 = ''
    },
    modalShown () {
      this.$refs.name.$el.focus()
      this.clearCustomerForm()
    },
    readCustomer () {
      let vm = this
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
      console.log(query)
      return new Promise((resolve, reject) => {
        vm.$db.customerDatastore.count(query, (cntErr, count) => {
          if (cntErr) {
            vm.pagination.isBusy = false
            reject(cntErr)
          }

          vm.pagination.totalRows = count
          vm.$db.customerDatastore.find(query)
            .sort({ createDate: 1 })
            .skip((vm.pagination.currentPage - 1) * vm.pagination.perPage)
            .limit(vm.pagination.perPage)
            .exec((err, rows) => {
              console.log(err, rows)
              if (err) {
                vm.pagination.isBusy = false
                reject(err)
              }
              vm.pagination.isBusy = false
              // vm.items = rows
              resolve(rows)
            })
        })
      })
    },
    checkValidation () {
      let vm = this
      if (!vm.form.name) {
        vm.showMessageBox('필수 항목 누락', '이름을 입력해주세요.')
        vm.$refs.name.$el.focus()
        return false
      }

      if (!vm.form.phone) {
        vm.showMessageBox('필수 항목 누락', '연락처을 입력해주세요.')
        vm.$refs.phone.$el.focus()
        return false
      }

      return true
    },
    showMessageBox (title, message) {
      this.$bvToast.toast(message, {
        title: title,
        variant: 'danger',
        solid: true
      })
    }
  }
}
</script>

<style>
.daum-layer-background {
  display: none;
  position: fixed;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
}

.daum-wrapper {
  z-index: 9999;
  width: 470px;
  height: 500px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow-y: auto;
}

.daum-layer-close {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10000;
  color: white;
  font-size: x-large;
  cursor: pointer;
}
</style>