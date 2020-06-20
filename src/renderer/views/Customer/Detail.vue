<template>
  <div>
    customer detail
    {{$route.params.id}}
  </div>
</template>

<script>
export default {
  mounted () {
    this.$db.customerDatastore.find({ _id: this.$route.params.id }, (err, row) => {
      console.log(err, row)
    })
  }
}
</script>

<style>

</style>