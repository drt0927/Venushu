<template>
  <b-container fluid>
    <b-row class="my-2">
      <b-col>작성자</b-col>
      <b-col cols="3"><b-input v-model="board.name" size="sm" disabled></b-input></b-col>
      <b-col>작성일</b-col>
      <b-col cols="3"><b-input v-model="createDate" size="sm" disabled></b-input></b-col>
      <b-col>공지여부</b-col>
      <b-col cols="3"><b-check v-model="board.isNotice" size="sm"></b-check></b-col>
    </b-row>
    <b-row class="my-2">
      <b-col cols="1">제목</b-col>
      <b-col><b-input v-model="board.title" size="sm"></b-input></b-col>
    </b-row>
    <b-row class="my-2">
      <b-col cols="1">내용</b-col>
      <b-col><b-textarea v-model="board.contents" size="sm" rows="10"></b-textarea></b-col>
    </b-row>
    <b-row>
      <b-col cols="auto" class="mr-auto">
        <b-button variant="danger" @click="deleteBoard" size="sm">삭제</b-button>
      </b-col>
      <b-col cols="auto">
        <b-button variant="success" @click="updateBoard" size="sm">수정</b-button>
        <b-button @click="goIndex" size="sm">목록</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Query from '../../utils/DatastoreHelper'

export default {
  data () {
    return {
      board: {},
      query: new Query(this.$db.boardDatastore)
    }
  },
  created () {
    this.$db.boardDatastore.test()
    this.$bus.$emit(this.$common.enum.emitMessage.SET_MENU_NAVIGATE, [{ text: '공지사항', to: { path: '/board/notice' } }, { text: '상세' }])
  },
  computed: {
    createDate () {
      return this.$moment(this.board.createDate).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted () {
    const vm = this
    vm.query.findOne(this.$route.params.id, (result) => {
      if (!result) {
        vm.goIndex()
        return
      }

      vm.board = result
    })
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/board' })
    },
    deleteBoard () {
      const vm = this
      vm.$common.messageBox.showConfirmBox(vm, '확인', '정말로 삭제하시겠습니까?', '삭제', '취소', 'danger')
        .then((value) => {
          if (value) {
            // vm.query.remove(vm.$route.params.id, () => {
            // })
            vm.$db.boardDatastore.remove({ _id: vm.$route.params.id }, {}, function (err, numRemoved) {
              if (err) {
                vm.$common.messageBox.showMessageBox(vm, '오류', '삭제에 실패 하였습니다. 오류 : ' + err)
                return
              }
              vm.$common.messageBox.showMessageBox(vm, '성공', '게시글이 삭제되었습니다.').then((value) => {
                vm.goIndex()
              })
            })
          }
        })
    },
    updateBoard () {
      const vm = this
      vm.$db.boardDatastore.update({ _id: vm.$route.params.id }, { $set: vm.board }, {}, function (err, a) {
        if (err) {
          vm.$common.messageBox.showMessageBox(vm, '오류', '수정에 실패 하였습니다. 오류 : ' + err)
          return
        }
        vm.$common.messageBox.showMessageBox(vm, '성공', '게시글이 수정되었습니다.').then((value) => {
        })
      })
    }
  }
}
</script>

<style>

</style>
