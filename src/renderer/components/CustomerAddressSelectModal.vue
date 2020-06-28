<template>
  <div>
    <b-modal id="modal-selected-customer-address" ref="modal" title="고객 주소 선택" size="lg"
      @shown="modalShown"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      hide-footer>
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="2">주소(1)</b-col>
          <b-col>
            <b-input-group>
              <b-input v-model="address1" size="sm" disabled></b-input>
              <b-input-group-append>
                <b-button variant="outline-success" size="sm" @click="selectedAddress('address1')">선택</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="2">주소(2)</b-col>
          <b-col>
            <b-input-group>
              <b-input v-model="address2" size="sm" disabled></b-input>
              <b-input-group-append>
                <b-button variant="outline-success" size="sm" @click="selectedAddress('address2')">선택</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="2">주소(3)</b-col>
          <b-col>
            <b-input-group>
              <b-input v-model="address3" size="sm" disabled></b-input>
              <b-input-group-append>
                <b-button variant="outline-success" size="sm" @click="selectedAddress('address3')">선택</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      address1: '',
      address2: '',
      address3: ''
    }
  },
  props: [ 'tempIdx' ],
  methods: {
    selectedAddress (addr) {
      this.$emit('address-selected', this[addr])
    },
    modalShown () {
      const vm = this
      vm.$db.customerDatastore.find({ _id: vm.tempIdx }, (err, row) => {
        if (err || row.length < 1) {
          vm.$bvModal.hide('modal-selected-customer-address')
        }
        vm.address1 = row[0].address1
        vm.address2 = row[0].address2
        vm.address3 = row[0].address3
      })
    }
  }
}
</script>

<style>

</style>