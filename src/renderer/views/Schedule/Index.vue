<template>
  <b-container class="my-3" fluid>
    <FullCalendar locale="ko"
      ref="fullCalendar"
      defaultView="dayGridMonth"
      :plugins="calendarPlugins"
      @dateClick="handleDataClick"
      @eventClick="handleEventClick"
      :events="readSchedule"
      :displayEventTime="false"/>

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
          <b-col><b-input ref="title" v-model="form.title" @keyup.enter="writeSchedule"></b-input></b-col>
        </b-row>
        <b-row class="mb-1">
          <b-col cols="3">일정</b-col>
          <b-col>
            <b-calendar v-model="form.start"
                        @context="onContextStart"
                        locale="ko-KR"
                        ref="start">
            </b-calendar>
          </b-col>
          <b-col>
            <b-calendar v-model="form.end"
                        @context="onContextEnd"
                        locale="ko-KR"
                        ref="end">
            </b-calendar>
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
        <b-button variant="success" @click="ok()">
          {{ okButtonText }}
        </b-button>
        <b-button variant="danger" @click="cancel()">
          취소
        </b-button>
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
    FullCalendar // make the <FullCalendar> tag available
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
        textColor: '',
        allDay: true
      }
      // ,
      // option: {
      //   className: '',
      //   editable: '',
      //   startEditable: '',
      //   durationEditable: '',
      //   resourceEditable: '',
      //   overlap: '',
      //   constraint: '',
      //   allow: '',
      //   allDayDefault: '',
      //   success: '',
      //   failure: '',
      //   eventDataTransform: ''
      // }
    }
  },
  created () {
    this.$bus.$emit('SET_MENU_NAVIGATE', [{ text: '일정 관리', to: { path: '/schedule' } }])
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
      this.form.title = arg.event.title
      this.form.start = this.$moment(arg.event.start).format('YYYY-MM-DD')
      this.form.end = this.$moment(arg.event.end).format('YYYY-MM-DD')
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
            console.log(err, rows)
            resolve(rows)
          })
      })
    },
    writeSchedule (modalEvt) {
      const vm = this
      if (!vm.checkValidation()) {
        modalEvt.preventDefault()
        return
      }

      if (vm.form._id) {
        // vm.form.start = vm.$moment(vm.form.start)._d
        // vm.form.end = vm.$moment(vm.form.end)._d
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
          // start: vm.$moment(vm.form.start)._d,
          // end: vm.$moment(vm.form.end)._d,
          start: new Date(vm.form.start),
          end: new Date(vm.form.end),
          createDate: new Date()
        },
        (err) => {
          if (!err) {
            console.log(err)
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