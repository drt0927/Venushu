<template>
  <div>
    <b-container fluid>
      <div>
        <h4>주문장 정보</h4>
        <b-row class="mb-1">
          <b-col cols="1">주문자</b-col>
          <b-col cols="3">
            <b-input-group>
              <b-input ref="name" v-model="form.name" size="sm" @keyup.enter="writeOrder" disabled></b-input>
              <input type="hidden" v-model="form.customerId" size="sm"/>
              <b-input-group-append>
                <b-button variant="outline-success" @click="customerSearch()" size="sm">검색</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
          <b-col cols="1">주소</b-col>
          <b-col>
            <b-input-group>
              <b-input ref="address" v-model="form.address" size="sm" @keyup.enter="writeOrder"></b-input>
              <b-input-group-append>
                <b-button variant="outline-success" @click="addrSearch()" size="sm">주소검색</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="1">출고일</b-col>
          <b-col><b-datepicker v-model="form.deliveryStart" size="sm" locale="ko"></b-datepicker></b-col>
          <b-col cols="1">송장번호</b-col>
          <b-col><b-input v-model="form.deliveryCode" size="sm" @keyup.enter="writeOrder"></b-input></b-col>
          <b-col cols="1">배송 완료</b-col>
          <b-col><b-datepicker v-model="form.deliveryEnd" size="sm" locale="ko"></b-datepicker></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="1">설명</b-col>
          <b-col><b-input v-model="form.description" size="sm" @keyup.enter="writeOrder"></b-input></b-col>
        </b-row>
      </div>
      
      <div>
        <b-row>
          <b-col cols="auto" class="mr-auto"><h4>상품등록</h4></b-col>
          <b-col cols="auto" class="">
            <b-button size="sm" variant="info"><b-icon-cart-plus @click="addProduct"></b-icon-cart-plus></b-button>
          </b-col>
        </b-row>
        <div style="border:1px solid lightgray; padding: 10px;">
          <b-row class="mb-1">
            <b-col style="text-align:center;">품번</b-col>
            <b-col style="text-align:center;">색상</b-col>
            <b-col style="text-align:center;">사이즈</b-col>
            <b-col style="text-align:center;">수량</b-col>
            <b-col style="text-align:center;">금액(단가)</b-col>
            <b-col style="text-align:center;"></b-col>
          </b-row>
        </div>
        <div v-for="(item, index) in form.products" v-bind:key="index" style="border:1px solid lightgray; border-top: none; padding: 10px;">
          <b-row class="mb-1">
            <b-col><b-input ref="product-code" v-model="item.code" size="sm" @keyup.shift.enter="addProduct"></b-input></b-col>
            <b-col><b-input ref="product-color" v-model="item.color" size="sm" @keyup.shift.enter="addProduct"></b-input></b-col>
            <b-col><b-input ref="product-size" v-model="item.size" size="sm" @keyup.shift.enter="addProduct"></b-input></b-col>
            <b-col><b-input ref="product-count" type="number" v-model="item.count" size="sm" @keyup.shift.enter="addProduct"></b-input></b-col>
            <b-col><b-input ref="product-amt" type="number" v-model="item.amt" size="sm" @keyup.shift.enter="addProduct"></b-input></b-col>
            <b-col><b-button size="sm"><b-icon-cart-dash @click="removeProduct(index)"></b-icon-cart-dash></b-button></b-col>
          </b-row>
        </div>
      </div>
      <b-button variant="success" @click="writeOrder" size="sm" class="my-2">
        등록
      </b-button>
      <b-button @click="goIndex" size="sm" class="my-2">
        취소
      </b-button>
    </b-container>
    
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
      form: {
        name: '',
        customerId: '',
        deliveryStart: null,
        deliveryEnd: null,
        address: '',
        description: '',
        deliveryCode: '',
        products: []
      }
    }
  },
  created () {
    this.$bus.$emit(this.$common.enum.emitMessage.SET_MENU_NAVIGATE, [{ text: '주문장 관리', to: { path: '/order' } }, { text: '생성' }])
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
    writeOrder (modalEvt) {
      const vm = this
      if (!vm.checkValidation()) {
        modalEvt.preventDefault()
        return
      }

      vm.$db.orderDatastore.insert({
        name: vm.form.name,
        customerId: vm.form.customerId,
        deliveryStart: vm.form.deliveryStart,
        deliveryEnd: vm.form.deliveryEnd,
        address: vm.form.address,
        description: vm.form.description,
        deliveryCode: vm.form.deliveryCode,
        products: vm.form.products,
        createDate: new Date()
      },
      (err) => {
        if (!err) {
          vm.$common.messageBox.showMessageBox(vm, '성공', '주문장이 생성 되었습니다.').then((value) => {
            vm.goIndex()
          })
        }
        vm.clearOrderForm()
        vm.$bvModal.hide('modal-add-order')
      })
    },
    goIndex () {
      this.$router.push({ path: '/order' })
    },
    clearOrderForm () {
      this.name = ''
      this.customerId = ''
      this.deliveryStart = null
      this.deliveryEnd = null
      this.address = ''
      this.description = ''
      this.deliveryCode = ''
      this.products = []
    },
    modalShown () {
      this.$refs.name.$el.focus()
      this.clearOrderForm()
    },
    checkValidation () {
      const vm = this
      if (!vm.form.customerId) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '주문자를 입력해주세요.')
        vm.$refs.name.$el.focus()
        return false
      }

      if (vm.form.products.length < 1) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '상품은 하나 이상 등록하셔야 합니다.')
        return false
      }

      // if (!vm.form.productCode) {
      //   vm.$common.messageBox.showToast(vm, '필수 항목 누락', '품번을 입력해주세요.')
      //   vm.$refs.productCode.$el.focus()
      //   return false
      // }

      // if (!vm.form.size) {
      //   vm.$common.messageBox.showToast(vm, '필수 항목 누락', '사이즈를 입력해주세요.')
      //   vm.$refs.size.$el.focus()
      //   return false
      // }

      // if (!vm.form.count) {
      //   vm.$common.messageBox.showToast(vm, '필수 항목 누락', '수량을 입력해주세요.')
      //   vm.$refs.count.$el.focus()
      //   return false
      // }

      // if (!vm.form.amt) {
      //   vm.$common.messageBox.showToast(vm, '필수 항목 누락', '금액을 입력해주세요.')
      //   vm.$refs.amt.$el.focus()
      //   return false
      // }

      return true
    },
    addProduct () {
      this.form.products.push({
        code: '',
        size: '',
        count: 0,
        amt: 0,
        color: ''
      })
    },
    removeProduct (index) {
      this.form.products.splice(index, 1)
    }
  }
}
</script>

<style>

</style>