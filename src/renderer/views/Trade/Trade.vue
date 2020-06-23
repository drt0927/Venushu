<template>
  <b-container fluid>
    <router-view></router-view>
  </b-container>  
</template>

<script>
export default {

}
</script>

<style>
.table-trade-in, .table-danger>td, .table-danger>th {
  background-color: #DDE7FE;
}
.table-trade-out, .table-danger>td, .table-danger>th {
  background-color: #FFD1DF;
}
.table-trade-confirm, .table-danger>td, .table-danger>th {
  background-color: #FFE66D;
}
</style>