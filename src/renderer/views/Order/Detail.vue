<template>
  <div>
    <div>
      <h4>주문장 정보</h4>
      <b-row class="my-2">
        <b-col cols="1">주문자명</b-col>
        <b-col cols="3">
          <b-input-group>
            <b-input ref="name" v-model="order.name" disabled></b-input>
            <input type="hidden" v-model="order.customerId"/>
            <b-input-group-append>
              <b-button variant="outline-success" @click="customerSearch()">검색</b-button>
              <b-button variant="outline-info" :to="`/customer/detail/${order.customerId}`">이동</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
        <b-col cols="1">주소</b-col>
        <b-col>
          <b-input-group>
            <b-input ref="address" v-model="order.address" @keyup.enter="writeOrder"></b-input>
            <b-input-group-append>
              <b-button variant="outline-success" @click="addrSearch()">주소검색</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
      <b-row class="my-2">
        <b-col cols="1">출고일</b-col>
        <b-col><b-datepicker v-model="order.deliveryStart" locale="ko"></b-datepicker></b-col>
        <b-col cols="1">송장번호</b-col>
        <b-col><b-input v-model="order.deliveryCode" @keyup.enter="writeOrder"></b-input></b-col>
        <b-col cols="1">배송 완료</b-col>
        <b-col><b-datepicker v-model="order.deliveryEnd" locale="ko"></b-datepicker></b-col>
      </b-row>
      <b-row class="my-2">
        <b-col cols="1">설명</b-col>
        <b-col><b-input v-model="order.description" @keyup.enter="writeOrder"></b-input></b-col>
        <b-col cols="4">
          <b-button variant="primary" @click="updateOrder">수정</b-button>
          <b-button variant="info" @click="goIndex">목록</b-button>
          <b-button variant="danger" @click="deleteOrder">삭제</b-button>
        </b-col>
      </b-row>
      <b-row class="my-2">
        
      </b-row>
    </div>
    <div>
      <h4>상품 정보</h4>
      <div v-for="(item, index) in order.products" v-bind:key="index" style="border:1px solid lightgray; padding: 5px;">
        <b-row class="mb-1">
          <b-col cols="1">품번</b-col>
          <b-col><b-input ref="product-code" v-model="item.code" @keyup.shift.enter="addProduct"></b-input></b-col>
          <b-col cols="1">사이즈</b-col>
          <b-col><b-input ref="product-size" v-model="item.size" @keyup.shift.enter="addProduct"></b-input></b-col>
          <b-col cols="1">색상</b-col>
          <b-col><b-input ref="product-color" v-model="item.color" @keyup.shift.enter="addProduct"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="1">수량</b-col>
          <b-col cols="3"><b-input ref="product-count" type="number" v-model="item.count" @keyup.shift.enter="addProduct"></b-input></b-col>
          <b-col cols="1">금액(단가)</b-col>
          <b-col cols="3"><b-input ref="product-amt" type="number" v-model="item.amt" @keyup.shift.enter="addProduct"></b-input></b-col>
          <b-col cols="auto"><b-icon-cart-dash @click="removeProduct(index)"></b-icon-cart-dash></b-col>
        </b-row>
      </div>
    </div>
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
      order: {}
    }
  },
  created () {
    this.$bus.$emit('SET_MENU_NAVIGATE', [{ text: '주문장 관리', to: { path: '/order' } }, { text: '상세' }])
  },
  components: {
    'customer-search-modal': CustomerSearchModal
  },
  computed: {
    createDate () {
      return this.$moment(this.order.createDate).format('YYYY-MM-DD HH:mm:ss')
    },
    totalAmt () {
      return this.order.count * this.order.amt
    }
  },
  mounted () {
    const vm = this
    vm.$db.orderDatastore.find({ _id: this.$route.params.id }, (err, row) => {
      if (err || row.length < 1) {
        vm.goIndex()
      }
      vm.order = row[0]
    })
  },
  methods: {
    customerSelected (item) {
      this.order.name = item.name
      this.order.customerId = item._id
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
      this.order.address = resultAddr
      this.addrSearchClose()
      this.$refs.address.$el.focus()
    },
    goIndex () {
      this.$router.push({ path: '/order' })
    },
    deleteOrder () {
      const vm = this
      vm.$common.messageBox.showConfirmBox(vm, '확인', '정말로 삭제하시겠습니까?', '삭제', '취소', 'danger')
        .then((value) => {
          if (value) {
            vm.$db.orderDatastore.remove({ _id: vm.$route.params.id }, {}, function (err, numRemoved) {
              if (err) {
                vm.$common.messageBox.showMessageBox(vm, '오류', '삭제에 실패 하였습니다. 오류 : ' + err)
                return
              }
              vm.$common.messageBox.showMessageBox(vm, '성공', '주문장 정보가 삭제되었습니다.').then((value) => {
                vm.goIndex()
              })
            })
          }
        })
    },
    updateOrder () {
      const vm = this
      vm.$db.orderDatastore.update({ _id: vm.$route.params.id }, { $set: vm.order }, {}, function (err, a) {
        if (err) {
          vm.$common.messageBox.showMessageBox(vm, '오류', '수정에 실패 하였습니다. 오류 : ' + err)
          return
        }
        vm.$common.messageBox.showMessageBox(vm, '성공', '주문장 정보가 수정되었습니다.').then((value) => {
        })
      })
    }
  }
}
</script>

<style>

</style>