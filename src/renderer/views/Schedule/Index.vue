<template>
  <b-container class="my-3" fluid>
    <FullCalendar locale="ko"
      ref="fullCalendar"
      defaultView="dayGridMonth"
      :plugins="calendarPlugins"
      @dateClick="handleDataClick"
      @eventClick="handleEventClick"
      :events="readSchedule"
      :displayEventTime="false"
      :height="500"/>

    <b-modal id="modal-add-schedule" ref="modal" title="일정 등록" size="xl"
      @ok="writeSchedule" @shown="addScheduleModalShown" @hidden="addScheduleModalHide"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="light"
      body-text-variant="dark"
      footer-bg-variant="warning"
      footer-text-variant="dark">
      <b-container fluid>
        <b-row class="mb-1">
          <b-col cols="3">제목</b-col>
          <b-col><b-input ref="title" v-model="form.title" size="sm" @keyup.enter="writeSchedule"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">일정</b-col>
          <b-col>
            <b-datepicker v-model="form.start" size="sm"
                        @context="onContextStart"
                        locale="ko-KR"
                        ref="start">
            </b-datepicker>
          </b-col>
          <b-col>
            <b-datepicker v-model="form.end" size="sm"
                        @context="onContextEnd"
                        locale="ko-KR"
                        ref="end">
            </b-datepicker>
          </b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">색상</b-col>
          <b-col>
            <div class="color-picker" style="background:#173F5F;" @click="selectColor('#173F5F', 'white')"></div>
            <div class="color-picker" style="background:#20639B;" @click="selectColor('#20639B', 'white')"></div>
            <div class="color-picker" style="background:#3CAEA3;" @click="selectColor('#3CAEA3', 'white')"></div>
            <div class="color-picker" style="background:#F6D55C;" @click="selectColor('#F6D55C', 'black')"></div>
            <div class="color-picker" style="background:#ED553B;" @click="selectColor('#ED553B', 'white')"></div>
            <div class="color-picker" style="background:#5B4DB7;" @click="selectColor('#5B4DB7', 'white')"></div>
            <div class="color-picker" style="background:#81D152;" @click="selectColor('#81D152', 'black')"></div>
            <div class="color-picker" style="background:#FF9D4F;" @click="selectColor('#FF9D4F', 'black')"></div>
          </b-col>
        </b-row>
      </b-container>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-container fluid>
          <b-row>
            <b-col cols="auto" class="mr-auto">
              <b-button v-show="form._id" variant="danger" size="sm" @click="deleteSchedule">
                삭제
              </b-button>
            </b-col>
            <b-col cols="auto">
              <b-button variant="success" @click="ok()" size="sm">
                {{ okButtonText }}
              </b-button>
              <b-button variant="secondary" @click="cancel()" size="sm">
                취소
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </template>
      <input type="hidden" v-model="form._id"/>
    </b-modal>
  </b-container>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  components: {
    FullCalendar
  },
  data () {
    return {
      calendarPlugins: [ dayGridPlugin, interactionPlugin ],
      okButtonText: '생성',
      form: {
        start: null,
        end: null,
        title: '',
        _id: '',
        backgroundColor: '',
        borderColor: '',
        textColor: ''
      }
    }
  },
  created () {
    this.$bus.$emit(this.$common.enum.emitMessage.SET_MENU_NAVIGATE, [{ text: '일정 관리', to: { path: '/schedule' } }])
  },
  methods: {
    handleDataClick (arg) {
      this.form.start = arg.dateStr
      this.form.end = arg.dateStr
      this.form._id = ''
      this.okButtonText = '생성'
      this.$bvModal.show('modal-add-schedule')
    },
    handleEventClick (arg) {
      console.log(arg)
      this.form.title = arg.event.title
      this.form.start = this.$moment(arg.event.start).format('YYYY-MM-DD')
      this.form.end = arg.event.end ? this.$moment(arg.event.end).format('YYYY-MM-DD') : this.$moment(arg.event.start).format('YYYY-MM-DD')
      this.form._id = arg.event.extendedProps._id
      this.form.backgroundColor = arg.event.backgroundColor
      this.form.textColor = arg.event.textColor
      this.form.borderColor = arg.event.borderColor
      this.okButtonText = '수정'
      this.$bvModal.show('modal-add-schedule')
    },
    calendarReload () {
      let calendarApi = this.$refs.fullCalendar.getApi()
      calendarApi.refetchEvents()
    },
    addScheduleModalShown () {
      if (!this.form._id) {
        this.selectColor('#173F5F', 'white')
      } else {
        this.selectColor(this.form.backgroundColor, this.form.textColor)
      }
    },
    addScheduleModalHide () {
      this.form.title = ''
      this.form.start = ''
      this.form.end = ''
      this.form._id = ''
      this.form.backgroundColor = ''
      this.form.textColor = ''
      this.form.borderColor = ''
      this.okButtonText = '수정'
    },
    selectColor (color, fontColor) {
      this.form.backgroundColor = color
      this.form.borderColor = color
      this.form.textColor = fontColor

      this.$refs.title.$el.style.background = color
      this.$refs.title.$el.style.color = fontColor
      this.$refs.title.$el.style['border-color'] = color
    },
    onContextStart (arg) {
      if (this.form.end && arg.selectedDate > this.$moment(this.form.end)._d) {
        this.$common.messageBox.showMessageBox(this, '오류', '시작일은 종료일 보다 클 수 없습니다.')
          .then(() => {
            this.form.start = this.form.end
          })
      }
    },
    onContextEnd (arg) {
      if (this.form.start && arg.selectedDate < this.$moment(this.form.start)._d) {
        this.$common.messageBox.showMessageBox(this, '오류', '종료일은 시작일 보다 작을 수 없습니다.')
          .then(() => {
            this.form.end = this.form.start
          })
      }
    },
    readSchedule (info) {
      const vm = this
      return new Promise((resolve, reject) => {
        vm.$db.scheduleDatastore.find(
          {
            $and: [
              {
                $or: [
                  { start: { $gte: vm.$moment(info.start)._d } },
                  { end: { $gte: vm.$moment(info.start)._d } }
                ]
              },
              {
                $or: [
                  { start: { $lte: vm.$moment(info.end)._d } },
                  { end: { $lte: vm.$moment(info.end)._d } }
                ]
              }
            ]
          },
          (err, rows) => {
            if (err) {
              reject(err)
              return
            }
            resolve(rows)
          })
      })
    },
    deleteSchedule () {
      const vm = this
      vm.$common.messageBox.showConfirmBox(vm, '확인', '정말로 삭제하시겠습니까?', '삭제', '취소', 'danger')
        .then((value) => {
          if (value) {
            vm.$db.scheduleDatastore.remove({ _id: vm.form._id }, {}, function (err, numRemoved) {
              if (err) {
                vm.$common.messageBox.showMessageBox(vm, '오류', '삭제에 실패 하였습니다. 오류 : ' + err)
                return
              }
              vm.$common.messageBox.showMessageBox(vm, '성공', '사용자 정보가 삭제되었습니다.').then((value) => {
                vm.calendarReload()
                vm.$bvModal.hide('modal-add-schedule')
              })
            })
          }
        })
    },
    writeSchedule (modalEvt) {
      const vm = this
      if (!vm.checkValidation()) {
        modalEvt.preventDefault()
        return
      }

      if (vm.form._id) {
        vm.form.start = new Date(vm.form.start)
        vm.form.end = new Date(vm.form.end)
        vm.$db.scheduleDatastore.update({ _id: vm.form._id }, { $set: vm.form }, {}, function (err, a) {
          if (err) {
            vm.$common.messageBox.showMessageBox(vm, '오류', '수정에 실패 하였습니다. 오류 : ' + err)
            return
          }

          vm.calendarReload()
          vm.$bvModal.hide('modal-add-schedule')
        })
      } else {
        vm.$db.scheduleDatastore.insert({
          title: vm.form.title,
          backgroundColor: vm.form.backgroundColor,
          borderColor: vm.form.borderColor,
          textColor: vm.form.textColor,
          start: new Date(vm.form.start),
          end: new Date(vm.form.end),
          createDate: new Date()
        },
        (err) => {
          if (err) {
            vm.$common.messageBox.showMessageBox(vm, '오류', '수정에 실패 하였습니다. 오류 : ' + err)
          }
          vm.calendarReload()
          vm.$bvModal.hide('modal-add-schedule')
        })
      }
    },
    checkValidation () {
      const vm = this
      if (!vm.form.title) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '제목을 입력해주세요.')
        vm.$refs.title.$el.focus()
        return false
      }

      if (!vm.form.start) {
        vm.$common.messageBox.showToast(vm, '필수 항목 누락', '일정을 입력해주세요.')
        vm.$refs.start.$el.focus()
        return false
      }

      return true
    }
  }
}
</script>

<style lang='scss'>
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';

.color-picker {
  width: 30px;
  height: 20px;
  display: inline-block;
  cursor: pointer;
}
</style>