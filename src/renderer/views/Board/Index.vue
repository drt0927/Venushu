<template>
  <div>
      <b-container fluid>
        <b-row>
          <b-col cols="auto" class="mr-auto p-1"><span>개수 : {{ pagination.totalRows }} </span></b-col>
          <b-col cols="auto" class="p-1"><b-button v-b-modal.modal-add-board variant="success">등록</b-button></b-col>
        </b-row>
      </b-container>
      <b-table id="board-table" striped sticky-header="500px"
      :items="readBoard"
      :fields="fields"
      :busy.sync="pagination.isBusy"
      :per-page="pagination.perPage"
      :current-page="pagination.currentPage">
        <template v-slot:cell(titlelink)="data">
          <router-link :to="`/board/detail/${data.item._id}`">{{ data.item.title }}</router-link>
        </template>
        <template v-slot:cell(createDate)="data">
          {{ $moment(data.value).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </b-table>
      <b-pagination v-model="pagination.currentPage" 
      :total-rows="pagination.totalRows"
      :per-page="pagination.perPage"
      aria-controls="board-table"
      ></b-pagination>

      <b-modal id="modal-add-board" ref="modal" title="공지사항 등록" size="lg"
      @ok="writeBoard" @shown="modalShown"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      footer-bg-variant="warning"
      footer-text-variant="dark">
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="3">작성자</b-col>
          <b-col><b-input v-model="form.name" disabled></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">제목</b-col>
          <b-col><b-input ref="title" v-model="form.title"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">내용</b-col>
          <b-col><b-textarea ref="contents" rows="10" v-model="form.contents"></b-textarea></b-col>
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
    </div>
</template>

<script>
export default {
  data () {
    return {
      fields: [
        { key: 'titlelink', label: '제목' },
        { key: 'typeText', label: '게시판' },
        { key: 'name', label: '작성자' },
        { key: 'createDate', label: '작성일' }
      ],
      form: {
        name: this.$user.name,
        title: '',
        contents: ''
      },
      search: {
        type: this.$route.params.type,
        title: ''
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
    this.$bus.$emit('SET_MENU_NAVIGATE', [{ text: '공지사항', to: { path: '/board/notice' } }])
  },
  methods: {
    writeBoard (modalEvt) {
      const vm = this
      if (!vm.checkValidation()) {
        modalEvt.preventDefault()
        return
      }

      let typeText = ''
      if (vm.$route.params.type === 'notice') {
        typeText = '공지사항'
      }

      vm.$db.boardDatastore.insert({
        type: vm.$route.params.type,
        typeText: typeText,
        name: vm.$user.name,
        userId: vm.$user.idx,
        title: vm.form.title,
        contents: vm.form.contents,
        createDate: new Date()
      },
      function (err) {
        if (!err) {
          vm.tableReload()
        }
        vm.clearBoardForm()
        vm.$bvModal.hide('modal-add-customer')
      })
    },
    checkValidation () {
      const vm = this
      if (!vm.form.title) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '제목을 입력해주세요.')
        vm.$refs.title.$el.focus()
        return false
      }

      if (!vm.form.contents) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '내용을 입력해주세요.')
        vm.$refs.contents.$el.focus()
        return false
      }

      return true
    },
    clearBoardForm () {
      this.form.title = ''
      this.form.contents = ''
    },
    modalShown () {
      this.$refs.title.$el.focus()
      this.form.name = this.$user.name
      this.clearBoardForm()
    },
    tableReload () {
      this.$root.$emit('bv::refresh::table', 'board-table')
    },
    readBoard () {
      const vm = this
      let query = {}
      vm.pagination.isBusy = true

      query.type = vm.search.type
      if (vm.search.title) {
        query.title = new RegExp(vm.search.title)
      }

      return new Promise((resolve, reject) => {
        vm.$db.boardDatastore.count(query, (cntErr, count) => {
          if (cntErr) {
            vm.pagination.isBusy = false
            reject(cntErr)
          }

          vm.pagination.totalRows = count
          vm.$db.boardDatastore.find(query)
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
    }
  }
}
</script>

<style>

</style>