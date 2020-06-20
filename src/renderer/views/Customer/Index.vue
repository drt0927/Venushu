<template>
  <b-container fluid>
    <b-card bg-variant="light" class="my-2">
      <b-row>
        <b-col>
          <b-form-group label-cols-sm="3" label="이름 : " label-align-sm="right" label-for="">
            <b-form-input id="name"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label-cols-sm="3" label="연락처 : " label-align-sm="right" label-for="">
            <b-form-input id="phone"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button>검색</b-button>
          <router-link to="/customer/write">등록</router-link>
        </b-col>
      </b-row>
    </b-card>
    <div>
      <b-table :items="customers"></b-table>
    </div>
  </b-container>
  <!-- <div>
    customer
    <router-link to="customer/detail/1">detail</router-link>
  </div> -->
</template>

<script>
export default {
  data () {
    return {
      field: [
      ],
      customers: []
    }
  },
  mounted () {
    console.log(this.customers)
    var vm = this
    vm.$db.find({ }, function (err, rows) {
      console.log(err, rows)
      vm.customers = rows
    })
  },
  created () {
    console.log(this.customers)
    console.log('created')
  }
}
</script>

<style>

</style>