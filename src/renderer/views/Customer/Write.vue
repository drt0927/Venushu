<template>
  <b-card>
    <b-input v-model="form.name" placeholder="이름"></b-input>
    <b-input v-model="form.phone" placeholder="연락처"></b-input>
    <b-button type="submit" v-on:click="writeCustomer">등록</b-button>
  </b-card>
</template>

<script>
export default {
  data () {
    return {
      form: {
        name: '',
        phone: ''
      }
    }
  },
  methods: {
    writeCustomer () {
      console.log()
      console.log(this.form.name, this.form.phone)
      this.$db.insert({
        name: this.form.name,
        phone: this.form.phone
      }, function (err, newDoc) {
        console.log(err, newDoc)
      })
    }
  }
}
</script>

<style>

</style>