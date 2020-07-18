<template>
  <div>
    <b-modal id="modal-search-store" size="lg" title="지점 검색"
      @hidden="modalHidden"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      hide-footer>
      <b-container fluid>
        <b-card bg-variant="light" class="my-2">
          <b-container fluid>
            <b-row class="my-1">
              <b-col cols="2">이름</b-col>
              <b-col><b-input v-model="search.name" @keyup.enter="tableReload" size="sm"></b-input></b-col>
            </b-row>
            <b-row class="my-1">
              <b-col cols="auto" class="mr-auto">
              </b-col>
              <b-col cols="auto">
                <b-button @click="tableReload" size="sm">검색</b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
        <b-row class="my-1">
              <b-col cols="auto" class="mr-auto">
              </b-col>
              <b-col cols="auto">
                <b-button v-b-modal.modal-add-store variant="success" size="sm">등록</b-button>
              </b-col>
            </b-row>
        <div>
          <b-table id="store-search-table" striped sticky-header="500px"
          selectable
          @row-selected="onRowSelected"
          :items="readStore"
          :fields="fields"
          :busy.sync="pagination.isBusy"
          :per-page="pagination.perPage"
          :current-page="pagination.currentPage">
          </b-table>
          <b-pagination v-model="pagination.currentPage" 
          :total-rows="pagination.totalRows"
          :per-page="pagination.perPage"
          aria-controls="store-search-table"
          ></b-pagination>
        </div>
      </b-container>
    </b-modal>
    <store-add-modal @store-added="storeAdded" :temp-name="search.name"></store-add-modal>
  </div>
</template>

<script>
import StoreAddModal from './StoreAddModal'

export default {
  data () {
    return {
      fields: [
        { key: 'name', label: '이름' },
        { key: 'contact', label: '연락처' },
        { key: 'deliveryCode', label: '택배코드' }
      ],
      search: {
        name: ''
      },
      pagination: {
        currentPage: 1,
        perPage: 15,
        totalRows: 0,
        isBusy: false
      }
    }
  },
  components: {
    'store-add-modal': StoreAddModal
  },
  methods: {
    modalHidden () {
      this.search.name = ''
    },
    onRowSelected (items) {
      if (items.length > 0) {
        this.$emit('row-selected', items[0])
        this.search.name = ''
        this.$bvModal.hide('modal-search-store')
      }
    },
    tableReload () {
      this.$root.$emit('bv::refresh::table', 'store-search-table')
    },
    storeAdded () {
      this.tableReload()
    },
    readStore () {
      const vm = this
      let query = {}
      vm.pagination.isBusy = true

      if (vm.search.name) {
        query.name = new RegExp(vm.search.name)
      }
      return new Promise((resolve, reject) => {
        vm.$db.storeDatastore.count(query, (cntErr, count) => {
          if (cntErr) {
            vm.pagination.isBusy = false
            reject(cntErr)
          }

          vm.pagination.totalRows = count
          vm.$db.storeDatastore.find(query)
            .sort({ createDate: -1 })
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
    }
  }
}
</script>

<style>

</style>