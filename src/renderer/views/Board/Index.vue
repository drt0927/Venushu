<template>
  <b-container fluid>
    <b-card bg-variant="light" class="my-2">
      <b-row class="my-1">
        <b-col cols="2">제목</b-col>
        <b-col cols="3"><b-input v-model="search.title.value" size="sm" @keyup.enter="tableReload"></b-input></b-col>
      </b-row>
    </b-card>
    <b-container fluid>
      <b-row>
        <b-col cols="auto" class="mr-auto p-1"><span>개수 : {{ query.pagination.totalRows }} </span></b-col>
        <b-col cols="auto" class="p-1"><b-button v-b-modal.modal-add-board size="sm" variant="success">등록</b-button></b-col>
      </b-row>
    </b-container>
    <b-table id="board-table" striped sticky-header="500px"
    :items="readBoard"
    :fields="fields"
    :busy.sync="query.pagination.isBusy"
    :per-page="query.pagination.perPage"
    :current-page="query.pagination.currentPage">
      <template v-slot:cell(titlelink)="data">
        <router-link :to="`/board/detail/${data.item._id}`">{{ data.item.title }}</router-link>
      </template>
      <template v-slot:cell(isNotice)="data">
        <b-check disabled v-model="data.value"></b-check>
      </template>
      <template v-slot:cell(createDate)="data">
        {{ $moment(data.value).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </b-table>
    <b-pagination v-model="query.pagination.currentPage" 
    :total-rows="query.pagination.totalRows"
    :per-page="query.pagination.perPage"
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
          <b-col><b-input v-model="form.name" size="sm" disabled></b-input></b-col>
          <b-col cols="3">공지</b-col>
          <b-col><b-check v-model="form.isNotice" size="sm"></b-check></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">제목</b-col>
          <b-col><b-input ref="title" v-model="form.title" size="sm"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">내용</b-col>
          <b-col><b-textarea ref="contents" rows="10" v-model="form.contents" size="sm"></b-textarea></b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-container fluid>
          <b-row>
            <b-col cols="auto" class="mr-auto">
            </b-col>
            <b-col cols="auto">
              <b-button variant="success" @click="ok()" size="sm">
                등록
              </b-button>
              <b-button @click="cancel()" size="sm">
                취소
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import Query from '../../utils/DatastoreHelper'

export default {
  data () {
    return {
      fields: [
        { key: 'titlelink', label: '제목' },
        { key: 'isNotice', label: '공지사항' },
        { key: 'createDate', label: '작성일' }
      ],
      form: {
        name: this.$user.name,
        userId: this.$user.idx,
        title: '',
        contents: '',
        isNotice: false,
        createDate: null
      },
      sort: {
        isNotice: -1,
        createDate: -1
      },
      search: {
        title: {
          value: '',
          exp: 'like'
        }
      },
      query: new Query(this.$db.boardDatastore)
    }
  },
  created () {
    this.$bus.$emit(this.$common.enum.emitMessage.SET_MENU_NAVIGATE, [{ text: '게시판', to: { path: '/board' } }])
  },
  methods: {
    writeBoard (modalEvt) {
      const vm = this
      if (!vm.checkValidation()) {
        modalEvt.preventDefault()
        return
      }

      vm.form.createDate = new Date()
      vm.query.insert(vm.form, (result) => {
        if (result) {
          vm.tableReload()
          vm.clearBoardForm()
          vm.$bvModal.hide('modal-add-customer')
        } else {
          vm.$common.messageBox.showMessageBox(vm, '오류', '생성에 실패 하였습니다.')
        }
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
    readBoard (ctx, callback) {
      const vm = this
      vm.query
        .setSort(vm.sort)
        .setFilter(vm.search)
        .count()
        .find(callback)
    }
  }
}
</script>

<style>

</style>